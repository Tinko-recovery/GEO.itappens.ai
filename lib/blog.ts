import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { prisma } from "./db";

export interface PostData {
    slug: string;
    title: string;
    date: string;
    category: string;
    excerpt: string;
    contentHtml?: string;
    readTime?: string;
}

const blogDirectory = path.join(process.cwd(), "content/blog");

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
        return dateStr;
    }
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

interface LocalPost {
    slug: string;
    title: string;
    date: string;
    category: string;
    excerpt: string;
    readTime: string;
    content: string;
}

function getLocalPosts(): LocalPost[] {
    if (!fs.existsSync(blogDirectory)) {
        return [];
    }
    const fileNames = fs.readdirSync(blogDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith(".md"))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, "");
            const fullPath = path.join(blogDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const matterResult = matter(fileContents);

            return {
                slug,
                title: matterResult.data.title || "",
                date: matterResult.data.date || "",
                category: matterResult.data.category || "",
                excerpt: matterResult.data.excerpt || "",
                readTime: matterResult.data.readTime || "5 min read",
                content: matterResult.content,
            };
        });

    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getSortedPostsData(): Promise<PostData[]> {
    try {
        const posts = await prisma.blogPost.findMany({
            where: { published: true },
            orderBy: { createdAt: "desc" },
        });

        if (posts.length > 0) {
            return posts.map(post => ({
                slug: post.slug,
                title: post.title,
                date: post.createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                category: post.category,
                excerpt: post.excerpt,
                readTime: post.readTime,
            }));
        }
    } catch (err) {
        console.warn("Database blog fetch failed, falling back to local files:", err);
    }

    return getLocalPosts().map(({ slug, title, date, category, excerpt, readTime }) => ({
        slug,
        title,
        date: formatDate(date),
        category,
        excerpt,
        readTime,
    }));
}

export async function getPostData(slug: string): Promise<PostData | null> {
    try {
        const post = await prisma.blogPost.findUnique({
            where: { slug }
        });

        if (post && post.published) {
            const processedContent = await remark()
                .use(html)
                .process(post.content);
            const contentHtml = processedContent.toString();

            return {
                slug: post.slug,
                title: post.title,
                date: post.createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                category: post.category,
                excerpt: post.excerpt,
                contentHtml,
                readTime: post.readTime,
            };
        }
    } catch (err) {
        console.warn(`Database fetch for post ${slug} failed, trying local file fallback:`, err);
    }

    const localPosts = getLocalPosts();
    const localPost = localPosts.find(p => p.slug === slug);
    if (!localPost) {
        return null;
    }

    const processedContent = await remark()
        .use(html)
        .process(localPost.content);
    const contentHtml = processedContent.toString();

    return {
        slug: localPost.slug,
        title: localPost.title,
        date: formatDate(localPost.date),
        category: localPost.category,
        excerpt: localPost.excerpt,
        contentHtml,
        readTime: localPost.readTime,
    };
}
