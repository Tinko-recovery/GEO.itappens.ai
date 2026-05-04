"""
teams/team_factory.py
─────────────────────
TeamFactory — dynamically spawns N engineering or marketing teams on demand.
Runs all teams in parallel via asyncio.gather() + ThreadPoolExecutor.
Injects customer brain context and routes all outputs through Quality Gate.
"""

import asyncio
import logging
import json
from datetime import datetime
from pathlib import Path
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
from teams.scouting_team import build_scouting_crew
from teams.upwork_team import build_upwork_crew

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
        # Format: "gemini/<model-id>" tells LiteLLM to use the Gemini provider.
        self._llm_sonnet = f"gemini/gemini-1.5-pro-latest"
        self._llm_haiku = f"gemini/gemini-1.5-flash"
        
        self._activity_path = Path(__file__).parent.parent / "memory" / "activity_log.json"
        self._history_path = Path(__file__).parent.parent / "memory" / "job_history.json"

    def _log_to_file(self, path: Path, entry: dict):
        """Append an entry to a JSON log file safely."""
        try:
            path.parent.mkdir(parents=True, exist_ok=True)
            if not path.exists():
                path.write_text(json.dumps([]), encoding="utf-8")
            
            data = json.loads(path.read_text(encoding="utf-8"))
            data.append(entry)
            # Keep log size manageable: last 500 items for activity, 1000 for history
            limit = 500 if "activity" in path.name else 1000
            if len(data) > limit:
                data = data[-limit:]
            
            path.write_text(json.dumps(data, indent=2, default=str), encoding="utf-8")
        except Exception as e:
            logger.error(f"Failed to log to {path}: {e}")

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

    def spawn_scouting_team(
        self, team_id: str, scouting_brief: str, customer_id: str
    ) -> tuple:
        """Return a (team_id, crew, type) tuple for a scouting team."""
        crew = build_scouting_crew(
            team_id=team_id,
            scouting_brief=scouting_brief,
            customer_id=customer_id,
            auto_router=self._router,
            llm_sonnet=self._llm_sonnet,
            llm_haiku=self._llm_haiku,
        )
        return (team_id, crew, "scouting", customer_id)

    def spawn_upwork_team(
        self, team_id: str, job_target: str, customer_id: str
    ) -> tuple:
        """Return a (team_id, crew, type) tuple for an upfront upwork team."""
        crew = build_upwork_crew(
            team_id=team_id,
            job_target=job_target,
            customer_id=customer_id,
            auto_router=self._router,
            llm_sonnet=self._llm_sonnet,
            llm_haiku=self._llm_haiku,
        )
        return (team_id, crew, "upwork", customer_id)

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
                            
                            # Log to activity_log.json
                            self._log_to_file(self._activity_path, {
                                "timestamp": datetime.utcnow().isoformat(),
                                "team_id": team_id,
                                "agent": role,
                                "action": tool_use.strip(" ()") or "Thought",
                                "thought": thought[:500]
                            })
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

                # Log to job_history.json
                self._log_to_file(self._history_path, {
                    "timestamp": datetime.utcnow().isoformat(),
                    "team_id": team_id,
                    "type": team_type,
                    "customer_id": customer_id,
                    "goal": result["output"][:200] + "...",
                    "quality_score": result.get("quality_score"),
                    "status": "completed"
                })

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
