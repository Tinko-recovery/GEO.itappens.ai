"""
main.py
────────
Entry point for the itappens.ai autonomous AI company.
Runs the full multi-agent hierarchy in parallel using asyncio.
"""

import asyncio
import logging
import os
from datetime import datetime

from dotenv import load_dotenv

# ── Core infrastructure ───────────────────────────────────────────────────────
from memory.sprint_board import SprintBoard
from cost.cost_tracker import BudgetExceededError, CostTracker
from cost.auto_router import AutoRouter
from telegram_bot.reporter import TelegramReporter

# ── Orchestration ─────────────────────────────────────────────────────────────
from orchestration.ceo_agent import CEOAgent
from orchestration.cto_agent import CTOAgent
from orchestration.cpo_agent import CPOAgent

# ── Teams ─────────────────────────────────────────────────────────────────────
from teams.team_factory import TeamFactory

# ── Quality ───────────────────────────────────────────────────────────────────
from quality.quality_gate import QualityGateAgent

# ── Customer ──────────────────────────────────────────────────────────────────
from customer.customer_brain import CustomerBrain
from customer.onboarding_agent import OnboardingAgent
from customer.weekly_win_agent import WeeklyWinAgent
from customer.exit_interview import ExitInterviewAgent
from customer.referral_engine import ReferralEngine

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(levelname)s: %(message)s")
logger = logging.getLogger("itappens.ai")


# ── Product description (injected into all sales agents) ─────────────────────
PRODUCT_DESCRIPTION = """
itappens.ai provides autonomous AI product teams for solo founders and small SaaS companies.
Each team includes engineers and marketers powered by Claude AI.
The team ships features, writes code, creates marketing content, and finds customers — autonomously.
Starting at $497/mo. Saves clients $10,000+/month vs hiring.
"""


# ── Main company runner ──────────────────────────────────────────────────────

