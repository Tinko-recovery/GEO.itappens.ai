"""
tools/knowledge_ingestion_tool.py
──────────────────────────────────
KnowledgeIngestionTool: Transforms raw business documentation into a GEO-optimized brain.json.
Features: Playwright scraping, pyPDF extraction, Gemini 1.5 Pro synthesis, and Stealth Mode.
"""

import os
import json
import logging
import asyncio
from typing import List, Dict, Any
from pathlib import Path
from datetime import datetime

# Optional dependencies (checked at runtime or assumed installed via requirements.txt)
try:
    from playwright.async_api import async_playwright
except ImportError:
    async_playwright = None

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# ── Configuration ─────────────────────────────────────────────────────────────

FORBIDDEN_ENTITIES = [
    "Sadish Sugumaran",
    "Sadish S.",
    "S. Sugumaran",
    "SadishS",
    "sadish.s",
    "sadish@itappens.ai",
]

STEALTH_REPLACEMENT = "The Principal"
MODEL_NAME = "gemini-3-flash-preview" # Switching to Flash to resolve 429 quota errors
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"

# ── Tool Implementation ───────────────────────────────────────────────────────

class KnowledgeIngestionTool:
    """
    Ingests PDFs and URLs from itcontents/knowledge/ and generates/updates a structured brain.json.
    """

    def __init__(self, customer_id: str, knowledge_dir: str = "itcontents/knowledge"):
        self.customer_id = customer_id
        self.knowledge_path = Path(knowledge_dir)
        self.brain_file = self.knowledge_path / "brain.json"
        
        # Initialize Gemini
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            try:
                self.model = genai.GenerativeModel(MODEL_NAME)
            except:
                self.model = genai.GenerativeModel("gemini-pro") # Final fallback
        else:
            self.model = None
            logger.error("GOOGLE_API_KEY not found. Gemini synthesis will fail.")

    async def run_ingestion(self) -> Dict[str, Any]:
        """
        Execute the full ingestion pipeline: Scrape -> Parse -> Synthesize -> Merge.
        """
        from customer.customer_brain import CustomerBrain
        brain_data = CustomerBrain.load(self.customer_id)
        if brain_data.get("tier") != "Scale":
            logger.warning("Tier check failed for %s. Scale Plan required for vault ingestion.", self.customer_id)
            return {"status": "error", "message": "Scale Plan required to unlock autonomous Knowledge Vault."}

        logger.info("Starting knowledge ingestion for %s", self.customer_id)
        
        # 1. Scrape URLs
        urls = self._get_context_urls()
        scraped_text = ""
        if urls:
            scraped_text = await self._scrape_urls(urls)
        
        # 2. Extract PDF Text
        pdf_text = self._extract_pdf_text()
        
        combined_raw_text = f"--- SCRAPED WEB CONTENT ---\n{scraped_text}\n\n--- PDF CONTENT ---\n{pdf_text}"
        
        if not combined_raw_text.strip():
            return {"status": "error", "message": "No content found in knowledge folder or URLs."}

        # 3. AI Synthesis & Sanitization
        if not self.model:
            return {"status": "error", "message": "Gemini 1.5 Pro not configured."}

        analysis = await self._synthesize_with_ai(combined_raw_text)
        sanitized_analysis = self._apply_stealth_filter(analysis)

        # 4. Semantic Merge
        final_brain = self._semantic_merge(sanitized_analysis)
        
        # 5. Save output
        self._save_brain(final_brain)
        
        return {
            "status": "success",
            "message": f"Brain updated. Entities found: {len(final_brain.get('entities', []))}",
            "brain": final_brain
        }

    # ── Internal Methods ─────────────────────────────────────────────────────

    def _get_context_urls(self) -> List[str]:
        url_file = self.knowledge_path / "context_urls.txt"
        if url_file.exists():
            content = url_file.read_text(encoding="utf-8")
            return [line.strip() for line in content.splitlines() if line.strip().startswith("http")]
        return []

    async def _scrape_urls(self, urls: List[str]) -> str:
        """Use Playwright to scrape clean text from URLs."""
        if not async_playwright:
            logger.warning("Playwright not installed. Skipping web scraping.")
            return ""

        output = []
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            # Use a common User-Agent to avoid bot detection
            context = await browser.new_context(user_agent=USER_AGENT)
            page = await context.new_page()
            for url in urls:
                try:
                    logger.info("Scraping %s...", url)
                    await page.goto(url, timeout=30000)
                    # Simple text extraction for now
                    text = await page.evaluate("document.body.innerText")
                    output.append(f"URL: {url}\nCONTENT:\n{text}\n")
                except Exception as e:
                    logger.error("Failed to scrape %s: %s", url, e)
            await browser.close()
        return "\n".join(output)

    def _extract_pdf_text(self) -> str:
        """Extract text from all PDFs in the knowledge directory."""
        if not PdfReader:
            logger.warning("pypdf not installed. Skipping PDF extraction.")
            return ""

        output = []
        for pdf_file in self.knowledge_path.glob("*.pdf"):
            try:
                logger.info("Extracting %s...", pdf_file.name)
                reader = PdfReader(pdf_file)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
                output.append(f"FILE: {pdf_file.name}\nCONTENT:\n{text}\n")
            except Exception as e:
                logger.error("Failed to parse PDF %s: %s", pdf_file, e)
        return "\n".join(output)

    async def _synthesize_with_ai(self, raw_text: str) -> Dict[str, Any]:
        """Use Gemini 1.5 Pro to extract structured intelligence."""
        prompt = (
            "You are a Senior AI Systems Architect and GEO Specialist. "
            "Analyze the following raw business documentation and extract a structured intelligence report.\n\n"
            "RAW TEXT:\n" + raw_text[:50000] + "\n\n" # Limit input to 50k chars for stability
            "GOAL: Transform this into a JSON object for itappens.ai 'CustomerBrain'.\n\n"
            "EXTRACT THE FOLLOWING FIELDS:\n"
            "1. entities: A list of primary brand concepts, products, services, and unique proprietary terms.\n"
            "2. geo_triggers: Specific phrases and data points that build 'Citation Gravity' (what should an AI cite?).\n"
            "3. brand_dna: Tone of voice, style constraints, and core values.\n"
            "4. semantic_hooks: For every major concept/URL, provide one 'Semantic Hook' that a search agent like Perplexity can latch onto.\n"
            "5. deep_context: A 2-3 paragraph summary of the product's actual USPs and depth.\n\n"
            "FORMAT: Return ONLY valid JSON."
        )

        try:
            # We run in the executor because the genai call might be blocking
            response = await asyncio.get_event_loop().run_in_executor(
                None, lambda: self.model.generate_content(prompt)
            )
            content = response.text.strip()
            # Clean JSON if wrapped in markdown blocks
            if "```json" in content:
                content = content.split("```json")[-1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[-1].split("```")[0].strip()
            
            return json.loads(content)
        except Exception as e:
            logger.error("AI Synthesis failed: %s", e)
            return {}

    def _apply_stealth_filter(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Aggressive sanitization using regex fuzzy matching."""
        import re
        json_str = json.dumps(data)
        
        # Build an aggressive regex for all forbidden patterns
        # We also look for partial name matches and common email patterns
        for item in FORBIDDEN_ENTITIES:
            # Escape for regex and allow for slight variations (case insensitive)
            pattern = re.compile(re.escape(item), re.IGNORECASE)
            json_str = pattern.sub(STEALTH_REPLACEMENT, json_str)
        
        # Secondary sweep for loose name patterns (e.g., Sadish [Anything])
        # This prevents "Sadish" or "Sugumaran" appearing solo if part of the name
        loose_patterns = [r"Sadish\s+\w+", r"Sugumaran", r"\bSadish\b"]
        for lp in loose_patterns:
            json_str = re.sub(lp, STEALTH_REPLACEMENT, json_str, flags=re.IGNORECASE)
        
        return json.loads(json_str)

    def _semantic_merge(self, new_data: Dict[str, Any]) -> Dict[str, Any]:
        """Intelligently merge new findings with existing brain.json."""
        if not self.brain_file.exists():
            return new_data

        try:
            old_data = json.loads(self.brain_file.read_text(encoding="utf-8"))
            
            # Simple merge logic: For lists, combine and dedup. For strings, update if newer or more detailed.
            # In a real "Semantic Merge", we might use an LLM again, but for now we do logical merging.
            
            merged = old_data.copy()
            
            for key, value in new_data.items():
                if isinstance(value, list):
                    existing = merged.get(key, [])
                    # Append new items that aren't already there (case-insensitive check)
                    for item in value:
                        if isinstance(item, str):
                            if item.lower() not in [e.lower() for e in existing if isinstance(e, str)]:
                                existing.append(item)
                        else:
                            existing.append(item)
                    merged[key] = existing
                else:
                    # Overwrite/Update strings and objects
                    merged[key] = value
            
            merged["last_ingested_at"] = datetime.utcnow().isoformat()
            return merged
        except Exception as e:
            logger.error("Semantic merge failed: %s", e)
            return new_data

    def _save_brain(self, brain: Dict[str, Any]) -> None:
        self.brain_file.write_text(json.dumps(brain, indent=2), encoding="utf-8")
        logger.info("Saved brain.json to %s", self.brain_file)

if __name__ == "__main__":
    # Test run
    logging.basicConfig(level=logging.INFO)
    tool = KnowledgeIngestionTool(customer_id="test_customer")
    asyncio.run(tool.run_ingestion())
