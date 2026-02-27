"""
dashboard/api/main.py
──────────────────────
FastAPI backend for the itappens.ai customer dashboard.
Serves sprint board data, customer info, outputs, cost tracking, and quality scores.
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Optional

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# Paths to data files
BASE = Path(__file__).parent.parent.parent
SPRINT_BOARD_PATH = BASE / "memory" / "sprint_board.json"
COST_LOG_PATH     = BASE / "memory" / "cost_log.json"
QUALITY_LOG_PATH  = BASE / "memory" / "quality_log.json"
BRAINS_DIR        = BASE / "memory" / "customer_brains"
OUTPUTS_PATH      = BASE / "memory" / "pending_outputs.json"
ACTIVITY_LOG_PATH = BASE / "memory" / "activity_log.json"
JOB_HISTORY_PATH  = BASE / "memory" / "job_history.json"

app = FastAPI(title="itappens.ai Dashboard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Helpers ────────────────────────────────────────────────────────────────────

def _read_json(path: Path, default):
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default

def _write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, default=str), encoding="utf-8")

def _today() -> str:
    return datetime.utcnow().date().isoformat()

# ── Pydantic response models ───────────────────────────────────────────────────

class OutputAction(BaseModel):
    note: Optional[str] = None

# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/api/teams")
def get_teams():
    """Return all team statuses from sprint_board.json."""
    return _read_json(SPRINT_BOARD_PATH, {})


@app.get("/api/outputs")
def get_outputs():
    """Return all pending outputs waiting for human review."""
    outputs = _read_json(OUTPUTS_PATH, [])
    pending = [o for o in outputs if o.get("status") == "pending"]
    return {"outputs": pending, "total": len(pending)}


@app.get("/api/activity")
def get_activity(limit: int = 50):
    """Return the most recent agent activities."""
    activity = _read_json(ACTIVITY_LOG_PATH, [])
    return activity[-limit:][::-1] # Newest first


@app.get("/api/history")
def get_history(limit: int = 20):
    """Return the most recent completed jobs."""
    history = _read_json(JOB_HISTORY_PATH, [])
    return history[-limit:][::-1] # Newest first


@app.post("/api/outputs/{output_id}/approve")
def approve_output(output_id: str, action: OutputAction = OutputAction()):
    """Mark an output as approved and trigger delivery."""
    outputs = _read_json(OUTPUTS_PATH, [])
    for o in outputs:
        if o.get("id") == output_id:
            o["status"] = "approved"
            o["approved_at"] = datetime.utcnow().isoformat()
            o["reviewer_note"] = action.note or ""
            _write_json(OUTPUTS_PATH, outputs)
            return {"success": True, "output_id": output_id, "status": "approved"}
    raise HTTPException(status_code=404, detail=f"Output {output_id} not found.")


@app.post("/api/outputs/{output_id}/reject")
def reject_output(output_id: str, action: OutputAction = OutputAction()):
    """Mark an output as rejected and trigger a redo."""
    outputs = _read_json(OUTPUTS_PATH, [])
    for o in outputs:
        if o.get("id") == output_id:
            o["status"] = "rejected"
            o["rejected_at"] = datetime.utcnow().isoformat()
            o["reviewer_note"] = action.note or ""
            _write_json(OUTPUTS_PATH, outputs)
            return {"success": True, "output_id": output_id, "status": "rejected"}
    raise HTTPException(status_code=404, detail=f"Output {output_id} not found.")


@app.get("/api/cost")
def get_cost():
    """Return today's spend, budget remaining, and spend by agent."""
    cost_log = _read_json(COST_LOG_PATH, [])
    today = _today()
    daily_budget = float(os.getenv("DAILY_BUDGET_USD", "20.00"))

    today_entries = [e for e in cost_log if e.get("date") == today]
    today_spent = round(sum(e.get("cost_usd", 0) for e in today_entries), 4)
    remaining = round(daily_budget - today_spent, 4)
    pct = round((today_spent / daily_budget) * 100, 1) if daily_budget > 0 else 0

    # Spend by agent
    by_agent: dict[str, float] = {}
    for e in today_entries:
        agent = e.get("agent", "Unknown")
        by_agent[agent] = round(by_agent.get(agent, 0) + e.get("cost_usd", 0), 4)

    # Savings vs hiring ($500/day equivalent)
    freelancer_daily_equiv = 500
    saved_today = max(0, freelancer_daily_equiv - today_spent)
    saved_monthly = max(0, 15000 - (today_spent * 30))

    return {
        "today_spent_usd": today_spent,
        "daily_budget_usd": daily_budget,
        "budget_remaining_usd": remaining,
        "pct_used": pct,
        "spend_by_agent": dict(sorted(by_agent.items(), key=lambda x: x[1], reverse=True)),
        "saved_today_vs_hiring": saved_today,
        "projected_monthly_usd": round(today_spent * 30, 2),
        "saved_monthly_vs_hiring": saved_monthly,
        "detailed_logs": today_entries[::-1], # Newest first
    }


@app.get("/api/customer/{customer_id}")
def get_customer(customer_id: str):
    """Return a customer's brain data."""
    path = BRAINS_DIR / f"{customer_id}.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"Customer {customer_id} not found.")
    return json.loads(path.read_text(encoding="utf-8"))


@app.get("/api/quality")
def get_quality():
    """Return quality scores by team."""
    log = _read_json(QUALITY_LOG_PATH, [])
    today = _today()
    today_log = [e for e in log if e.get("timestamp", "")[:10] == today]

    by_team: dict[str, list[int]] = {}
    for entry in today_log:
        team = entry.get("team_id", "unknown")
        by_team.setdefault(team, []).append(entry.get("score", 5))

    summary = {
        team: {
            "scores": scores,
            "average": round(sum(scores) / len(scores), 1),
            "total_reviewed": len(scores),
        }
        for team, scores in by_team.items()
    }

    all_scores = [e.get("score", 5) for e in today_log]
    avg_overall = round(sum(all_scores) / len(all_scores), 1) if all_scores else 0

    return {
        "today_average_score": avg_overall,
        "total_reviewed_today": len(today_log),
        "by_team": summary,
        "recent_log": today_log[-10:],
    }


@app.get("/api/health")
def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


# ── Static frontend ────────────────────────────────────────────────────────────

_FRONTEND = Path(__file__).parent.parent / "frontend"


@app.get("/landing")
def serve_landing_page():
    """New marketing landing page (dashboard/frontend/landing.html)."""
    path = _FRONTEND / "landing.html"
    if path.exists():
        return FileResponse(path)
    return {"error": "landing.html not found — create dashboard/frontend/landing.html"}


@app.get("/dashboard")
def serve_dashboard_page():
    """Product dashboard (dashboard/frontend/index.html)."""
    return FileResponse(_FRONTEND / "index.html")


# Serve static assets (images, fonts, etc.) from the frontend folder
app.mount("/static", StaticFiles(directory=str(_FRONTEND)), name="static")


if __name__ == "__main__":
    port = int(os.getenv("DASHBOARD_PORT", "8000"))
    uvicorn.run("dashboard.api.main:app", host="0.0.0.0", port=port, reload=True)
