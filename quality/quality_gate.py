"""
quality/quality_gate.py
───────────────────────
Quality Gate Agent — scores every output 1-10 before delivery.
Uses claude-sonnet-4-5 (complex quality decisions need the better model).
Automatically redoes tasks below 5/10 (max 2 redos), then escalates to CEO.
"""

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional

from quality.output_standards import (
    CODE_RUBRIC,
    CONTENT_RUBRIC,
    THRESHOLDS,
    REDO_PROMPTS,
    REVIEW_RECOMMENDED_NOTE,
)
from customer.customer_brain import CustomerBrain

logger = logging.getLogger(__name__)

QUALITY_LOG_PATH = Path(__file__).parent.parent / "memory" / "quality_log.json"


class QualityGateAgent:
    """
    Reviews every output from every team before delivery.

    Scoring:
      8-10 → Deliver immediately
      5-7  → Deliver with "review recommended" note
      1-4  → Redo task (max 2 redos), then escalate

    Uses claude-sonnet-4-5 via AutoRouter (quality decisions need Sonnet).
    Logs every score to memory/quality_log.json.
    """

    def __init__(self, auto_router, sprint_board=None, telegram_notifier=None):
        self._router = auto_router
        self._sprint_board = sprint_board
        self._telegram = telegram_notifier
        self._ensure_log()

    # ── Main entry point ─────────────────────────────────────────────────────

    def review(
        self,
        output_content: str,
        output_type: str,          # "code" or "content"
        task_description: str,
        customer_id: str,
        team_id: str,
        max_redos: int = 2,
        redo_callback=None,        # callable(improved_prompt) → str (new output)
    ) -> dict:
        """
        Review an output and return a result dict with score, decision, and content.

        Returns:
          {
            "score": 8,
            "decision": "deliver",   # or "deliver_with_note" / "redo" / "escalate"
            "content": "...",        # original or improved content
            "note": "...",           # delivery note (if warning)
            "issues": [...],
          }
        """
        brain = CustomerBrain.load(customer_id)

        score, issues = self._score_output(output_content, output_type, brain, task_description)
        self._log(team_id, output_type, task_description, score, issues)

        if self._sprint_board:
            self._sprint_board.append_quality_score(team_id, score)

        if self._telegram:
            msg = (
                f"🛡️ *Quality Verdict from Vigil*\n"
                f"Project: {customer_id} | Team: {team_id}\n"
                f"Score: *{score}/10*\n"
                f"Issues: {', '.join(issues) if issues else 'None'}"
            )
            self._telegram.send_now(msg)

        lo, hi = THRESHOLDS["deliver_immediately"]
        if lo <= score <= hi:
            return self._result("deliver", score, output_content, issues)

        lo, hi = THRESHOLDS["deliver_with_warning"]
        if lo <= score <= hi:
            note = REVIEW_RECOMMENDED_NOTE.format(
                score=score, issues="; ".join(issues) if issues else "Minor quality concerns."
            )
            return self._result("deliver_with_note", score, output_content, issues, note)

        # Score 1-4: redo loop
        if redo_callback is None:
            return self._result("escalate", score, output_content, issues,
                                note="No redo callback provided — escalated to CEO.")

        redo_attempts = 0
        current_content = output_content
        while redo_attempts < max_redos and score < THRESHOLDS["escalate_below"]:
            redo_attempts += 1
            logger.warning("Quality score %d/10 — initiating redo %d/%d for %s.",
                           score, redo_attempts, max_redos, team_id)

            improved_prompt = self._build_redo_prompt(
                output_type, score, issues, task_description, brain
            )
            try:
                current_content = redo_callback(improved_prompt)
            except Exception as exc:
                logger.error("Redo callback failed: %s", exc)
                break

            score, issues = self._score_output(current_content, output_type, brain, task_description)
            self._log(team_id, output_type, task_description, score, issues, redo=redo_attempts)

            if self._sprint_board:
                self._sprint_board.append_quality_score(team_id, score)

            if score >= THRESHOLDS["escalate_below"]:
                break

        if score >= THRESHOLDS["deliver_immediately"][0]:
            return self._result("deliver", score, current_content, issues)
        elif score >= THRESHOLDS["deliver_with_warning"][0]:
            note = REVIEW_RECOMMENDED_NOTE.format(
                score=score, issues="; ".join(issues) if issues else "Quality concerns remain."
            )
            return self._result("deliver_with_note", score, current_content, issues, note)
        else:
            return self._result(
                "escalate", score, current_content, issues,
                note=f"Output still below threshold after {max_redos} redos. Escalated to CEO."
            )

    # ── Scoring engine ───────────────────────────────────────────────────────

    def _score_output(
        self,
        content: str,
        output_type: str,
        brain: dict,
        task_description: str,
    ) -> tuple[int, list[str]]:
        """Ask Claude Sonnet to score the output and return (score, issues)."""
        rubric = CODE_RUBRIC if output_type == "code" else CONTENT_RUBRIC
        rubric_text = "\n".join(
            f"- {k} ({v['points']} pts): {v['description']}"
            for k, v in rubric.items()
        )
        company_name = brain.get("company_name", "the customer's company")
        tech_stack = ", ".join(brain.get("tech_stack", [])) or "any"
        brand_voice = brain.get("brand_voice", "professional")

        system_prompt = (
            "You are the Quality Gate Agent for itappens.ai. "
            "Your job is to score AI-generated outputs with brutal honesty on a 1-10 scale.\n\n"
            f"Company: {company_name}\n"
            f"Tech Stack: {tech_stack}\n"
            f"Brand Voice: {brand_voice}\n\n"
            "Respond ONLY in this JSON format:\n"
            '{"score": <int 1-10>, "issues": [<str>, ...]}\n\n'
            f"Rubric (total 10 points):\n{rubric_text}"
        )

        user_msg = (
            f"Task: {task_description}\n\n"
            f"Output to score:\n---\n{content[:3000]}\n---\n\n"
            "Score this output honestly. Be strict. Generic or incomplete = low score."
        )

        try:
            raw = self._router.call_with_routing(
                agent_name="Quality Gate",
                system_prompt=system_prompt,
                user_message=user_msg,
                cache_system_prompt=True,
                max_tokens=512,
                task_description="Quality gate scoring",
            )
            # Parse JSON response
            start = raw.find("{")
            end = raw.rfind("}") + 1
            parsed = json.loads(raw[start:end])
            score = max(1, min(10, int(parsed.get("score", 5))))
            issues = parsed.get("issues", [])
            return score, issues
        except Exception as exc:
            logger.error("Quality scoring failed: %s — defaulting to 5.", exc)
            return 5, [f"Scoring error: {exc}"]

    # ── Helpers ──────────────────────────────────────────────────────────────

    def _build_redo_prompt(
        self,
        output_type: str,
        score: int,
        issues: list[str],
        original_task: str,
        brain: dict,
    ) -> str:
        template = REDO_PROMPTS.get(output_type, REDO_PROMPTS["content"])
        return template.format(
            score=score,
            issues="; ".join(issues) if issues else "Low quality",
            tech_stack=", ".join(brain.get("tech_stack", ["not specified"])),
            brand_voice=brain.get("brand_voice", "professional"),
            company_name=brain.get("company_name", "the company"),
            output_type=output_type,
            original_task=original_task,
        )

    @staticmethod
    def _result(
        decision: str,
        score: int,
        content: str,
        issues: list,
        note: str = "",
    ) -> dict:
        return {
            "score": score,
            "decision": decision,
            "content": content,
            "issues": issues,
            "note": note,
        }

    def _log(
        self,
        team_id: str,
        output_type: str,
        task: str,
        score: int,
        issues: list,
        redo: int = 0,
    ) -> None:
        entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "team_id": team_id,
            "output_type": output_type,
            "task": task[:200],
            "score": score,
            "issues": issues,
            "redo_attempt": redo,
        }
        try:
            log = json.loads(QUALITY_LOG_PATH.read_text(encoding="utf-8"))
            log.append(entry)
            QUALITY_LOG_PATH.write_text(json.dumps(log, indent=2), encoding="utf-8")
        except Exception as exc:
            logger.error("Could not write quality log: %s", exc)

    def _ensure_log(self) -> None:
        QUALITY_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        if not QUALITY_LOG_PATH.exists():
            QUALITY_LOG_PATH.write_text("[]", encoding="utf-8")
