"""
memory/sprint_board.py
─────────────────────
Thread-safe shared sprint board for all AI teams.
All teams read/write here to coordinate state and avoid duplicating work.
"""

import json
import threading
from datetime import datetime
from pathlib import Path


SPRINT_BOARD_PATH = Path(__file__).parent / "sprint_board.json"


class SprintBoard:
    """
    Persistent, thread-safe sprint board.
    Stores real-time status for every active team.
    All agents write results here; Telegram reporter and dashboard read from here.
    """

    def __init__(self):
        self._lock = threading.Lock()
        self._ensure_file()

    # ── Internal helpers ────────────────────────────────────────────────────

    def _ensure_file(self) -> None:
        """Create sprint_board.json if it doesn't exist."""
        with self._lock:
            if not SPRINT_BOARD_PATH.exists():
                SPRINT_BOARD_PATH.write_text(json.dumps({}), encoding="utf-8")

    def _read(self) -> dict:
        return json.loads(SPRINT_BOARD_PATH.read_text(encoding="utf-8"))

    def _write(self, data: dict) -> None:
        SPRINT_BOARD_PATH.write_text(json.dumps(data, indent=2, default=str), encoding="utf-8")

    # ── Public API ──────────────────────────────────────────────────────────

    def update(self, team_id: str, key: str, value) -> None:
        """Update a single field in a team's record."""
        with self._lock:
            data = self._read()
            if team_id not in data:
                data[team_id] = self._default_team(team_id)
            data[team_id][key] = value
            data[team_id]["last_updated"] = datetime.utcnow().isoformat()
            self._write(data)

    def append_completed(self, team_id: str, task: str) -> None:
        """Append a completed task string to a team's completed_tasks list."""
        with self._lock:
            data = self._read()
            if team_id not in data:
                data[team_id] = self._default_team(team_id)
            data[team_id].setdefault("completed_tasks", []).append(task)
            data[team_id]["last_updated"] = datetime.utcnow().isoformat()
            self._write(data)

    def append_quality_score(self, team_id: str, score: int) -> None:
        """Record a quality gate score for a team."""
        with self._lock:
            data = self._read()
            if team_id not in data:
                data[team_id] = self._default_team(team_id)
            data[team_id].setdefault("quality_scores", []).append(score)
            data[team_id]["last_updated"] = datetime.utcnow().isoformat()
            self._write(data)

    def get_team_status(self, team_id: str) -> dict:
        """Return the status dict for one team."""
        with self._lock:
            data = self._read()
            return data.get(team_id, self._default_team(team_id))

    def get_full_board(self) -> dict:
        """Return the full sprint board."""
        with self._lock:
            return self._read()

    def clear_team(self, team_id: str) -> None:
        """Reset a team to its default state (used when a new sprint begins)."""
        with self._lock:
            data = self._read()
            data[team_id] = self._default_team(team_id)
            self._write(data)

    # ── Summary generators ──────────────────────────────────────────────────

    def generate_summary(self) -> str:
        """
        Generate a Markdown summary of the sprint board for Telegram updates.
        Returns a formatted string showing each team's current status.
        """
        board = self.get_full_board()
        if not board:
            return "_No active teams._"

        lines = ["*📋 SPRINT BOARD*", ""]
        for team_id, info in board.items():
            status_emoji = {"active": "🟢", "waiting": "🟡", "blocked": "🔴", "done": "✅"}.get(
                info.get("status", "waiting"), "⚪"
            )
            lines.append(f"{status_emoji} *{team_id}*")
            lines.append(f"  Task: {info.get('current_task', '—')}")
            completed = info.get("completed_tasks", [])
            lines.append(f"  Done: {len(completed)} tasks")
            scores = info.get("quality_scores", [])
            if scores:
                avg = sum(scores) / len(scores)
                lines.append(f"  Avg Quality: {avg:.1f}/10")
            blockers = info.get("blockers", [])
            if blockers:
                lines.append(f"  ⚠️ Blocker: {blockers[-1]}")
            lines.append(f"  Updated: {info.get('last_updated', '—')[:16]}")
            lines.append("")
        return "\n".join(lines)

    def generate_weekly_summary(self) -> dict:
        """
        Return structured data for the Weekly Win email.
        Aggregates completed tasks, quality scores, and hours saved across all teams.
        """
        board = self.get_full_board()
        total_tasks = 0
        total_scores = []
        all_completed = []

        for info in board.values():
            completed = info.get("completed_tasks", [])
            total_tasks += len(completed)
            all_completed.extend(completed)
            total_scores.extend(info.get("quality_scores", []))

        avg_quality = sum(total_scores) / len(total_scores) if total_scores else 0
        # Industry average: 1 task ≈ 2 hours freelance work
        hours_saved = total_tasks * 2
        freelancer_cost = hours_saved * 75  # $75/hr industry average

        return {
            "total_tasks_completed": total_tasks,
            "completed_task_list": all_completed,
            "average_quality_score": round(avg_quality, 1),
            "hours_saved_equivalent": hours_saved,
            "freelancer_cost_equivalent": freelancer_cost,
            "generated_at": datetime.utcnow().isoformat(),
        }

    # ── Private helpers ─────────────────────────────────────────────────────

    @staticmethod
    def _default_team(team_id: str) -> dict:
        return {
            "team_id": team_id,
            "status": "waiting",
            "current_task": None,
            "completed_tasks": [],
            "quality_scores": [],
            "blockers": [],
            "last_updated": datetime.utcnow().isoformat(),
            "result": None,
        }
