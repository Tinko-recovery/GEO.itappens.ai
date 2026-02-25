"""
orchestration/cpo_agent.py
──────────────────────────
CPO Agent — manages all marketing teams.
Coordinates campaigns, ensures brand consistency, and prevents duplicate content.
Uses claude-sonnet-4-5 via AutoRouter.
"""

import json
import logging

from customer.customer_brain import CustomerBrain

logger = logging.getLogger(__name__)


CPO_SYSTEM_PROMPT = """You are the CPO (Chief Product/Marketing Officer) Agent of itappens.ai.

Your responsibilities:
1. Receive marketing missions from the CEO
2. Coordinate campaigns across all marketing teams to prevent duplicate content
3. Ensure every piece of content matches the customer's brand voice
4. Assign specific marketing briefs: content type, target audience, tone, CTA
5. Plan a cohesive content calendar — teams should produce complementary, not competing, content

MARKETING RULES:
- Never let two teams write the same blog post or target the same keywords
- Every piece must reference the customer's actual product/service — no generic content
- CTAs must align: if eng team is shipping a payment feature, mkt team promotes it
- Brand voice must be consistent across all outputs
- SEO: each blog post targets a unique primary keyword

For each mission, output a marketing brief in JSON:
{
  "team_id": "<team_id>",
  "content_type": "blog|tweet|email_sequence|seo_article|landing_page|social",
  "campaign_theme": "<what this campaign is about>",
  "target_audience": "<specific audience segment>",
  "primary_cta": "<one clear call to action>",
  "keywords": ["<keyword 1>", "<keyword 2>"],
  "tone": "<from customer's brand voice>",
  "deliverables": ["<specific output 1>", "<specific output 2>"]
}
"""


class CPOAgent:
    """
    Layer 1 Executive Agent for marketing.
    Translates CEO missions into coordinated marketing briefs.
    Prevents campaign overlap and ensures brand consistency.
    """

    def __init__(self, auto_router, sprint_board=None):
        self._router = auto_router
        self._sprint_board = sprint_board

    def assign_missions(self, cpo_missions: list, customer_id: str) -> list[dict]:
        """
        Translate CEO marketing missions into detailed marketing briefs.
        Returns a list of brief dicts, one per team.
        """
        context = CustomerBrain.get_context_prompt(customer_id)
        brain = CustomerBrain.load(customer_id)
        brand_voice = brain.get("brand_voice", "Professional, direct, no jargon")
        target_customer = brain.get("target_customer", "founders and developers")

        if self._sprint_board:
            self._sprint_board.update("cpo", "current_task", "Coordinating marketing campaigns")
            self._sprint_board.update("cpo", "status", "active")

        all_missions_text = "\n".join(
            f"Team {m['team_id']}: {m['mission']}" for m in cpo_missions
        )

        system = context + "\n\n" + CPO_SYSTEM_PROMPT

        user_msg = (
            f"Brand Voice: {brand_voice}\n"
            f"Target Customer: {target_customer}\n\n"
            f"Marketing Missions from CEO:\n{all_missions_text}\n\n"
            "Coordinate these missions to avoid duplicate content. "
            "Write a detailed marketing brief for EACH team. "
            "Respond with a JSON array of marketing briefs."
        )

        raw = self._router.call_with_routing(
            agent_name="CPO Agent",
            system_prompt=system,
            user_message=user_msg,
            cache_system_prompt=True,
            max_tokens=3000,
            task_description="CPO marketing mission assignment",
        )

        try:
            start = raw.find("[")
            end = raw.rfind("]") + 1
            briefs = json.loads(raw[start:end]) if start != -1 else []
        except (json.JSONDecodeError, ValueError):
            logger.error("CPO could not parse JSON briefs — using mission as-is.")
            briefs = [
                {
                    "team_id": m["team_id"],
                    "content_type": "blog",
                    "campaign_theme": m["mission"],
                    "target_audience": target_customer,
                    "primary_cta": "Learn more at itappens.ai",
                    "keywords": [],
                    "tone": brand_voice,
                    "deliverables": [m["mission"]],
                }
                for m in cpo_missions
            ]

        if self._sprint_board:
            self._sprint_board.update("cpo", "current_task", "Marketing briefs issued to all mkt teams")
            self._sprint_board.update("cpo", "status", "waiting")

        logger.info("CPO issued %d marketing briefs.", len(briefs))
        return briefs
