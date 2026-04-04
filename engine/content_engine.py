import os
import requests
import base64
import anthropic
import openai
from dotenv import load_dotenv

load_dotenv()

class ContentEngine:
    def __init__(self):
        self.ant_client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.oa_client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-5-20250929")
        
        # Dynamic Brand Configuration
        self.persona = os.getenv("AI_PERSONA", (
            "You are a thought leader in the AI for Business space, known for your 'Human-First' approach. "
            "Your writing style is personal, storytelling-oriented, and avoids tech-bro jargon."
        ))
        self.brand_voice = os.getenv("BRAND_VOICE", (
            "Mentor talking to a friend over coffee, focusing on real-world impact and ethical implementation."
        ))
        self.company_name = os.getenv("COMPANY_NAME", "itappens.ai")
        self.footer_branding = os.getenv("FOOTER_BRANDING", "— itappens.ai Principal")
        self.reel_cta = os.getenv("REEL_CTA", "Limited slots for March automation coaching. Link in bio.")

    async def generate_content(self, data):
        """Generates agency brand content for itappens.ai across all channels."""
        title = data.get("title", "AI Innovation")
        hook = data.get("hook", "")
        category = data.get("category", "General")

        source_url = data.get("source_url")
        citation = f"\nSource: {source_url}" if source_url else ""
        footer = (
            f"{citation}\n"
            f"Disclaimer: This content is AI-generated and posted by our own engine.\n\n"
            f"— itappens.ai | AI brand visibility + content automation\n"
            f"📧 hello@itappens.ai"
        )

        prompt = (
            f"You are the content voice of itappens.ai — India's first AI brand visibility agency.\n"
            f"itappens.ai has two services: GEO (making brands appear in AI answers like ChatGPT/Perplexity) "
            f"and itcontents (AI-powered social media automation).\n"
            f"Voice: Confident, data-led, principal-led. Provocative but not arrogant. "
            f"Your audience is Indian B2B founders and marketing heads.\n\n"
            f"Today's trending topic: {title}\n"
            f"Hook angle: {hook}\n"
            f"Industry category: {category}\n\n"
            "Generate THREE pieces of brand content:\n\n"
            "1. LINKEDIN_COMPANY post (as itappens.ai):\n"
            "   - Open with a strong data point or contrarian take\n"
            "   - Connect the trend to AI brand visibility or content automation\n"
            "   - Position itappens.ai as the solution\n"
            "   - End with CTA: 'DM or email hello@itappens.ai to audit your brand's AI presence'\n"
            "   - UNDER 1200 characters. No fluff.\n\n"
            "2. TWITTER post:\n"
            "   - Punchy 1-2 lines max. Under 240 characters.\n"
            "   - Either a hot take, a stat, or a 'did you know' that makes someone stop scrolling\n"
            "   - End with: itappens.ai\n\n"
            "3. INSTAGRAM caption:\n"
            "   - Hook in first line (make them tap 'more')\n"
            "   - 3-4 lines of value\n"
            "   - CTA: 'DM AUDIT for a free AI presence check'\n"
            "   - 5 relevant hashtags\n\n"
            "4. DALL-E IMAGE PROMPT:\n"
            "   - Cinematic, metaphoric, moody. No text in image.\n"
            "   - Represents the core idea of the trend visually\n"
            "   - Dark aesthetic, dramatic lighting, 8K quality\n\n"
            "Format EXACTLY as:\n"
            "---LINKEDIN_COMPANY---\n"
            "[Content]\n"
            "---TWITTER---\n"
            "[Content]\n"
            "---INSTAGRAM---\n"
            "[Content]\n"
            "---IMAGE_PROMPT---\n"
            "[Prompt]"
        )

        response = await self.ant_client.messages.create(
            model=self.model,
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )

        content_text = response.content[0].text
        parsed = self._parse_content(content_text)

        # Append footer to text posts
        for key in ["linkedin_company", "twitter", "instagram"]:
            if parsed.get(key):
                parsed[key] = parsed[key] + "\n\n" + footer

        # Generate brand image
        if parsed.get("image_prompt"):
            print(f"🎨 Generating image...")
            try:
                img_res = await self.oa_client.images.generate(
                    model="dall-e-3",
                    prompt=parsed["image_prompt"],
                    size="1024x1024",
                    quality="standard",
                    n=1
                )
                temp_url = img_res.data[0].url
                print("✅ Image generated! Uploading to permanent host...")
                permanent_url = self._reupload_to_imgur(temp_url)
                parsed["image_url"] = permanent_url or temp_url
                print(f"📸 Image hosted at: {parsed['image_url']}")
            except Exception as e:
                print(f"❌ Image generation failed: {e}")
                parsed["image_url"] = None

        return parsed

    def _reupload_to_imgur(self, image_url):
        """Downloads an image from a URL and uploads it to Imgur anonymously."""
        try:
            # Download the image
            img_data = requests.get(image_url, timeout=30)
            img_data.raise_for_status()
            
            # Encode to base64
            b64_image = base64.b64encode(img_data.content).decode("utf-8")
            
            # Upload to Imgur anonymously (Client-ID is the public API key)
            imgur_client_id = os.getenv("IMGUR_CLIENT_ID", "546c25a59c58ad7")  # Public fallback
            response = requests.post(
                "https://api.imgur.com/3/image",
                headers={"Authorization": f"Client-ID {imgur_client_id}"},
                data={"image": b64_image, "type": "base64"},
                timeout=30
            )
            result = response.json()
            if result.get("success"):
                return result["data"]["link"]
            else:
                print(f"Imgur upload error: {result}")
                return None
        except Exception as e:
            print(f"Imgur re-upload failed: {e}")
            return None

    async def generate_reel_slides(self, data):
        """Generates 5 slide scripts + per-slide DALL-E prompts for an Instagram Reel."""
        title = data.get("title", "AI Innovation")
        hook = data.get("hook", "")
        category = data.get("category", "General")
        directive = data.get("directive", "").strip()
        directive_context = ""
        if directive:
            directive_context = (
                f"\n🚨 HIGH PRIORITY CLIENT DIRECTIVE: {directive}\n"
                "The client has requested to focus specifically on this. Skip generic trends—make this the star of the Reel."
            )

        prompt = (
            f"PERSONA: {self.persona}\n"
            f"VOICE: {self.brand_voice}\n\n"
            f"Context: 30-day series on {category}. Topic: {title}. Hook: {hook}\n"
            f"{directive_context}\n\n"
            "Create an Instagram Reel with exactly 5 slides. This needs to feel like a high-value masterclass.\n"
            "For each slide provide:\n"
            "- HEADING: A provocative or deep-insight line (max 6 words)\n"
            "- TEXT: A companion insight that challenges the reader (max 15 words)\n"
            "- IMAGE_PROMPT: A DALL-E prompt for a cinematic, high-end visual background (surreal, metaphoric, dramatic lighting, 8k resolution, no text, moody atmosphere)\n\n"
            f"Also provide a REEL_CAPTION: A short, compelling description ending with '{self.reel_cta}' + 5 hashtags.\n\n"
            "Format EXACTLY as:\n"
            "---SLIDE_1---\n"
            "HEADING: ...\n"
            "TEXT: ...\n"
            "IMAGE_PROMPT: ...\n"
            "---SLIDE_2---\n"
            "HEADING: ...\n"
            "TEXT: ...\n"
            "IMAGE_PROMPT: ...\n"
            "---SLIDE_3---\n"
            "HEADING: ...\n"
            "TEXT: ...\n"
            "IMAGE_PROMPT: ...\n"
            "---SLIDE_4---\n"
            "HEADING: ...\n"
            "TEXT: ...\n"
            "IMAGE_PROMPT: ...\n"
            "---SLIDE_5---\n"
            "HEADING: ...\n"
            "TEXT: ...\n"
            "IMAGE_PROMPT: ...\n"
            "---REEL_CAPTION---\n"
            "[Caption + hashtags]"
        )

        response = await self.ant_client.messages.create(
            model=self.model,
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )

        return self._parse_reel_slides(response.content[0].text)

    def _parse_reel_slides(self, content):
        """Parse Claude's reel slide output into structured data."""
        import re
        slides = []
        for i in range(1, 6):
            pattern = rf"---SLIDE_{i}---(.*?)(?=---SLIDE_{i+1}---|---REEL_CAPTION---|$)"
            match = re.search(pattern, content, re.DOTALL)
            if match:
                block = match.group(1).strip()
                heading = re.search(r"HEADING:\s*(.+)", block)
                text = re.search(r"TEXT:\s*(.+)", block)
                img_prompt = re.search(r"IMAGE_PROMPT:\s*(.+)", block, re.DOTALL)
                slides.append({
                    "heading": heading.group(1).strip() if heading else f"Slide {i}",
                    "text": text.group(1).strip() if text else "",
                    "image_prompt": img_prompt.group(1).strip()[:500] if img_prompt else ""
                })

        caption_match = re.search(r"---REEL_CAPTION---(.*?)$", content, re.DOTALL)
        caption = caption_match.group(1).strip() if caption_match else ""

        print(f"--- DEBUG: Parsed {len(slides)} reel slides ---")
        return {"slides": slides, "caption": caption}

    def _parse_content(self, content):
        """Parse Claude's agency content output."""
        import re
        result = {}

        sections = {
            "linkedin_company": r"---LINKEDIN_COMPANY---\s*(.*?)(?=---TWITTER---|---INSTAGRAM---|---IMAGE_PROMPT---|$)",
            "twitter": r"---TWITTER---\s*(.*?)(?=---INSTAGRAM---|---IMAGE_PROMPT---|$)",
            "instagram": r"---INSTAGRAM---\s*(.*?)(?=---IMAGE_PROMPT---|$)",
            "image_prompt": r"---IMAGE_PROMPT---\s*(.*?)$",
        }

        for key, pattern in sections.items():
            match = re.search(pattern, content, re.DOTALL)
            result[key] = match.group(1).strip() if match else ""

        result["image_prompt"] = result["image_prompt"].replace("```", "").strip()
        print(f"✅ Parsed content keys: {[k for k, v in result.items() if v]}")
        return result

if __name__ == "__main__":
    # Test generation
    engine = ContentEngine()
    test_data = {
        "title": "The 8 Pages That Changed AI",
        "hook": "8 pages. That's all it took to flip the industry.",
        "category": "Untold Origin Story",
        "footer": "made by itappens.ai (automations by Principal)"
    }
    print(engine.generate_content(test_data))
