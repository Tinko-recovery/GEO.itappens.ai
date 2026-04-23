import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export type GenerationProgress = {
  copy: string;
  image_url: string;
  platforms: {
    linkedin_personal: string;
    linkedin_brand: string;
    twitter: string;
    instagram: string;
  };
}

export async function generateSocialContent(topic: string, brandConfig: any) {
  const { brandName, niche, tone, persona, targetAudience, cta, website } = brandConfig

  const prompt = `
    TASK: Generate a high-conversion social media campaign for the following brand/niche.
    BRAND: ${brandName}
    NICHE: ${niche}
    TONE: ${tone}
    PERSONA: ${persona}
    AUDIENCE: ${targetAudience}
    CTA: ${cta}
    WEBSITE: ${website}
    TOPIC: ${topic}

    REQUIREMENTS:
    1. LinkedIn Personal Post: Professional, authority-building, no hashtags. Under 1000 characters.
    2. LinkedIn Brand Post: Company focused, process/proof oriented. Under 1000 characters.
    3. Twitter/X Post: Short, punchy, controversial or high-insight. Under 280 characters. 1-2 hashtags.
    4. Instagram Caption: Visual-first hook, fast-paced, emojis included. 5-8 hashtags.
    5. DALL-E Image Prompt: A cinematic, high-quality visual prompt describing a scene related to the topic (NO text in image).

    FORMAT YOUR RESPONSE EXACTLY AS:
    ---LINKEDIN_PERSONAL---
    [Content]
    ---LINKEDIN_BRAND---
    [Content]
    ---TWITTER---
    [Content]
    ---INSTAGRAM---
    [Content]
    ---IMAGE_PROMPT---
    [Content]
  `

  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2000,
    temperature: 0.7,
    messages: [{ role: "user", content: prompt }],
  })

  // @ts-ignore
  const text = msg.content[0].text
  const sections = text.split(/---[A-Z_]+---/)
  
  const result = {
    linkedin_personal: sections[1]?.trim() || "",
    linkedin_brand: sections[2]?.trim() || "",
    twitter: sections[3]?.trim() || "",
    instagram: sections[4]?.trim() || "",
    image_prompt: sections[5]?.trim() || ""
  }

  // Generate Image
  let imageUrl = ""
  if (!process.env.OPENAI_API_KEY) {
    console.error("DEBUG: OPENAI_API_KEY is missing in environment.")
  } else {
    try {
      console.log("DEBUG: Starting DALL-E 3 generation for prompt:", result.image_prompt)
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: result.image_prompt,
        n: 1,
        size: "1024x1024",
      })
      imageUrl = response.data?.[0]?.url || ""
      console.log("DEBUG: DALL-E 3 success. URL:", imageUrl)
    } catch (err: any) {
      console.error("DEBUG: DALL-E generation failed explicitly with error:", err?.message || err)
    }
  }

  return {
    ...result,
    image_url: imageUrl
  }
}
