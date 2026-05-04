import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "content/blog");

export interface PostData {
    slug: string;
    title: string;
    date: string;
    category: string;
    excerpt: string;
    contentHtml?: string;
    readTime?: string;
}

export function getSortedPostsData(): PostData[] {
    // Ensure directory exists
    if (!fs.existsSync(postsDirectory)) {
        fs.mkdirSync(postsDirectory, { recursive: true });
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith(".md"))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, "");
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const matterResult = matter(fileContents);

            return {
                slug,
                readTime: matterResult.data.readTime || "5 min read",
                ...(matterResult.data as { title: string; date: string; category: string; excerpt: string }),
            };
        });

    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(slug: string): Promise<PostData> {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
        slug,
        contentHtml,
        readTime: matterResult.data.readTime || "5 min read",
        ...(matterResult.data as { title: string; date: string; category: string; excerpt: string }),
    };
}
