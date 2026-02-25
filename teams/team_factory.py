"""
teams/team_factory.py
─────────────────────
TeamFactory — dynamically spawns N engineering or marketing teams on demand.
Runs all teams in parallel via asyncio.gather() + ThreadPoolExecutor.
Injects customer brain context and routes all outputs through Quality Gate.
"""

import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor
from typing import Optional

from dotenv import load_dotenv

from cost.auto_router import AutoRouter, CLAUDE_SONNET, CLAUDE_HAIKU
from cost.cost_tracker import CostTracker
from quality.quality_gate import QualityGateAgent
from customer.customer_brain import CustomerBrain
from memory.sprint_board import SprintBoard
from teams.engineering_team import build_engineering_crew
from teams.marketing_team import build_marketing_crew
from teams.sales_team import build_sales_crew

load_dotenv()
logger = logging.getLogger(__name__)


class TeamFactory:
    """
    Dynamically spawns and runs teams in parallel.

    Usage:
        factory = TeamFactory(auto_router, cost_tracker, sprint_board)
        results = await factory.run_teams_in_parallel([
            factory.spawn_engineering_team("eng_1", brief, "cust_001"),
            factory.spawn_marketing_team("mkt_1", brief, "cust_001"),
        ])
    """

    def __init__(
        self,
        auto_router: AutoRouter,
        cost_tracker: Optional[CostTracker] = None,
        sprint_board: Optional[SprintBoard] = None,
        quality_gate: Optional[QualityGateAgent] = None,
        telegram_notifier: Optional[object] = None, # TelegramReporter
    ):
        self._router = auto_router
        self._cost_tracker = cost_tracker
        self._board = sprint_board
        self._quality_gate = quality_gate
        self._telegram = telegram_notifier

        # CrewAI 1.x uses LiteLLM internally — pass model name strings directly.
        # Format: "anthropic/<model-id>" tells LiteLLM to use the Anthropic provider.
        self._llm_sonnet = f"anthropic/{CLAUDE_SONNET}"
        self._llm_haiku = f"anthropic/{CLAUDE_HAIKU}"

    # ── Spawners ──────────────────────────────────────────────────────────────
    # ... (existing spawners)

    def spawn_engineering_team(
        self, team_id: str, technical_brief: str, customer_id: str
    ) -> tuple:
        """Return a (team_id, crew, type) tuple for parallel execution."""
        crew = build_engineering_crew(
            team_id=team_id,
            technical_brief=technical_brief,
            customer_id=customer_id,
            auto_router=self._router,
            llm_sonnet=self._llm_sonnet,
            llm_haiku=self._llm_haiku,
        )
        return (team_id, crew, "engineering", customer_id)

    def spawn_marketing_team(
        self, team_id: str, marketing_brief: dict, customer_id: str
    ) -> tuple:
        """Return a (team_id, crew, type) tuple for parallel execution."""
        crew = build_marketing_crew(
            team_id=team_id,
            marketing_brief=marketing_brief,
            customer_id=customer_id,
            auto_router=self._router,
            llm_sonnet=self._llm_sonnet,
            llm_haiku=self._llm_haiku,
        )
        return (team_id, crew, "marketing", customer_id)

    def spawn_sales_team(self, product_description: str) -> tuple:
        """Return a (team_id, crew, type) tuple for the sales team."""
        crew = build_sales_crew(
            product_description=product_description,
            llm_sonnet=self._llm_sonnet,
            llm_haiku=self._llm_haiku,
            sprint_board=self._board,
        )
        return ("sales_team", crew, "sales", None)

    # ── Parallel runner ───────────────────────────────────────────────────────

    async def run_teams_in_parallel(self, teams: list[tuple]) -> dict:
        """
        Run all spawned teams simultaneously using asyncio.gather().
        Each team runs in a ThreadPoolExecutor to avoid blocking the event loop.

        Returns a dict mapping team_id → result dict.
        """
        loop = asyncio.get_event_loop()
        executor = ThreadPoolExecutor(max_workers=len(teams) or 1)

        async def run_one(team_tuple: tuple) -> tuple[str, dict]:
            team_id, crew, team_type, customer_id = team_tuple
            if self._board:
                self._board.update(team_id, "status", "active")
                self._board.update(team_id, "current_task", f"Starting {team_type} work")

            try:
                # Inject Telegram reporter into any HumanLinkTool found in agents
                for agent in crew.agents:
                    agent.verbose = True # Ensure we get chatter logging
                    for tool in agent.tools:
                        if hasattr(tool, "telegram_reporter"):
                            tool.telegram_reporter = self._telegram

                # Add real-time Telegram thought logging
                if self._telegram:
                    def crew_step_callback(step):
                        try:
                            # step is an AgentStep or similar
                            role = getattr(step, "agent", "Agent")
                            # Extract tool name if available for clarity
                            tool_use = ""
                            if hasattr(step, "tool"):
                                tool_use = f" (using {step.tool})"
                            
                            thought = str(getattr(step, "thought", "")) or str(step)
                            self._telegram.send_thought(f"{role}{tool_use}", thought)
                        except Exception as e:
                            logger.debug("Reporter step callback failed: %s", e)
                    
                    crew.step_callback = crew_step_callback

                # Run crew in thread pool (CrewAI is synchronous)
                result_obj = await loop.run_in_executor(executor, crew.kickoff)
                raw_output = str(result_obj)

                # Route through Quality Gate
                output_type = "code" if team_type == "engineering" else "content"
                if self._quality_gate and customer_id:
                    qg_result = self._quality_gate.review(
                        output_content=raw_output,
                        output_type=output_type,
                        task_description=f"Team {team_id} sprint output",
                        customer_id=customer_id,
                        team_id=team_id,
                    )
                    result = {
                        "team_id": team_id,
                        "type": team_type,
                        "output": qg_result["content"],
                        "quality_score": qg_result["score"],
                        "quality_decision": qg_result["decision"],
                        "quality_note": qg_result.get("note", ""),
                        "status": "done",
                    }
                else:
                    result = {
                        "team_id": team_id,
                        "type": team_type,
                        "output": raw_output,
                        "quality_score": None,
                        "quality_decision": "delivered",
                        "status": "done",
                    }

                if self._board:
                    self._board.update(team_id, "status", "done")
                    self._board.update(team_id, "result", result["output"][:500])
                    self._board.append_completed(team_id, f"{team_type} sprint complete")

                logger.info("Team %s finished. Quality: %s", team_id, result.get("quality_score"))
                return (team_id, result)

            except Exception as exc:
                logger.error("Team %s failed: %s", team_id, exc)
                if self._board:
                    self._board.update(team_id, "status", "blocked")
                    self._board.update(team_id, "blockers", [str(exc)])
                return (team_id, {"team_id": team_id, "status": "error", "error": str(exc)})

        tasks = [run_one(team) for team in teams]
        results_list = await asyncio.gather(*tasks, return_exceptions=False)
        executor.shutdown(wait=False)
        return dict(results_list)
