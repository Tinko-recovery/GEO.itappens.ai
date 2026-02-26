"""
tools/browser_tool.py
─────────────────────
Interactive Browser Tool using Playwright.
Allows agents to navigate, click, type, and scrape websites like Upwork.
Supports persistent sessions to maintain logins.
"""

import asyncio
import logging
import os
from typing import Optional, Any
from crewai_tools import BaseTool
from playwright.async_api import async_playwright

logger = logging.getLogger(__name__)

class BrowserTool(BaseTool):
    name: str = "browser_automation"
    description: str = (
        "Use a real web browser to interact with websites. "
        "Commands: navigate(url), click(selector), type(selector, text), get_content(), wait(seconds). "
        "Use this for logging into sites, navigating complex dashboards (like Upwork), or submitting forms."
    )
    
    _browser: Any = None
    _context: Any = None
    _page: Any = None
    _playwright: Any = None

    async def _init_browser(self):
        """Initialize playwright if not already running."""
        if self._playwright:
            return
            
        self._playwright = await async_playwright().start()
        
        # We use a user data dir to maintain sessions (logins)
        user_data_dir = os.path.join(os.getcwd(), ".browser_session")
        if not os.path.exists(user_data_dir):
            os.makedirs(user_data_dir)
            
        self._context = await self._playwright.chromium.launch_persistent_context(
            user_data_dir,
            headless=True, # Set to False if you want to see it happen on the user's desktop
            viewport={'width': 1280, 'height': 720}
        )
        self._page = self._context.pages[0] if self._context.pages else await self._context.new_page()

    def _run(self, command: str, url: Optional[str] = None, selector: Optional[str] = None, text: Optional[str] = None, wait_seconds: int = 2) -> str:
        """Synchronous wrapper for async playwright methods."""
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
        return loop.run_until_complete(self._arun_internal(command, url, selector, text, wait_seconds))

    async def _arun_internal(self, command: str, url: str, selector: str, text: str, wait_seconds: int) -> str:
        await self._init_browser()
        
        try:
            if command == "navigate":
                await self._page.goto(url, wait_until="networkidle")
                return f"Successfully navigated to {url}"
                
            elif command == "click":
                await self._page.wait_for_selector(selector, timeout=10000)
                await self._page.click(selector)
                await self._page.wait_for_timeout(wait_seconds * 1000)
                return f"Clicked element: {selector}"
                
            elif command == "type":
                await self._page.wait_for_selector(selector, timeout=10000)
                await self._page.fill(selector, text)
                return f"Typed into {selector}"
                
            elif command == "get_content":
                content = await self._page.content()
                # Return limited content to avoid token overflow
                return content[:5000]
                
            elif command == "wait":
                await self._page.wait_for_timeout(wait_seconds * 1000)
                return f"Waited for {wait_seconds} seconds"
                
            else:
                return f"Unknown command: {command}"
                
        except Exception as e:
            logger.error(f"BrowserTool Error: {e}")
            return f"Error executing {command}: {str(e)}"

    async def close(self):
        if self._context:
            await self._context.close()
        if self._playwright:
            await self._playwright.stop()
