// Blog post data — add LinkedIn posts here manually or via API sync
export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    category: string;
    linkedinUrl?: string;
    content: string;
}

export const posts: BlogPost[] = [
    {
        slug: 'why-geo-is-the-new-seo',
        title: 'Why GEO Is the New SEO — And Why Indian Founders Are Missing It',
        excerpt: 'ChatGPT answers 100M+ queries daily. Google processes 8.5B. The battleground for brand visibility has shifted. Here\'s what that means for your business.',
        date: '2025-03-10',
        readTime: '4 min read',
        category: 'GEO',
        linkedinUrl: 'https://www.linkedin.com/company/itappens-ai/',
        content: `
When someone asks ChatGPT "who's the best B2B SaaS consultant in India" — does your brand appear?

If not, you're invisible to a growing segment of buyers who no longer start with Google.

**GEO (Generative Engine Optimisation)** is the practice of engineering your brand's presence into AI-generated answers — across ChatGPT, Perplexity, Google Gemini, and Claude.

## Why it matters right now

AI search is growing 40% quarter-on-quarter. Perplexity alone crossed 100M queries/month in late 2024. The brands that get embedded into AI training and retrieval now will have a compounding advantage that's nearly impossible to reverse.

## The difference between SEO and GEO

Traditional SEO optimises for a ranked list. GEO optimises for being *the answer*.

When AI summarises a query, it cites 1-3 sources — not 10. If you're not in that shortlist, you don't exist in that conversation.

## How itappens.ai approaches GEO

We start with an AI presence audit — we run 50+ queries relevant to your niche across all major AI models and measure where you currently appear (or don't). Then we engineer the conditions for citation: structured data, authoritative content, semantic consistency, and external signals.

The best part? We run this on ourselves first. itappens.ai is our own proof of concept.

**Interested in an audit for your brand?** Contact founder@tinko.in
        `
    },
    {
        slug: 'content-automation-for-indian-b2b',
        title: 'Why Indian B2B Founders Are Losing Deals on LinkedIn (And How to Fix It)',
        excerpt: 'Your competitor is posting daily. You\'re posting monthly. In LinkedIn\'s algorithm, consistency beats quality. Here\'s how to fix it without hiring a content team.',
        date: '2025-03-08',
        readTime: '3 min read',
        category: 'Content',
        linkedinUrl: 'https://www.linkedin.com/company/itappens-ai/',
        content: `
The decision-maker you're trying to reach checks LinkedIn 3-4 times a day. They see your competitor 5 times a week. They see you once a month.

Who do they remember when the brief comes in?

**The consistency gap is a silent deal-killer** for most Indian B2B founders.

## The math is brutal

LinkedIn's algorithm favours accounts that post 5+ times per week. Accounts that post less than twice a week receive ~40% less organic reach per post. So your one "great" post performs worse than your competitor's "average" daily post.

## Why founders don't post consistently

1. No time — they're running the business
2. No system — every post is a cold start
3. No team — can't justify a full-time content hire

## The itappens approach

We build an automated content system that:
- Reads today's top AI/tech trends every morning
- Generates a LinkedIn post in your brand voice
- Sends it for your approval (30 seconds)
- Schedules it for peak engagement time

You stay in control. Your presence stays consistent.

The result: 5x weekly posts, zero daily effort, compounding brand visibility.

**Want to see it in action?** Start at itappens.ai/pricing
        `
    },
    {
        slug: 'itappens-runs-on-itself',
        title: 'We Built the Engine. Then We Turned It On Ourselves.',
        excerpt: 'itappens.ai\'s social media runs entirely on itappens Content. No human writes our LinkedIn posts. Here\'s what we\'ve learned from being our own first client.',
        date: '2025-03-05',
        readTime: '5 min read',
        category: 'Behind the Build',
        linkedinUrl: 'https://www.linkedin.com/company/itappens-ai/',
        content: `
Every morning at 6 AM, our engine wakes up.

It scans HackerNews, Reddit, and industry feeds for the most relevant AI and business stories. It picks the strongest signal. It writes a LinkedIn post, a tweet, and an Instagram caption — in itappens.ai's brand voice. A preview arrives by email. One click to approve. Done.

We don't have a content team. We have a content engine.

## Why this matters

The first question any serious client asks is: "Does this actually work?"

The best answer is: "Look at our own LinkedIn."

itappens.ai's company LinkedIn page, Twitter/X, and Instagram are entirely automated by the same product we sell. If you like what you see there, you're already seeing the output — not a polished demo.

## What we've learned

**Brand voice is trainable.** After calibrating the prompts for 2 weeks, the AI writes in a voice that sounds like us — confident, direct, data-led, no corporate fluff.

**Consistency builds faster than quality.** Our lower-effort daily posts outperform our "crafted" posts on reach every time.

**Zero-touch is achievable.** Once calibrated, the system runs without intervention 95% of the time.

## What's next

We're opening this up to 10 early clients. Same engine, your brand voice. Contact founder@tinko.in to get started.
        `
    },
];

export function getPost(slug: string): BlogPost | undefined {
    return posts.find(p => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
    return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
