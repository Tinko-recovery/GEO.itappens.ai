"""
tools/scout_tool.py
───────────────────
A specialized tool for agents to present a list of findings (like jobs, leads, or designs)
to the human founder via Telegram and wait for a selection.
"""

from typing import Any, List
from crewai_tools import BaseTool
import asyncio
import logging

logger = logging.getLogger(__name__)

class ScoutSelectionTool(BaseTool):
    name: str = "present_options_for_selection"
    description: str = (
        "Present a list of found items (like jobs or leads) to the user via Telegram buttons. "
        "The user will select ONE option. This tool will WAIT and then return the selected item. "
        "Input: a list of strings representing the options."
    )
    telegram_reporter: Any = None # Injected by TeamFactory

    def _run(self, title: str, options: List[str]) -> str:
        """Synchronous wrapper for the interactive choice method."""
        if not self.telegram_reporter:
            return "Scout Tool error: No telegram reporter connected."
        
        logger.info(f"Agent is presenting {len(options)} options to human: {title}")
        
        try:
            # We are in a thread pool, so we need to run the async method in a loop
            try:
                loop = asyncio.get_event_loop()
            except RuntimeError:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
            
            result = loop.run_until_complete(self.telegram_reporter.present_choices("Scout Agent", title, options))
            return f"The user has selected: {result}"
        except Exception as e:
            logger.error(f"ScoutSelectionTool failed: {e}")
            return f"Error getting selection from human: {e}"
