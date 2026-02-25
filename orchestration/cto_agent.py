"""
orchestration/cto_agent.py
──────────────────────────
CTO Agent — manages all engineering teams.
Prevents duplicate work, reviews architecture decisions, assigns missions to eng teams.
Uses claude-sonnet-4-5 via AutoRouter.
"""

import json
import logging

from customer.customer_brain import CustomerBrain

logger = logging.getLogger(__name__)


CTO_SYSTEM_PROMPT = """You are the CTO Agent of itappens.ai — an autonomous AI company.

Your responsibilities:
1. Receive engineering missions from the CEO
2. Review architecture decisions for consistency across teams
3. Prevent duplicate work (two teams building the same thing)
4. Refine each mission into a specific technical brief for the assigned team
5. Ensure all work aligns with the customer's declared tech stack

ARCHITECTURE RULES:
- Never let two teams build overlapping components (e.g., two auth systems)
- All code must use the customer's declared tech stack — no switching frameworks mid-sprint
- APIs must follow RESTful conventions unless customer specifies otherwise
- Security: no hardcoded secrets, always use environment variables
- All database schemas must be forward-compatible (migration-safe)

For each mission, output a technical brief in JSON:
{
  "team_id": "<team_id>",
  "technical_brief": "<detailed technical spec>",
  "components_to_build": ["<component 1>", "<component 2>"],
  "tech_stack_to_use": ["<tech>"],
  "architecture_notes": "<any important constraints>",
  "estimated_complexity": "low|medium|high"
}
"""


class CTOAgent:
    """
    Layer 1 Executive Agent for engineering.
    Translates CEO missions into technical briefs for engineering teams.
    """

    def __init__(self, auto_router, sprint_board=None):
        self._router = auto_router
        self._sprint_board = sprint_board

    def assign_missions(self, cto_missions: list, customer_id: str) -> list[dict]:
        """
        Translate CEO engineering missions into detailed technical briefs.
        Returns a list of technical brief dicts, one per team.
        """
        context = CustomerBrain.get_context_prompt(customer_id)
        brain = CustomerBrain.load(customer_id)
        tech_stack = ", ".join(brain.get("tech_stack", [])) or "any modern stack"

        if self._sprint_board:
            self._sprint_board.update("cto", "current_task", "Reviewing architecture & assigning missions")
            self._sprint_board.update("cto", "status", "active")

        # Detect potential overlaps
        all_missions_text = "\n".join(
            f"Team {m['team_id']}: {m['mission']}" for m in cto_missions
        )

        system = context + "\n\n" + CTO_SYSTEM_PROMPT

        user_msg = (
            f"Tech Stack: {tech_stack}\n\n"
            f"Engineering Missions Assigned by CEO:\n{all_missions_text}\n\n"
            "Review these missions for overlaps. Then write a detailed technical brief "
            "for EACH team. Respond with a JSON array of technical briefs."
        )

        raw = self._router.call_with_routing(
            agent_name="CTO Agent",
            system_prompt=system,
            user_message=user_msg,
            cache_system_prompt=True,
            max_tokens=3000,
            task_description="CTO architecture review and mission assignment",
        )

        try:
            start = raw.find("[")
            end = raw.rfind("]") + 1
            briefs = json.loads(raw[start:end]) if start != -1 else []
        except (json.JSONDecodeError, ValueError):
            logger.error("CTO could not parse JSON briefs — using mission as-is.")
            briefs = [
                {
                    "team_id": m["team_id"],
                    "technical_brief": m["mission"],
                    "components_to_build": [],
                    "tech_stack_to_use": [],
                    "architecture_notes": "",
                    "estimated_complexity": "medium",
                }
                for m in cto_missions
            ]

        if self._sprint_board:
            self._sprint_board.update("cto", "current_task", "Technical briefs issued to all eng teams")
            self._sprint_board.update("cto", "status", "waiting")

        logger.info("CTO issued %d technical briefs.", len(briefs))
        return briefs
