import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = "sadish.sugumaran@itappens.ai";
  const passwordHash = await bcrypt.hash("Sujitha@1208", 10);

  // 1. Create or update the Employee
  const employee = await prisma.employee.upsert({
    where: { email },
    update: { passwordHash, name: "Sadish Sugumaran" },
    create: {
      email,
      passwordHash,
      name: "Sadish Sugumaran",
    },
  });

  console.log("Employee created:", employee.email);

  // 2. Seed 5 AEO/GEO Blogs
  const blogs = [
    {
      slug: "what-is-generative-engine-optimization",
      title: "What is Generative Engine Optimization (GEO)?",
      category: "GEO",
      excerpt: "Answer Engines have replaced search. Here is how GEO differs from traditional SEO and why your brand needs it.",
      content: `## The Era of Answer Engines

Traditional SEO relies on keyword density and backlink volume to rank links on a page. Generative Engine Optimization (GEO) targets Large Language Models (LLMs) like ChatGPT, Claude, and Gemini. Instead of ranking links, GEO ensures your brand is the canonical, verified citation in conversational answers.

### Why GEO Matters Now

When users ask an LLM a commercial question, they don't get a list of links; they get a synthesized answer. If your brand's data isn't structured for semantic extraction, your competitors will be cited as the definitive answer.`,
      published: true,
      readTime: "4 min read"
    },
    {
      slug: "how-to-write-for-ai-search",
      title: "How to Structure Content for AI Retrieval",
      category: "AEO",
      excerpt: "Learn the specific formatting rules and entity structures that force LLMs to cite your website as the primary source.",
      content: `## Answer Engine Formatting Rules

LLMs extract answers differently than Google's traditional crawler. To maximize citation frequency:

1. **Information Density**: Answer engines prefer high factual density over conversational fluff.
2. **Entity Clarity**: Clearly define the *who*, *what*, and *where* using strong entity mapping and JSON-LD schema.
3. **Structured Lists**: Models index and retrieve markdown-style lists far more accurately than long paragraphs.

Implement these changes to dominate AEO.`,
      published: true,
      readTime: "5 min read"
    },
    {
      slug: "the-death-of-traditional-seo",
      title: "The Death of Traditional SEO (And What Comes Next)",
      category: "Industry",
      excerpt: "Why the classic playbook of 10 blue links is obsolete, and how forward-thinking Indian brands are pivoting.",
      content: `## The 10 Blue Links Are Dying

Zero-click searches are skyrocketing. Users are satisfied with the AI overviews and no longer click through to websites. For brands relying on organic traffic, this is a crisis.

### The Pivot to Entity Dominance

Instead of fighting for clicks, brands must fight for **citations**. By structuring data and publishing explicit \`llms.txt\` files, companies can control the narrative inside the AI's response itself.`,
      published: true,
      readTime: "6 min read"
    },
    {
      slug: "technical-geo-checklist",
      title: "The 2026 Technical GEO Checklist",
      category: "Technical",
      excerpt: "A tactical guide to making your website perfectly readable by LLM crawlers like GPTBot and ClaudeBot.",
      content: `## Optimize for the Bot

While human UX is important, your site must first be readable by the AI agents sweeping the web.

### The Checklist

1. **Unblock the Crawlers**: Ensure your \`robots.txt\` allows \`GPTBot\`, \`ClaudeBot\`, and \`GoogleOther\`.
2. **Publish llms.txt**: Create a markdown-formatted directory of your site's core facts specifically for AI ingestion.
3. **Deep Schema**: Implement granular \`Organization\`, \`Product\`, and \`FAQ\` JSON-LD schema.`,
      published: true,
      readTime: "7 min read"
    },
    {
      slug: "measuring-geo-success",
      title: "How Do You Measure GEO Success?",
      category: "Strategy",
      excerpt: "Metrics for the AI era: Moving away from traffic and focusing on brand citation frequency and sentiment.",
      content: `## New Metrics for a New Era

If traffic goes down but revenue goes up because an AI directly recommended your product, is that a failure? No. 

### Citation Tracking

The new KPI is **Share of Model Voice (SOMV)**. We measure how frequently a specific LLM (e.g., ChatGPT-4o) cites your brand when asked industry-specific buying questions. 

To track this, you need automated retrieval testing and sentiment analysis across multiple model families.`,
      published: true,
      readTime: "5 min read"
    }
  ];

  for (const blog of blogs) {
    await prisma.blogPost.upsert({
      where: { slug: blog.slug },
      update: { ...blog, authorId: employee.id },
      create: { ...blog, authorId: employee.id },
    });
  }

  console.log("Seeded 5 blog posts.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
