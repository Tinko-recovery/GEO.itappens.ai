"""
tools/geo_auditor_tool.py
────────────────────────
Weaponized GEO Audit Engine: Scrapes a site via Playwright and uses Gemini 3.1 Pro 
to generate a "Semantic Displacement" report with Token Gap analysis and Stealth Mode.
"""

import os
import json
import logging
import asyncio
import re
from typing import Dict, Any, List
from pathlib import Path

import google.generativeai as genai
from playwright.async_api import async_playwright
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
MODEL_NAME = "gemini-3.1-pro" # High-end synthesis for weaponized audits
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"

# ── Tool Implementation ───────────────────────────────────────────────────────

class GeoAuditorTool:
    """
    Weaponized audit engine for itappens.ai.
    Generates a "GEO Battlecard" comparing a target URL to semantic rivals.
    """

    def __init__(self):
        # Initialize Gemini
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            try:
                self.model = genai.GenerativeModel(MODEL_NAME)
            except Exception as e:
                logger.warning(f"Model {MODEL_NAME} failed, falling back to gemini-pro: {e}")
                self.model = genai.GenerativeModel("gemini-pro")
        else:
            self.model = None
            logger.error("GOOGLE_API_KEY not found. GEO Audit synthesis will fail.")

    async def run_audit(self, target_url: str) -> str:
        """
        Runs a full weaponized audit on a target URL.
        Returns a markdown report.
        """
        logger.info("Initiating weaponized GEO audit for: %s", target_url)

        # 1. Scrape the target URL
        scraped_content = await self._scrape_url(target_url)
        if not scraped_content:
            return "ERROR: Could not ingest the target site. Check the URL and try again."

        # 2. AI Analysis & Battlecard Generation
        report = await self._generate_weaponized_report(target_url, scraped_content)

        # 3. Apply Stealth Protocol
        sanitized_report = self._apply_stealth_filter(report)

        return sanitized_report

    async def _scrape_url(self, url: str) -> str:
        """Playwright-powered deep-scrape."""
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                context = await browser.new_context(user_agent=USER_AGENT)
                page = await context.new_page()
                await page.goto(url, timeout=30000, wait_until="networkidle")
                content = await page.evaluate("document.body.innerText")
                await browser.close()
                return content
        except Exception as e:
            logger.error("Failed to scrape %s: %s", url, e)
            return ""

    async def _generate_weaponized_report(self, url: str, content: str) -> str:
        """Gemini 3.1 Pro: Generate the GEO Battlecard."""
        if not self.model:
            return "ERROR: Gemini 3.1 Pro is not configured."

        prompt = (
            "Role: Senior AI Systems Architect & GEO Specialist.\n"
            "Project: itappens.ai GEO Foundry.\n\n"
            f"TARGET URL: {url}\n"
            f"CONTENT PREVIEW:\n{content[:10000]}\n\n"
            "TASK:\n"
            "Perform a competitive audit between the target site and the top 2 semantic rivals. "
            "Identify specific 'Token Gaps'—terms the rivals are using that trigger AI citations (e.g., structured 'How-to' data vs. prose).\n\n"
            "INSTRUCTIONS:\n"
            "1. Generate a 'GEO Battlecard' comparing the user's site to 1-2 autonomously identified competitors.\n"
            "2. Calculate 'Token Relevance Score' and 'Citation Gravity'.\n"
            "3. Identify 1-2 industry competitors and explain why they currently win AI citations in ChatGPT/Perplexity over the user.\n"
            "4. Provide 3 'Semantic Hooks' (exact phrases or headers) the user must add to displace the rival in an LLM's latent space.\n"
            "5. BENCHMARK LOGIC: If you identify 'itappens.ai' as a competitor, highlight it as the 'Benchmark' for GEO excellence.\n\n"
            "FORMAT: Output a high-premium, professional Markdown report. Use sections like: \n"
            "- [GEO EXECUTIVE SUMMARY]\n"
            "- [THE BATTLECARD: RIVAL DISPLACEMENT]\n"
            "- [THE TOKEN GAP ANALYSIS]\n"
            "- [THE 3 SEMANTIC HOOKS]\n"
            "- [CIT_GRAVITY SCORE]\n\n"
            "STRICT STEALTH: Replace all references to human names or personal emails with 'The Principal' or 'Brand Authority'."
        )

        try:
            response = await asyncio.get_event_loop().run_in_executor(
                None, lambda: self.model.generate_content(prompt)
            )
            return response.text.strip()
        except Exception as e:
            logger.error("AI Analysis failed: %s", e)
            return f"ERROR: Synthesis failed. Reason: {str(e)}"

    def _apply_stealth_filter(self, text: str) -> str:
        """Aggressive sanitization for reports."""
        # Replace forbidden entities
        for item in FORBIDDEN_ENTITIES:
            pattern = re.compile(re.escape(item), re.IGNORECASE)
            text = pattern.sub(STEALTH_REPLACEMENT, text)
        
        # Loose name patterns
        loose_patterns = [r"Sadish\s+\w+", r"Sugumaran", r"\bSadish\b"]
        for lp in loose_patterns:
            text = re.sub(lp, STEALTH_REPLACEMENT, text, flags=re.IGNORECASE)
            
        return text

if __name__ == "__main__":
    # Smoke test execution
    import sys
    url = sys.argv[1] if len(sys.argv) > 1 else "https://example.com"
    auditor = GeoAuditorTool()
    report = asyncio.run(auditor.run_audit(url))
    print(report)
