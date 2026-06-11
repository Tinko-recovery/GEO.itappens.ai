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

export async function getSortedPostsData(): Promise<PostData[]> {
    const posts = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
    });

    return posts.map(post => ({
        slug: post.slug,
        title: post.title,
        date: post.createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        category: post.category,
        excerpt: post.excerpt,
        readTime: post.readTime,
    }));
}

export async function getPostData(slug: string): Promise<PostData | null> {
    const post = await prisma.blogPost.findUnique({
        where: { slug }
    });

    if (!post || !post.published) return null;

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