async def run_company(
    goal: str,
    customer_id: str,
    num_eng_teams: int = 2,
    num_mkt_teams: int = 2,
) -> dict:
    """
    Run the full itappens.ai AI company for one sprint.

    Steps:
      1. Initialize all infrastructure (SprintBoard, CostTracker, Telegram, etc.)
      2. Load or create customer brain
      3. If new customer → run OnboardingAgent (5-question interview)
      4. Start Telegram 15-min scheduler
      5. Budget kill switch check
      6. CEO plans missions → assigns to CTO and CPO
      7. CTO/CPO issue technical/marketing briefs
      8. TeamFactory spawns all teams simultaneously
      9. asyncio.gather() runs ALL teams in parallel
      10. Every output passes through QualityGateAgent
      11. CEO synthesizes final results
      12. CustomerBrain updated with sprint results
      13. Completion report sent to Telegram
    """

    logger.info("🚀 itappens.ai starting — customer: %s, goal: %s", customer_id, goal[:80])

    # ── Step 1: Initialize infrastructure ────────────────────────────────────
    daily_budget = float(os.getenv("DAILY_BUDGET_USD", "20.00"))
    alert_threshold = float(os.getenv("ALERT_THRESHOLD_USD", "15.00"))

    sprint_board = SprintBoard()
    telegram = TelegramReporter(sprint_board=sprint_board)
    cost_tracker = CostTracker(
        daily_budget_usd=daily_budget,
        alert_threshold_usd=alert_threshold,
        telegram_notifier=telegram,
    )
    auto_router = AutoRouter(cost_tracker=cost_tracker, telegram_notifier=telegram)
    quality_gate = QualityGateAgent(auto_router=auto_router, sprint_board=sprint_board, telegram_notifier=telegram)
    factory = TeamFactory(
        auto_router=auto_router,
        cost_tracker=cost_tracker,
        sprint_board=sprint_board,
        quality_gate=quality_gate,
        telegram_notifier=telegram,
    )

    # ── Step 2: Load or create customer brain ────────────────────────────────
    brain = CustomerBrain.load(customer_id)
    logger.info("Customer brain loaded for %s.", customer_id)

    # ── Step 3: Onboarding (new customers only) ──────────────────────────────
    if not OnboardingAgent.is_onboarding_complete(customer_id):
        logger.info("New customer — starting onboarding interview.")
        telegram.send_now(f"👋 New customer {customer_id} — starting onboarding interview.")
        onboarding = OnboardingAgent(customer_id=customer_id)
        brain = await onboarding.run_onboarding_interview()
        logger.info("Onboarding complete for %s.", customer_id)

    # ── Step 4: Start Telegram scheduler ────────────────────────────────────
    telegram.start_scheduler()
    telegram.start_polling()

    # ── Step 4b: Start Weekly Win scheduler ─────────────────────────────────
    def send_email(to: str, subject: str, body: str) -> None:
        """Simple adapter to call Gmail send tool."""
        try:
            from tools.gmail_tool import gmail_send_tool
            gmail_send_tool._run(to=to, subject=subject, body=body)
        except Exception as exc:
            logger.error("Email send failed: %s", exc)

    weekly_win = WeeklyWinAgent(
        sprint_board=sprint_board,
        cost_tracker=cost_tracker,
        gmail_send_fn=send_email,
        telegram=telegram,
    )
    weekly_win.start_scheduler()

    # ── Step 5: Send startup notification ───────────────────────────────────
    telegram.send_startup(goal, customer_id, num_eng_teams, num_mkt_teams)
    sprint_board.update("company", "status", "active")
    sprint_board.update("company", "current_task", "Teams introducing themselves")

    # ── Meet the Team ───────────────────────────────────────────────────────
    async def meet_the_team():
        exec_intro = (
            "🤝 *Meet your itappens.ai Executive Team:*\n\n"
            "👤 *Zenith (CEO):* I oversee high-level strategy, mission planning, and cross-team alignment.\n"
            "👤 *Cortex (CTO):* I manage the engineering architecture and technical delivery of your product.\n"
            "👤 *Synapse (CPO):* I handle the branding, content strategy, and marketing growth.\n"
        )
        
        crew_intro = (
            "\n🏗️ *Engineering Squad:* PM, Lead Engineer, Backend Dev, Frontend Dev, and QA Engineer.\n"
            "📢 *Marketing Squad:* PM, Content Lead, SEO Specialist, and Marketing Analyst.\n"
            "💼 *Sales Squad:* Lead Researcher, Outreach Agent, Content Creator, and Follow-up Agent.\n\n"
            "🚀 *Status:* All 12 specialists are online, briefed by Zenith/Cortex/Synapse, and starting work."
        )
        
        await telegram._send_async(exec_intro + crew_intro)
    
    await meet_the_team()

    # ── Step 5b: Budget kill switch ──────────────────────────────────────────
    try:
        cost_tracker.check_kill_switch()
    except BudgetExceededError as exc:
        logger.error("Budget exceeded before start: %s", exc)
        return {"error": str(exc), "status": "budget_exceeded"}

    # ── Step 6: CEO plans missions ───────────────────────────────────────────
    ceo = CEOAgent(auto_router=auto_router, sprint_board=sprint_board, telegram=telegram)
    sprint_plan = ceo.plan_missions(goal, customer_id, num_eng_teams, num_mkt_teams)
    
    # ── Step 6b: Human-in-the-Loop Budget Approval ──────────────────────────
    points = sprint_plan.get("budget_points", 15) # Default 15 pts
    approved = await telegram.ask_budget_approval(points)
    
    if not approved:
        logger.info("Mission cancelled by founder during budget approval.")
        await telegram._send_async("🛑 *Mission Aborted:* Zenith has halted all team operations as per your instruction.")
        return {"status": "cancelled", "reason": "budget_not_approved"}

    # ── Step 7: CTO and CPO issue briefs ─────────────────────────────────────
    cto = CTOAgent(auto_router=auto_router, sprint_board=sprint_board)
    cpo = CPOAgent(auto_router=auto_router, sprint_board=sprint_board)

    cto_missions = sprint_plan.get("cto_missions", [])
    cpo_missions = sprint_plan.get("cpo_missions", [])

    eng_briefs, mkt_briefs = await asyncio.gather(
        asyncio.get_event_loop().run_in_executor(None, cto.assign_missions, cto_missions, customer_id),
        asyncio.get_event_loop().run_in_executor(None, cpo.assign_missions, cpo_missions, customer_id),
    )

    # ── Step 8: Spawn all teams ───────────────────────────────────────────────
    teams_to_run = []

    for brief in eng_briefs:
        team_id = brief.get("team_id", f"eng_{len(teams_to_run)+1}")
        mission_text = brief.get("technical_brief", "")
        teams_to_run.append(factory.spawn_engineering_team(team_id, mission_text, customer_id))

    for brief in mkt_briefs:
        team_id = brief.get("team_id", f"mkt_{len(teams_to_run)+1}")
        teams_to_run.append(factory.spawn_marketing_team(team_id, brief, customer_id))

    logger.info("Spawning %d teams in parallel.", len(teams_to_run))
    sprint_board.update("company", "current_task", f"Running {len(teams_to_run)} teams in parallel")

    # ── Step 9: Run all teams simultaneously ─────────────────────────────────
    team_results = await factory.run_teams_in_parallel(teams_to_run)

    logger.info("All teams finished. Synthesizing results.")

    # ── Step 10: CEO synthesizes results ─────────────────────────────────────
    final_summary = ceo.synthesize_results(customer_id, sprint_plan, team_results)

    # ── Step 11: Update customer brain ───────────────────────────────────────
    brain_all = CustomerBrain.load(customer_id)
    past_count = len(brain_all.get("past_sprints", []))
    sprint_result = {
        "sprint_number": past_count + 1,
        "goal": goal,
        "completed": [
            f"Team {r['team_id']}: {r.get('quality_decision', 'done')}"
            for r in team_results.values() if r.get("status") == "done"
        ],
        "failed": [
            f"Team {r['team_id']}: {r.get('error', 'unknown')}"
            for r in team_results.values() if r.get("status") == "error"
        ],
        "customer_feedback": "",
        "finished_at": datetime.utcnow().isoformat(),
    }
    CustomerBrain.update_after_sprint(customer_id, sprint_result)

    # ── Step 12: Referral prompt after first sprint ───────────────────────────
    referral = ReferralEngine(telegram=telegram)
    if past_count == 0:
        referral.send_referral_prompt_after_sprint1(customer_id, CustomerBrain.load(customer_id))

    # ── Step 13: Send completion report ─────────────────────────────────────
    telegram.send_completion(customer_id, final_summary)
    sprint_board.update("company", "status", "done")
    sprint_board.update("company", "current_task", "Sprint complete")

    logger.info("✅ Sprint complete for customer %s.", customer_id)
    return {
        "status": "complete",
        "customer_id": customer_id,
        "sprint_goal": sprint_plan.get("sprint_goal", goal),
        "teams_run": len(teams_to_run),
        "summary": final_summary,
        "cost": {
            "spent_today": cost_tracker.today_spent(),
            "budget_remaining": cost_tracker.budget_remaining(),
        },
    }


