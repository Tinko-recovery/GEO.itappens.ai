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
@app.get("/", response_class=HTMLResponse)
async def landing_page():
    """Vibrant, quirky, and animated high-converting landing page."""
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>itappens.ai | The Autonomous Collective</title>
        <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;600&display=swap" rel="stylesheet">
        <style>
            :root { --p: #ff00ff; --s: #00ffff; --bg: #030014; --glass: rgba(255, 255, 255, 0.05); }
            * { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
            body { background: var(--bg); color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; overflow-x: hidden; }
            .bg-glow { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; background: radial-gradient(circle at 50% 50%, #1a0033 0%, #030014 100%); }
            .blob { position: absolute; width: 500px; height: 500px; background: linear-gradient(45deg, var(--p), var(--s)); filter: blur(150px); border-radius: 50%; opacity: 0.15; animation: float 20s infinite alternate; }
            @keyframes float { from { transform: translate(-20%, -20%) scale(1); } to { transform: translate(20%, 20%) scale(1.2); } }
            
            nav { padding: 30px; display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; position: relative; z-index: 10; }
            .logo { font-family: 'Unbounded'; font-size: 1.5rem; background: linear-gradient(to right, var(--p), var(--s)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; }
            
            .hero { min-height: 90vh; display: flex; align-items: center; justify-content: center; max-width: 1200px; margin: 0 auto; padding: 0 40px; gap: 60px; }
            .hero-content { flex: 1.2; text-align: left; }
            .hero-image { flex: 0.8; position: relative; display: flex; justify-content: center; }
            
            h1 { font-family: 'Unbounded'; font-size: clamp(2.5rem, 6vw, 4.5rem); margin: 0; line-height: 1.1; }
            h1 mark { background: none; color: var(--s); text-shadow: 0 0 30px rgba(0,255,255,0.5); }
            p.tagline { font-size: 1.25rem; color: #b0b0d0; margin-top: 20px; max-width: 600px; line-height: 1.6; }
            
            .cta { display: inline-block; background: linear-gradient(45deg, var(--p), #6600ff); color: #fff; padding: 20px 45px; border-radius: 100px; text-decoration: none; font-weight: bold; margin-top: 40px; font-size: 1.1rem; box-shadow: 0 10px 40px rgba(255,0,255,0.3); border: none; cursor: pointer; }
            .cta:hover { transform: translateY(-5px) scale(1.05); box-shadow: 0 15px 50px rgba(255,0,255,0.5); }
            
            /* Telegram Mockup */
            .tg-mockup { width: 320px; height: 520px; background: #17212b; border-radius: 30px; border: 8px solid #242f3d; box-shadow: 0 30px 60px rgba(0,0,0,0.5); position: relative; overflow: hidden; font-size: 0.85rem; display: flex; flex-direction: column; }
            .tg-header { background: #242f3d; padding: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #1c2733; }
            .tg-avatar { width: 35px; height: 35px; background: var(--p); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.7rem; color: #fff; }
            .tg-body { flex: 1; padding: 15px; display: flex; flex-direction: column; gap: 12px; overflow: hidden; background: #0e1621; }
            .tg-msg { max-width: 85%; padding: 10px 12px; border-radius: 15px; position: relative; animation: slideUp 0.5s ease-out backwards; }
            .tg-msg.agent { background: #242f3d; align-self: flex-start; border-bottom-left-radius: 4px; color: #fff; }
            .tg-msg.user { background: #2b5278; align-self: flex-end; border-bottom-right-radius: 4px; color: #fff; }
            .tg-name { font-weight: bold; font-size: 0.75rem; margin-bottom: 4px; display: block; }
            .tg-msg.user .tg-name { color: #80c4ff; }
            .tg-msg.agent .tg-name { color: var(--s); }
            
            @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1200px; margin: 100px auto; padding: 40px 20px; }
            .card { background: var(--glass); backdrop-filter: blur(10px); padding: 40px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); }
            .card:hover { border-color: var(--s); transform: translateY(-10px); background: rgba(255,255,255,0.08); }
            .card h3 { font-family: 'Unbounded'; color: var(--p); margin-top: 0; }
            
            @media (max-width: 900px) {
                .hero { flex-direction: column; text-align: center; padding: 100px 20px; }
                .hero-content { text-align: center; }
                h1 { font-size: 3.5rem; }
                .tg-mockup { display: none; }
            }
        </style>
    </head>
    <body>
        <div class="bg-glow"></div>
        <div class="blob" style="top: -100px; left: -100px;"></div>
        <div class="blob" style="bottom: -200px; right: -100px; background: var(--s);"></div>
        
        <nav>
            <div class="logo">itappens.ai</div>
        </nav>

        <section class="hero">
            <div class="hero-content">
                <h1>it appens<br><mark>when you sleep.</mark></h1>
                <p class="tagline">The world's first autonomous workforce that actually finishes what it starts. 12 AI agents. One mission. Zero management required.</p>
                <a href="/dashboard" class="cta">Launch Your AI Team →</a>
            </div>
            <div class="hero-image">
                <div class="tg-mockup">
                    <div class="tg-header">
                        <div class="tg-avatar">IT</div>
                        <div>
                            <div style="font-weight:bold; color: #fff;">itappens.ai workforce</div>
                            <div style="font-size:0.7rem; color:#88abd0">12 members, 12 online</div>
                        </div>
                    </div>
                    <div class="tg-body" id="tg-chat">
                        <div class="tg-msg user">
                            <span class="tg-name">Founder</span>
                            Launch a high-converting shop for my coffee brand.
                        </div>
                        <div class="tg-msg agent" style="animation-delay: 1s">
                            <span class="tg-name">Zenith (CEO)</span>
                            Mission received. Activating Engineering and Marketing squads.
                        </div>
                        <div class="tg-msg agent" style="animation-delay: 2s">
                            <span class="tg-name">Lead Engineer</span>
                            Architecture designed. Shopify integration ready.
                        </div>
                        <div class="tg-msg agent" style="animation-delay: 3s">
                            <span class="tg-name">Marketing Lead</span>
                            Copy written. SEO keywords for 'Premium Coffee' indexed.
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="grid">
            <div class="card">
                <h3>⚡️ 24/7 Execution</h3>
                <p>Our agents don't sleep, don't complain, and don't need coffee. They build while you thrive.</p>
            </div>
            <div class="card">
                <h3>🛡️ Vigil QA Firewall</h3>
                <p>Every line of code and marketing tag is brutalized by Vigil. If it's not a 10/10, we redo it.</p>
            </div>
            <div class="card">
                <h3>🧠 Adaptive Brain</h3>
                <p>itappens remembers everything. Your brand voice, your tech stack, and your goals evolve with every sprint.</p>
            </div>
        </section>
    </body>
    </html>
    """

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard_ui():
    """Premium, quirky command center with real-time feedback."""
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>itappens.ai | Dashboard</title>
        <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;600&display=swap" rel="stylesheet">
        <style>
            :root { --p: #ff00ff; --s: #00ffff; --bg: #030014; --card: #0c0c1e; }
            * { box-sizing: border-box; }
            body { background: var(--bg); color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; display: flex; height: 100vh; overflow: hidden; }
            
            .sidebar { width: 280px; background: #000; border-right: 1px solid #1a1a3a; padding: 40px 25px; display: flex; flex-direction: column; }
            .main { flex: 1; padding: 50px; overflow-y: auto; background: linear-gradient(135deg, #030014 0%, #0a0020 100%); }
            .chatter { width: 400px; background: #000; border-left: 1px solid #1a1a3a; padding: 30px; display: flex; flex-direction: column; }
            
            .logo-small { font-family: 'Unbounded'; font-size: 1.2rem; color: var(--s); margin-bottom: 50px; font-weight: bold; }
            
            h1, h2, h3 { font-family: 'Unbounded'; margin-top: 0; }
            .card { background: var(--card); border: 1px solid #222244; padding: 35px; border-radius: 32px; margin-bottom: 30px; position: relative; overflow: hidden; }
            .card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(to right, var(--p), var(--s)); }
            
            textarea { width: 100%; background: #000; color: #fff; border: 2px solid #222244; padding: 20px; border-radius: 20px; font-size: 1rem; resize: none; margin-bottom: 20px; outline: none; transition: 0.3s; }
            textarea:focus { border-color: var(--s); box-shadow: 0 0 20px rgba(0,255,255,0.1); }
            
            .btn { background: linear-gradient(45deg, var(--p), #6600ff); color: #fff; border: none; padding: 18px 30px; border-radius: 100px; cursor: pointer; font-weight: bold; font-family: 'Unbounded'; letter-spacing: 1px; font-size: 0.8rem; width: 100%; text-transform: uppercase; }
            .btn:hover { transform: scale(1.02); filter: brightness(1.2); }
            .btn:disabled { opacity: 0.5; cursor: not-allowed; }

            #live-feed { flex: 1; overflow-y: auto; list-style: none; padding: 0; margin: 0; }
            .thought-entry { margin-bottom: 20px; animation: slideIn 0.4s ease-out; background: #0a0a20; padding: 15px; border-radius: 16px; border-left: 4px solid var(--p); }
            @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
            
            .thought-role { color: var(--s); font-size: 0.7rem; font-family: 'Unbounded'; text-transform: uppercase; margin-bottom: 8px; display: block; }
            .thought-msg { color: #ccc; line-height: 1.4; font-size: 0.9rem; }
            
            .plan-box { background: #000; border: 1px solid #333; padding: 20px; border-radius: 16px; font-family: monospace; font-size: 0.9rem; color: #00ff00; max-height: 400px; overflow-y: auto; }

            /* Mobile Overlays */
            @media (max-width: 1024px) {
                .sidebar, .chatter { display: none; }
                .main { padding: 30px; }
            }
        </style>
    </head>
    <body>
        <div class="sidebar">
            <div class="logo-small">itappens.ai</div>
            <nav style="flex: 1;">
                <p style="color: var(--s); font-weight: bold;">[01] DASHBOARD</p>
                <p style="opacity: 0.4;">[02] MISSION ARCHIVE</p>
                <p style="opacity: 0.4;">[03] BILLING NODES</p>
                <p style="opacity: 0.4;">[04] AUTONOMY CONFIG</p>
            </nav>
            <div style="font-size: 0.7rem; color: #444;">V.1.0.1 // SOVEREIGN_MODE</div>
        </div>

        <div class="main">
            <h1>MISSION CONTROL</h1>
            <div class="card">
                <h3>What are we building today?</h3>
                <textarea id="goal" rows="4" placeholder="e.g. Launch a high-converting shop for my coffee brand..."></textarea>
                <button class="btn" id="init-btn" onclick="submitMission()">Launch Your AI Team →</button>
            </div>
            <div id="mission-area"></div>
        </div>

        <div class="chatter">
            <h3 style="font-size: 0.9rem; border-bottom: 1px solid #1a1a3a; padding-bottom: 15px;">AGENT LIVE STREAM</h3>
            <ul id="live-feed">
                <li class="thought-entry initial">
                    <span class="thought-role">System</span>
                    <div class="thought-msg">Establishing connection to itappens.ai collective...</div>
                </li>
                <li class="thought-entry initial" style="animation-delay: 0.5s">
                    <span class="thought-role">Infrastructure</span>
                    <div class="thought-msg">Warm-up sequence active. Awaiting mission parameters...</div>
                </li>
            </ul>
        </div>

        <script>
            async function submitMission() {
                const goal = document.getElementById('goal').value;
                if(!goal) return alert('Goal required.');
                
                const btn = document.getElementById('init-btn');
                btn.disabled = true;
                btn.innerText = 'INITIALIZING COLLECTIVE CORE...';

                const res = await fetch('/missions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ goal })
                });
                const data = await res.json();
                pollMission(data.mission_id);
            }

            function pollMission(id) {
                const area = document.getElementById('mission-area');
                area.innerHTML = '<div class="card" style="border-color: var(--s);">🤖 ⚡ <strong>ITAPPENS.AI IS SCANNING...</strong> Deploying specialized AI agents for your mission.</div>';
                
                const timer = setInterval(async () => {
                    const res = await fetch(`/missions/${id}`);
                    const m = await res.json();
                    
                    if (m.state === 'planned') {
                        clearInterval(timer);
                        area.innerHTML = `
                            <div class="card" style="border-color: var(--p); background: #1a0026;">
                                <h3>AI SQUAD PROPOSAL: SPRINT #1</h3>
                                <div class="plan-box">${JSON.stringify(m.plan, null, 2)}</div>
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 30px;">
                                    <div>
                                        <span style="font-size: 0.7rem; color: #aaa; display: block;">WORKFORCE ALLOCATION</span>
                                        <span style="font-size: 1.5rem; font-family: 'Unbounded'; color: var(--s);">${m.budget_points} POINTS</span>
                                    </div>
                                    <button class="btn" style="width: auto;" onclick="approve('${id}')">Authorize Mission</button>
                                </div>
                            </div>
                        `;
                    } else if (m.state === 'failed') {
                        clearInterval(timer);
                        area.innerHTML = `<div class="card" style="border-color: #ff0055;">⚠️ <strong>CORE ERROR:</strong> ${m.error}</div>`;
                    }
                }, 3000);
            }

            async function approve(id) {
                await fetch(`/missions/${id}/approve`, { method: 'POST' });
                document.getElementById('mission-area').innerHTML = `
                    <div class="card" style="border-color: var(--s); animation: pulse 2s infinite;">
                        <h3>MISSION RUNNING</h3>
                        <p>12 AI Agents are executing parallel tasks. Watch the live stream on the right.</p>
                    </div>
                `;
            }

            // Real-time chatter sync
            setInterval(async () => {
                try {
                    const res = await fetch('/status/board');
                    const board = await res.json();
                    const feed = document.getElementById('live-feed');
                    let html = '';
                    
                    for (const [name, info] of Object.entries(board)) {
                        if (info.current_task) {
                            html += `
                                <li class="thought-entry">
                                    <span class="thought-role">${name}</span>
                                    <div class="thought-msg">${info.current_task}</div>
                                </li>
                            `;
                        }
                    }
                    if(html) feed.innerHTML = html;
                } catch(e) {}
            }, 3000);
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
