import { NextRequest, NextResponse } from 'next/server';

// AI crawlers allowed to access /llms.txt
const AI_CRAWLERS = [
    'perplexitybot',
    'gptbot',
    'oai-searchbot',
    'chatgpt',
    'anthropic-ai',
    'claude-web',
    'google-extended',
    'cohere-ai',
    'you-bot',
    'bingbot',
    'applebot',
    'ia_archiver',
    'baiduspider',
];

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname === '/llms.txt') {
        const ua = (request.headers.get('user-agent') || '').toLowerCase();

        // Allow known AI/search crawlers
        const isAICrawler = AI_CRAWLERS.some(bot => ua.includes(bot));

        // Block all human browsers
        if (!isAICrawler) {
            return NextResponse.redirect(new URL('/', request.url), { status: 302 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/llms.txt'],
};