# ── Sales team scheduler (runs daily at 9am) ─────────────────────────────────

async def run_daily_sales() -> None:
    """Run the autonomous sales team once."""
    from apscheduler.schedulers.asyncio import AsyncIOScheduler

    auto_router = AutoRouter()
    factory = TeamFactory(auto_router=auto_router)

    sales_tuple = factory.spawn_sales_team(PRODUCT_DESCRIPTION)
    results = await factory.run_teams_in_parallel([sales_tuple])
    logger.info("Daily sales run complete: %s", results)


from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import uvicorn
from memory.mission_store import MissionStore

app = FastAPI(title="itappens.ai API")
mission_store = MissionStore()

# ── Shared Infrastructure ─────────────────────────────────────────────────────
sprint_board = SprintBoard()
telegram = TelegramReporter(sprint_board=sprint_board)

class MissionRequest(BaseModel):
    goal: str
    customer_id: str = "guest_user"

@app.get("/", response_class=HTMLResponse)
async def landing_page():
    """High-converting marketing landing page."""
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8"><title>itappens.ai | The Autonomous Employee Workforce</title>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
        <style>
            :root { --p: #8000FF; --bg: #000; --text: #fff; }
            body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; margin: 0; overflow-x: hidden; }
            nav { padding: 30px; display: flex; justify-content: space-between; max-width: 1200px; margin: 0 auto; }
            .hero { height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: radial-gradient(circle at center, #1a0033 0%, #000 70%); }
            h1 { font-family: 'Orbitron'; font-size: 4rem; margin: 0; color: var(--p); text-shadow: 0 0 20px rgba(128,0,255,0.5); }
            p.tagline { font-size: 1.5rem; color: #888; margin-top: 10px; max-width: 600px; }
            .cta { background: var(--p); color: #fff; padding: 18px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; margin-top: 30px; transition: 0.3s; border: 1px solid var(--p); }
            .cta:hover { background: transparent; box-shadow: 0 0 30px var(--p); }
            .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; max-width: 1200px; margin: 80px auto; padding: 0 20px; }
            .f-card { background: #111; padding: 30px; border-radius: 15px; border: 1px solid #222; }
            .f-card h3 { color: var(--p); font-family: 'Orbitron'; }
        </style>
    </head>
    <body>
        <nav>
            <div style="font-family:'Orbitron'; font-weight:bold; font-size:1.5rem;">itappens.ai</div>
            <a href="/dashboard" class="cta" style="margin-top:0; padding:10px 25px;">Enter Dashboard</a>
        </nav>
        <div class="hero">
            <h1>HIRE AN AI NATION</h1>
            <p class="tagline">The world's first autonomous workforce. 12 specialists. 1 goal. Zero management.</p>
            <a href="/dashboard" class="cta">Start Your Mission</a>
        </div>
        <div class="features">
            <div class="f-card"><h3>24/7 Sprints</h3><p>Our agents don't sleep. They build, market, and sell while you dream.</p></div>
            <div class="f-card"><h3>Quality Firewall</h3><p>Vigil, our QA bot, scores every output. Buggy code never reaches you.</p></div>
            <div class="f-card"><h3>Point Economy</h3><p>Pay only for output. 10 points = $1 of autonomous labor.</p></div>
        </div>
    </body>
    </html>
    """

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard_ui():
    """Serve the mission control dashboard with real-time chatter."""
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8"><title>itappens.ai | Dashboard</title>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
        <style>
            :root { --p: #8000FF; --bg: #050505; --card: #111; --text: #eee; }
            body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; margin: 0; display: flex; height: 100vh; }
            .sidebar { width: 280px; background: #000; border-right: 1px solid #222; padding: 30px; box-sizing: border-box; }
            .main { flex: 1; padding: 40px; overflow-y: auto; }
            .chatter { width: 350px; background: #0a0a0a; border-left: 1px solid #222; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; }
            h1, h2 { font-family: 'Orbitron', sans-serif; color: var(--p); }
            .card { background: var(--card); border: 1px solid #333; padding: 25px; border-radius: 12px; margin-bottom: 20px; }
            textarea { width: 100%; background: #000; color: #fff; border: 1px solid #444; padding: 15px; border-radius: 8px; box-sizing: border-box; font-size: 1rem; }
            button { background: var(--p); color: #fff; border: none; padding: 12px 25px; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 15px; width: 100%; }
            button:hover { filter: brightness(1.2); }
            #live-feed { flex: 1; overflow-y: auto; font-family: monospace; font-size: 0.85em; color: #aaa; list-style: none; padding: 0; }
            .thought-entry { margin-bottom: 15px; border-bottom: 1px solid #222; padding-bottom: 10px; }
            .thought-role { color: var(--p); font-weight: bold; margin-bottom: 3px; display: block; }
            .plan-box { background: #000; border-left: 3px solid var(--p); padding: 15px; margin-top: 15px; white-space: pre-wrap; font-size: 0.9em; max-height: 300px; overflow-y: auto; }
        </style>
    </head>
    <body>
        <div class="sidebar">
            <h2 style="font-size: 1.2rem;">ITAPPENS.AI</h2>
            <p style="color:#666; font-size:0.8rem;">Sovereign AI Workforce</p>
            <div style="margin-top:40px;">
                <p style="color:var(--p);">• Dashboard</p>
                <p>• Missions</p>
                <p>• Billing</p>
            </div>
        </div>
        <div class="main">
            <h1>MISSION CONTROL</h1>
            <div class="card">
                <h3>New Mission Goal</h3>
                <textarea id="goal" rows="4" placeholder="Launch a local coffee shop brand..."></textarea>
                <button id="init-btn" onclick="submitMission()">Initialize Zenith</button>
            </div>
            <div id="mission-area"></div>
        </div>
        <div class="chatter">
            <h3>AGENT LIVE FEED</h3>
            <ul id="live-feed">
                <li class="thought-entry"><i>System: Awaiting mission to wake agents...</i></li>
            </ul>
        </div>
        <script>
            async function submitMission() {
                const goal = document.getElementById('goal').value;
                if(!goal) return alert('Enter a goal.');
                document.getElementById('init-btn').disabled = true;
                document.getElementById('init-btn').innerText = 'Initializing...';
                
                const res = await fetch('/missions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ goal })
                });
                const data = await res.json();
                pollMission(data.mission_id);
            }

            async function pollMission(id) {
                const area = document.getElementById('mission-area');
                area.innerHTML = '<div class="card">🤖 Zenith is planning missions...</div>';
                
                const timer = setInterval(async () => {
                    const res = await fetch(`/missions/${id}`);
                    const m = await res.json();
                    
                    if (m.state === 'planned') {
                        clearInterval(timer);
                        area.innerHTML = `
                            <div class="card" style="border-color: var(--p);">
                                <h3>ZENITH PROPOSAL RECEIVED</h3>
                                <div class="plan-box">${JSON.stringify(m.plan, null, 2)}</div>
                                <p style="font-size: 1.2rem; margin-top: 20px;">Allocation Needed: <span style="color: var(--p);">${m.budget_points} Points</span></p>
                                <button onclick="approve('${id}')">Approve & Start Mission</button>
                            </div>
                        `;
                    } else if (m.state === 'failed') {
                        clearInterval(timer);
                        area.innerHTML = `<div class="card" style="border-color: red;">❌ Planning Failed: ${m.error || 'Check logs'}</div>`;
                        document.getElementById('init-btn').disabled = false;
                        document.getElementById('init-btn').innerText = 'Retry Initialization';
                    }
                }, 3000);
            }

            async function approve(id) {
                await fetch(`/missions/${id}/approve`, { method: 'POST' });
                alert('Mission Approved! Agents are waking up.');
                document.getElementById('mission-area').innerHTML = '<div class="card">⚡ Mission in progress. Watch the Live Feed.</div>';
            }

            // Simple status feed polling
            setInterval(async () => {
                const res = await fetch('/status/board');
                const board = await res.json();
                const feed = document.getElementById('live-feed');
                let html = '';
                for (const [id, info] of Object.entries(board)) {
                    if (info.current_task) {
                        html += `<li class="thought-entry">
                            <span class="thought-role">${id}</span>
                            ${info.current_task}
                        </li>`;
                    }
                }
                if(html) feed.innerHTML = html;
            }, 4000);
        </script>
    </body>
    </html>
    """

@app.get("/status/board")
async def get_board():
    return sprint_board.get_full_board()

@app.post("/missions")
async def create_mission(req: MissionRequest, background_tasks: BackgroundTasks):
    mission_id = mission_store.create_mission(req.customer_id, req.goal)
    background_tasks.add_task(plan_mission_logic, mission_id)
    return {"mission_id": mission_id, "status": "draft"}

@app.get("/missions/{mission_id}")
async def get_mission(mission_id: str):
    m = mission_store.get_mission(mission_id)
    if not m: raise HTTPException(status_code=404)
    return m

@app.post("/missions/{mission_id}/approve")
async def approve_mission(mission_id: str, background_tasks: BackgroundTasks):
    m = mission_store.get_mission(mission_id)
    if not m: raise HTTPException(status_code=404)
    mission_store.approve_mission(mission_id)
    background_tasks.add_task(run_approved_mission, mission_id)
    return {"status": "approved"}

async def plan_mission_logic(mission_id: str):
    """Background task to let Zenith plan the mission."""
    try:
        m = mission_store.get_mission(mission_id)
        if not m: return
        
        logger.info(f"Zenith starting plan for mission {mission_id}")
        
        daily_budget = float(os.getenv("DAILY_BUDGET_USD", "20.00"))
        cost_tracker = CostTracker(daily_budget_usd=daily_budget, telegram_notifier=telegram)
        auto_router = AutoRouter(cost_tracker=cost_tracker, telegram_notifier=telegram)
        
        ceo = CEOAgent(auto_router=auto_router, sprint_board=sprint_board, telegram=telegram)
        plan = ceo.plan_missions(m["goal"], m["customer_id"])
        points = plan.get("budget_points", 15)
        
        mission_store.update_plan(mission_id, plan, points)
        await telegram._send_async(f"🎯 *New Mission Planned:* User is viewing the proposal for '{m['goal'][:50]}...'. Awaiting approval on dashboard.")
        logger.info(f"Zenith finished plan for mission {mission_id}")
    except Exception as e:
        logger.error(f"Zenith failed to plan mission {mission_id}: {e}")
        # Update mission with error state so UI stops polling
        with mission_store._lock:
            data = mission_store._read()
            if mission_id in data:
                data[mission_id]["state"] = "failed"
                data[mission_id]["error"] = str(e)
                mission_store._write(data)

async def run_approved_mission(mission_id: str):
    """Kick off the actual agents for an approved mission."""
    m = mission_store.get_mission(mission_id)
    # Re-use run_company logic but bypass onboarding for now
    await run_company(goal=m["goal"], customer_id=m["customer_id"])


# ── Entry point ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.getenv("PORT", "10000"))
    logger.info(f"itappens.ai SaaS Portal live on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
