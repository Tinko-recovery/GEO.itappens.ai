"""
tools/human_link.py
──────────────────
Tool for agents to ask the human founder (you) a question via Telegram.
Blocks until you reply.
"""

from typing import Optional, Any
from crewai.tools import BaseTool
import asyncio
import logging

logger = logging.getLogger(__name__)

class HumanLinkTool(BaseTool):
    name: str = "ask_human_founder"
    description: str = (
        "Ask the CEO (Zenith) a question when you are blocked or need clarification. "
        "The message will be sent to his Telegram. This tool will WAIT until he replies. "
        "Use this only for critical decisions or when the technical brief is unclear."
    )
    telegram_reporter: Any = None # We'll inject this

    def _run(self, question: str) -> str:
        """Sychronous wrapper for the async ask method."""
        if not self.telegram_reporter:
            return "Human Link Tool error: No telegram reporter connected."
        
        logger.info(f"Agent is asking human: {question}")
        
        try:
            # We are in a thread pool (TeamFactory.run_one), so we can use a new loop or the existing one
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(self.telegram_reporter.ask_human_link("Agent", question))
            loop.close()
            return result
        except Exception as e:
            logger.error(f"HumanLinkTool failed: {e}")
            return f"Error contacting human: {e}"
