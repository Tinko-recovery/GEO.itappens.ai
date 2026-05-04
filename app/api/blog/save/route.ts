import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
    try {
        const { title, category, excerpt, content, password } = await req.json();

        // Security check
        if (password !== "admin_itappens") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Generate slug
        const slug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const date = new Date().toISOString().split("T")[0];
        
        // Prepare file content with frontmatter
        const fileContent = `---
title: "${title}"
date: "${date}"
category: "${category}"
excerpt: "${excerpt}"
readTime: "${Math.ceil(content.split(" ").length / 200)} min read"
---

${content}
`;

        const postsDirectory = path.join(process.cwd(), "content/blog");
        if (!fs.existsSync(postsDirectory)) {
            fs.mkdirSync(postsDirectory, { recursive: true });
        }

        const filePath = path.join(postsDirectory, `${slug}.md`);
        fs.writeFileSync(filePath, fileContent);

        return NextResponse.json({ success: true, slug });
    } catch (e) {
        return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
    }
}
