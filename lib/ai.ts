import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

/**
 * Generate a 2000+ word AEO-optimized article in HTML format using Claude 3 Haiku.
 */
export async function generateAEOArticle(
  topic: string, 
  ecommerceUrl?: string | null,
  options?: {
    toneOfVoice?: string | null;
    targetAudience?: string | null;
    formattingRules?: string | null;
  }
): Promise<string> {
  let prompt = `You are an expert Answer Engine Optimization (AEO) copywriter. 
Your goal is to write a highly informative, deep-dive article about: "${topic}".

Requirements:
1. Length: 1500 to 2000+ words.
2. Structure: Use H2s, H3s, bullet points, and at least one structured <table>.
3. Optimization: Format it so Answer Engines (Perplexity, ChatGPT) can easily extract the facts. Include a "Key Takeaways" section at the top.
4. Output format: Return pure HTML. Do not wrap in markdown \`\`\`html blocks, just return the raw HTML string starting with <h2> or <h1>.`;

  if (options?.toneOfVoice) {
    prompt += `\n5. Tone of Voice: ${options.toneOfVoice}`;
  }
  if (options?.targetAudience) {
    prompt += `\n6. Target Audience: ${options.targetAudience}`;
  }
  if (options?.formattingRules) {
    prompt += `\n7. Custom Formatting Rules: ${options.formattingRules}`;
  }

  if (ecommerceUrl) {
    prompt += `\n\nCRITICAL E-COMMERCE CONSTRAINT:
The user is trying to sell a product at this URL: ${ecommerceUrl}. 
You MUST weave a contextual, natural-sounding recommendation for this product into the article, ideally as the ultimate solution to the problem being discussed. 
Include the exact URL as an HTML <a href="${ecommerceUrl}"> link within the text.`;
  }

  prompt += `\n\nWrite the article now:`;

  const msg = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 4000,
    temperature: 0.7,
    messages: [
      { role: "user", content: prompt }
    ]
  });

  const content = msg.content[0].type === 'text' ? msg.content[0].text : '';
  return content.replace(/^```html|```$/gm, '').trim();
}

/**
 * Fetch a high-quality free stock photo from Unsplash based on a query.
 */
export async function fetchUnsplashImage(query: string): Promise<{ url: string; author: string } | null> {
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    console.warn("Missing UNSPLASH_ACCESS_KEY, returning default fallback.");
    return { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080&q=80', author: 'Unsplash Default' };
  }

  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=1`, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });

    if (!res.ok) return null;
    
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const img = data.results[0];
      return {
        url: img.urls.regular,
        author: img.user.name
      };
    }
    return null;
  } catch (error) {
    console.error("Unsplash API error:", error);
    return null;
  }
}
