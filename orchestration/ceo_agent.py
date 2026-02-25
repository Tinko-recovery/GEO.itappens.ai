"""
orchestration/ceo_agent.py
──────────────────────────
CEO Agent — receives the company goal, plans missions, assigns to CTO/CPO,
and synthesizes final results. Uses claude-sonnet-4-5 via AutoRouter.
"""

import json
import logging
from datetime import datetime

from customer.customer_brain import CustomerBrain

logger = logging.getLogger(__name__)


CEO_SYSTEM_PROMPT = """You are the CEO Agent of itappens.ai — an autonomous AI company.

Your job:
1. Receive a high-level goal from the customer
2. Break it into parallel missions for the CTO (engineering) and CPO (marketing)
3. Assign specific, actionable missions to each executive
4. Synthesize the final results into a clear customer-facing summary

CRITICAL RULES:
- Never duplicate work between engineering and marketing
- Engineering missions = code, features, APIs, databases, infrastructure
- Marketing missions = content, SEO, social media, email sequences, lead gen
- Keep missions focused — one clear deliverable per mission
- Marketing missions must directly support the engineering output
- Always consider the customer's past sprints to avoid repeating failed work

OUTPUT FORMAT for mission planning (respond in JSON):
{
  "sprint_goal": "<one sentence>",
  "cto_missions": [
    {"team_id": "eng_1", "mission": "<specific task>", "priority": "high"},
    {"team_id": "eng_2", "mission": "<specific task>", "priority": "medium"}
  ],
  "cpo_missions": [
    {"team_id": "mkt_1", "mission": "<specific task>", "priority": "high"},
    {"team_id": "mkt_2", "mission": "<specific task>", "priority": "medium"}
  ],
  "success_criteria": ["<measurable outcome 1>", "<measurable outcome 2>"]
}
"""


class CEOAgent:
    """
    Layer 1 Executive Agent.
    Plans missions and synthesizes results. Delegates to CTO and CPO.
    """

    def __init__(self, auto_router, sprint_board=None, telegram=None):
        self._router = auto_router
        self._sprint_board = sprint_board
        self._telegram = telegram

    def plan_missions(
        self,
        goal: str,
        customer_id: str,
        num_eng_teams: int = 2,
        num_mkt_teams: int = 2,
    ) -> dict:
        """
        Receive a goal and return a structured mission plan.
        Returns a dict with cto_missions and cpo_missions lists.
        """
        context = CustomerBrain.get_context_prompt(customer_id)
        brain = CustomerBrain.load(customer_id)
        sprint_num = len(brain.get("past_sprints", [])) + 1

        user_msg = (
            f"SPRINT #{sprint_num}\n"
            f"Customer Goal: {goal}\n\n"
            f"Available Teams: {num_eng_teams} engineering teams, {num_mkt_teams} marketing teams\n\n"
            f"Plan parallel missions for all {num_eng_teams + num_mkt_teams} teams. "
            "Respond ONLY in the JSON format specified in your system prompt."
        )

        system_with_context = context + "\n\n" + CEO_SYSTEM_PROMPT

        logger.info("CEO Agent planning missions for customer %s, sprint #%d", customer_id, sprint_num)

        if self._sprint_board:
            self._sprint_board.update("ceo", "current_task", "Planning sprint missions")
            self._sprint_board.update("ceo", "status", "active")

        raw = self._router.call_with_routing(
            agent_name="CEO Agent",
            system_prompt=system_with_context,
            user_message=user_msg,
            cache_system_prompt=True,
            max_tokens=2048,
            task_description="CEO mission planning",
        )

        try:
            start = raw.find("{")
            end = raw.rfind("}") + 1
            plan = json.loads(raw[start:end])
        except (json.JSONDecodeError, ValueError):
            logger.error("CEO could not parse JSON plan — using fallback.")
            plan = self._fallback_plan(goal, num_eng_teams, num_mkt_teams)

        if self._sprint_board:
            self._sprint_board.update("ceo", "current_task", "Mission plan complete — teams dispatched")
            self._sprint_board.update("ceo", "status", "waiting")

        if self._telegram:
            self._telegram.send_now(
                f"📋 *CEO Mission Plan Ready*\n"
                f"Sprint Goal: {plan.get('sprint_goal', goal[:100])}\n"
                f"Eng teams: {len(plan.get('cto_missions', []))}, "
                f"Mkt teams: {len(plan.get('cpo_missions', []))}"
            )

        return plan

    def synthesize_results(
        self,
        customer_id: str,
        sprint_plan: dict,
        team_results: dict,
    ) -> str:
        """
        After all teams finish, synthesize their results into a customer-facing summary.
        Returns a markdown-formatted completion report.
        """
        context = CustomerBrain.get_context_prompt(customer_id)
        results_text = json.dumps(team_results, indent=2, default=str)

        user_msg = (
            f"Sprint Plan:\n{json.dumps(sprint_plan, indent=2)}\n\n"
            f"Team Results:\n{results_text[:3000]}\n\n"
            "Write a concise, customer-facing summary of what was accomplished this sprint. "
            "Use bullet points. Mention what was built, what content was created, "
            "and any blockers encountered. Keep it under 400 words."
        )

        system = (
            context + "\n\nYou are the CEO of itappens.ai. "
            "Write clear, confident summaries of sprint results for non-technical founders."
        )

        summary = self._router.call_with_routing(
            agent_name="CEO Agent",
            system_prompt=system,
            user_message=user_msg,
            cache_system_prompt=True,
            max_tokens=1024,
            task_description="CEO results synthesis",
        )

        if self._sprint_board:
            self._sprint_board.update("ceo", "result", summary)
            self._sprint_board.update("ceo", "status", "done")

        return summary

    @staticmethod
    def _fallback_plan(goal: str, num_eng: int, num_mkt: int) -> dict:
        """Minimal fallback if JSON parsing fails."""
        eng_missions = [
            {"team_id": f"eng_{i+1}", "mission": f"Engineering task {i+1}: {goal}", "priority": "high"}
            for i in range(num_eng)
        ]
        mkt_missions = [
            {"team_id": f"mkt_{i+1}", "mission": f"Marketing task {i+1}: promote {goal}", "priority": "medium"}
            for i in range(num_mkt)
        ]
        return {
            "sprint_goal": goal[:100],
            "cto_missions": eng_missions,
            "cpo_missions": mkt_missions,
            "success_criteria": ["Deliverables shipped", "Content published"],
        }
