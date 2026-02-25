"""
memory/mission_store.py
───────────────────────
Persistent store for customer missions. Handles the state machine:
Draft -> Planned -> Approved -> Running -> Completed
"""

import json
import threading
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict

MISSION_PATH = Path(__file__).parent / "missions.json"

class MissionStore:
    def __init__(self):
        self._lock = threading.Lock()
        self._ensure_file()

    def _ensure_file(self):
        with self._lock:
            if not MISSION_PATH.exists():
                MISSION_PATH.write_text(json.dumps({}), encoding="utf-8")

    def _read(self) -> dict:
        return json.loads(MISSION_PATH.read_text(encoding="utf-8"))

    def _write(self, data: dict):
        MISSION_PATH.write_text(json.dumps(data, indent=2, default=str), encoding="utf-8")

    def create_mission(self, customer_id: str, goal: str) -> str:
        """Create a new mission in 'draft' state."""
        mission_id = f"msn_{datetime.utcnow().strftime('%Y%H%M%S')}"
        with self._lock:
            data = self._read()
            data[mission_id] = {
                "mission_id": mission_id,
                "customer_id": customer_id,
                "goal": goal,
                "state": "draft",
                "plan": None,
                "budget_points": 0,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat(),
                "approved_at": None,
            }
            self._write(data)
        return mission_id

    def update_plan(self, mission_id: str, plan: dict, points: int):
        """Transition mission to 'planned' state."""
        with self._lock:
            data = self._read()
            if mission_id in data:
                data[mission_id]["plan"] = plan
                data[mission_id]["budget_points"] = points
                data[mission_id]["state"] = "planned"
                data[mission_id]["updated_at"] = datetime.utcnow().isoformat()
                self._write(data)

    def approve_mission(self, mission_id: str):
        """Transition mission to 'approved' state."""
        with self._lock:
            data = self._read()
            if mission_id in data:
                data[mission_id]["state"] = "approved"
                data[mission_id]["approved_at"] = datetime.utcnow().isoformat()
                data[mission_id]["updated_at"] = datetime.utcnow().isoformat()
                self._write(data)

    def get_mission(self, mission_id: str) -> Optional[dict]:
        with self._lock:
            return self._read().get(mission_id)

    def get_customer_missions(self, customer_id: str) -> List[dict]:
        with self._lock:
            data = self._read()
            return [m for m in data.values() if m["customer_id"] == customer_id]

    def get_pending_approvals(self) -> List[dict]:
        with self._lock:
            data = self._read()
            return [m for m in data.values() if m["state"] == "planned"]
