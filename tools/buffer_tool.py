"""
tools/buffer_tool.py
────────────────────
BufferTool: A unified interface to post social media content via Buffer API.
Supports LinkedIn, Twitter, Facebook, Instagram, etc.
"""

import os
import logging
import httpx
from typing import List, Dict, Any, Optional
from crewai_tools import BaseTool
from pydantic import Field

logger = logging.getLogger(__name__)

class BufferPostTool(BaseTool):
    name: str = "buffer_post_tool"
    description: str = (
        "Post content to social media channels via Buffer. "
        "Inputs: text (string), media_urls (optional list), and profile_ids (optional list)."
    )
    
    # Pydantic fields for the tool
    buffer_access_token: str = Field(default_factory=lambda: os.getenv("BUFFER_ACCESS_TOKEN", ""))
    organization_id: str = Field(default_factory=lambda: os.getenv("BUFFER_ORG_ID", ""))

    def _run(self, text: str, media_urls: Optional[List[str]] = None, profile_ids: Optional[List[str]] = None) -> str:
        """
        Boilerplate implementation of the Buffer POST action.
        This tool connects to the Buffer API and queues content for distribution.
        """
        if not self.buffer_access_token:
            return "Error: BUFFER_ACCESS_TOKEN not found in environment variables."

        logger.info("Preparing Buffer post: %s", text[:50] + "...")
        
        # Real-world implementation would call the Buffer API endpoints:
        # 1. Get profiles: GET /1/profiles.json
        # 2. Create update: POST /1/updates/create.json
        
        # This is a boilerplate/stub for the initial architect phase
        api_url = "https://api.bufferapp.com/1/updates/create.json"
        
        # Example payload
        payload = {
            "text": text,
            "shorten": True,
            "now": False, # Always queue for review by default as per staging preference
        }
        
        if media_urls:
            payload["media"] = {"photo": media_urls[0]} # Simplified example
            
        if profile_ids:
            payload["profile_ids"] = profile_ids
            
        # Mocking the success for the boilerplate
        # In production, use httpx.post with authorization headers
        
        msg = f"✅ Content staged in Buffer Queue for review."
        if profile_ids:
            msg += f" (Targets: {', '.join(profile_ids)})"
        
        return msg

class BufferProfileTool(BaseTool):
    name: str = "buffer_list_profiles"
    description: str = "List all connected social media profiles in your Buffer account."
    
    buffer_access_token: str = Field(default_factory=lambda: os.getenv("BUFFER_ACCESS_TOKEN", ""))

    def _run(self) -> str:
        """Fetch and return a list of profiles from Buffer."""
        if not self.buffer_access_token:
            return "Error: BUFFER_ACCESS_TOKEN not found."
            
        # Simplified mock return
        profiles = [
            {"id": "li_123", "service": "linkedin", "formatted_username": "itappens.ai (LinkedIn)"},
            {"id": "tw_456", "service": "twitter", "formatted_username": "@itappensai"},
            {"id": "ig_789", "service": "instagram", "formatted_username": "itappens.ai (IG)"}
        ]
        
        return "\n".join([f"- {p['formatted_username']} (id: {p['id']})" for p in profiles])
