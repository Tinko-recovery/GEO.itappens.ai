"""
main.py
────────
Entry point for the itappens.ai autonomous AI company.
Runs the full multi-agent hierarchy in parallel using asyncio.
"""

import asyncio
import logging
import os
import sys
import uvicorn
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
from billing.razorpay_handler import create_razorpay_order, verify_payment, add_to_waitlist

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(levelname)s: %(message)s")
logger = logging.getLogger("itappens.ai")

# ── Global Shared Infrastructure ──────────────────────────────────────────────
sprint_board = SprintBoard()
telegram = TelegramReporter(sprint_board=sprint_board)


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

    # ── Step 8: Spawn and run Scouting phase (Sequential if present) ──────────
    scouting_missions = sprint_plan.get("scouting_missions", [])
    scouting_results = {}
    
    if scouting_missions:
        scout_teams = []
        for mission in scouting_missions:
            team_id = mission.get("team_id", f"scout_{len(scout_teams)+1}")
            scout_teams.append(factory.spawn_scouting_team(team_id, mission.get("mission", ""), customer_id))
        
        logger.info("Running Scouting phase...")
        scouting_results = await factory.run_teams_in_parallel(scout_teams)
        
        # Inject scouting results into CTO/CPO context for the next phase
        combined_findings = "\n".join([str(res.get("output", "")) for res in scouting_results.values()])
        goal = f"{goal}\n\nUSER SELECTED THIS FOCUS FROM SCOUTING:\n{combined_findings}"

    # ── Step 8b: CTO and CPO issue briefs (now with scouting context) ──────────
    cto = CTOAgent(auto_router=auto_router, sprint_board=sprint_board)
    cpo = CPOAgent(auto_router=auto_router, sprint_board=sprint_board)

    cto_missions = sprint_plan.get("cto_missions", [])
    cpo_missions = sprint_plan.get("cpo_missions", [])

    eng_briefs, mkt_briefs = await asyncio.gather(
        asyncio.get_event_loop().run_in_executor(None, cto.assign_missions, cto_missions, customer_id),
        asyncio.get_event_loop().run_in_executor(None, cpo.assign_missions, cpo_missions, customer_id),
    )

    # ── Step 9: Spawn and run Execution phase (Parallel) ─────────────────────
    execution_teams = []

    upwork_missions = sprint_plan.get("upwork_missions", [])
    for mission in upwork_missions:
        team_id = mission.get("team_id", f"upwork_{len(execution_teams)+1}")
        execution_teams.append(factory.spawn_upwork_team(team_id, mission.get("mission", ""), customer_id))

    for brief in eng_briefs:
        team_id = brief.get("team_id", f"eng_{len(execution_teams)+1}")
        execution_teams.append(factory.spawn_engineering_team(team_id, brief.get("technical_brief", ""), customer_id))

    for brief in mkt_briefs:
        team_id = brief.get("team_id", f"mkt_{len(execution_teams)+1}")
        execution_teams.append(factory.spawn_marketing_team(team_id, brief, customer_id))

    logger.info("Spawning %d execution teams in parallel.", len(execution_teams))
    team_results = await factory.run_teams_in_parallel(execution_teams)
    
    # Merge results
    all_results = {**scouting_results, **team_results}
    team_results = all_results

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


from fastapi import FastAPI, BackgroundTasks, HTTPException, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from pydantic import BaseModel
import uvicorn
from memory.mission_store import MissionStore
from billing.razorpay_handler import (
    create_razorpay_order,
    verify_payment,
    add_to_waitlist,
)

app = FastAPI(title="itappens.ai API")
mission_store = MissionStore()

# ── Shared Infrastructure ─────────────────────────────────────────────────────
sprint_board = SprintBoard()
telegram = TelegramReporter(sprint_board=sprint_board)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Telegram Bot listener...")
    telegram.start_polling()
    _start_stock_scheduler()


# ── Stock Intelligence Scheduler ──────────────────────────────────────────────

# Default demo portfolio — customers set their own via Telegram /portfolio command
_DEFAULT_PORTFOLIO = os.getenv("STOCK_PORTFOLIO", "RELIANCE,TCS,INFY,HDFCBANK,TATAMOTORS").split(",")
_STOCK_CUSTOMER_ID = os.getenv("STOCK_CUSTOMER_ID", "stock_user_001")


def _start_stock_scheduler():
    """
    Schedules two recurring stock intelligence jobs using APScheduler:
      - Morning briefing:  08:30 IST (03:00 UTC) Mon–Fri
      - Intraday scan:     Every 30 min, 09:15–15:30 IST (03:45–10:00 UTC) Mon–Fri
    """
    from apscheduler.schedulers.asyncio import AsyncIOScheduler
    from apscheduler.triggers.cron import CronTrigger

    scheduler = AsyncIOScheduler(timezone="UTC")

    # Morning briefing — 03:00 UTC = 08:30 IST
    scheduler.add_job(
        _run_morning_briefing_job,
        CronTrigger(day_of_week="mon-fri", hour=3, minute=0),
        id="stock_morning_briefing",
        replace_existing=True,
    )

    # Intraday scan — every 30 min from 03:45–10:00 UTC (09:15–15:30 IST)
    scheduler.add_job(
        _run_intraday_scan_job,
        CronTrigger(day_of_week="mon-fri", hour="3-10", minute="15,45"),
        id="stock_intraday_scan",
        replace_existing=True,
    )

    scheduler.start()
    logger.info("Stock Intelligence scheduler started (morning briefing 08:30 IST, intraday every 30min)")


async def _run_morning_briefing_job():
    from teams.stock_team import run_morning_briefing
    auto_router = AutoRouter(telegram_notifier=telegram)
    await run_morning_briefing(
        portfolio=_DEFAULT_PORTFOLIO,
        customer_id=_STOCK_CUSTOMER_ID,
        auto_router=auto_router,
        telegram_notifier=telegram,
    )


async def _run_intraday_scan_job():
    from teams.stock_team import run_intraday_scan
    auto_router = AutoRouter(telegram_notifier=telegram)
    await run_intraday_scan(
        portfolio=_DEFAULT_PORTFOLIO,
        customer_id=_STOCK_CUSTOMER_ID,
        auto_router=auto_router,
        telegram_notifier=telegram,
    )

class MissionRequest(BaseModel):
    goal: str
    customer_id: str = "guest_user"

@app.get("/", response_class=HTMLResponse)
async def landing_page():
    """Vibrant, quirky, and animated high-converting landing page."""
    rzp_key = os.getenv("RAZORPAY_KEY_ID", "")
    html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>itappens.ai | The Autonomous Workforce</title>
        <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;600&display=swap" rel="stylesheet">
        <script>
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init('__POSTHOG_KEY__',{api_host:'https://app.posthog.com'});
        </script>
        <style>
            :root { --p: #ff00ff; --s: #00ffff; --bg: #030014; --glass: rgba(255, 255, 255, 0.05); --border: rgba(255, 255, 255, 0.1); }
            * { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-sizing: border-box; }
            body { background: var(--bg); color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; overflow-x: hidden; scroll-behavior: smooth; }
            h1, h2, h3, .logo { font-family: 'Unbounded'; }
            
            .bg-glow { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; background: radial-gradient(circle at 50% 50%, #1a0033 0%, #030014 100%); }
            .blob { position: absolute; width: 600px; height: 600px; background: linear-gradient(45deg, var(--p), var(--s)); filter: blur(180px); border-radius: 50%; opacity: 0.12; animation: float 25s infinite alternate; z-index: -1; }
            @keyframes float { from { transform: translate(-10%, -10%) rotate(0deg); } to { transform: translate(10%, 10%) rotate(180deg); } }
            
            /* Nav */
            nav { padding: 25px 40px; display: flex; justify-content: space-between; align-items: center; max-width: 1300px; margin: 0 auto; position: sticky; top: 0; z-index: 100; background: rgba(3, 0, 20, 0.8); backdrop-filter: blur(15px); }
            .logo { font-size: 1.6rem; background: linear-gradient(to right, var(--p), var(--s)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; position: relative; }
            .logo::after { content: ''; position: absolute; right: -15px; top: 5px; width: 8px; height: 8px; background: #00ff00; border-radius: 50%; box-shadow: 0 0 10px #00ff00; animation: pulse 2s infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }
            .nav-links { display: flex; gap: 40px; align-items: center; }
            .nav-links a { color: #fff; text-decoration: none; font-size: 0.9rem; font-weight: 500; opacity: 0.7; }
            .nav-links a:hover { opacity: 1; color: var(--s); }
            
            /* Utils */
            .section { padding: 120px 20px; max-width: 1200px; margin: 0 auto; }
            .center { text-align: center; }
            .cta { display: inline-block; background: linear-gradient(45deg, var(--p), #6600ff); color: #fff; padding: 22px 50px; border-radius: 100px; text-decoration: none; font-weight: bold; font-size: 1.1rem; box-shadow: 0 10px 40px rgba(255,0,255,0.3); position: relative; overflow: hidden; }
            .cta:hover { transform: translateY(-5px); box-shadow: 0 20px 60px rgba(255,0,255,0.5); }
            mark { background: none; color: var(--s); text-shadow: 0 0 30px rgba(0,255,255,0.3); }

            /* Hero */
            .hero { min-height: 90vh; display: flex; align-items: center; justify-content: center; gap: 80px; }
            .hero-content { flex: 1.2; }
            .hero-image { flex: 0.8; display: flex; justify-content: center; }
            h1 { font-size: clamp(3rem, 7vw, 5.5rem); margin: 0; line-height: 1; letter-spacing: -2px; }
            .hero p.subtext { font-size: 1.3rem; color: #b0b0d0; margin-top: 30px; line-height: 1.6; max-width: 600px; }
            
            /* Telegram Mockup */
            .tg-mockup { width: 340px; height: 560px; background: #17212b; border-radius: 35px; border: 8px solid #242f3d; box-shadow: 0 40px 80px rgba(0,0,0,0.6); position: relative; overflow: hidden; display: flex; flex-direction: column; font-size: 0.85rem; }
            .tg-header { background: #242f3d; padding: 15px; display: flex; align-items: center; gap: 12px; }
            .tg-avatar { width: 40px; height: 40px; background: var(--p); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-family: 'Unbounded'; font-size: 0.7rem; }
            .tg-body { flex: 1; padding: 18px; background: #0e1621; display: flex; flex-direction: column; gap: 14px; overflow: hidden; }
            .tg-msg { max-width: 90%; padding: 12px 15px; border-radius: 18px; animation: slideUp 0.5s ease-out backwards; }
            .tg-msg.agent { background: #242f3d; align-self: flex-start; border-bottom-left-radius: 4px; }
            .tg-msg.user { background: #2b5278; align-self: flex-end; border-bottom-right-radius: 4px; }
            .tg-role { font-weight: bold; font-size: 0.75rem; margin-bottom: 4px; display: block; color: var(--s); }
            @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

            /* Ticker */
            .ticker-wrap { background: #000; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 20px 0; overflow: hidden; margin-top: 40px; }
            .ticker { display: flex; gap: 50px; animation: ticker 40s linear infinite; width: max-content; }
            .ticker span { font-size: 1.1rem; font-weight: bold; color: #fff; text-transform: uppercase; white-space: nowrap; display: flex; align-items: center; gap: 15px; }
            .ticker span::after { content: '·'; color: var(--s); font-size: 2rem; }
            @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

            /* Stats */
            .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 60px; }
            .stat-box { text-align: center; border-right: 1px solid var(--border); padding: 20px; }
            .stat-box:last-child { border-right: none; }
            .stat-num { font-size: 3rem; font-weight: 700; color: var(--s); margin-bottom: 10px; }
            .stat-label { font-size: 0.9rem; color: #888; text-transform: uppercase; letter-spacing: 1px; }

            /* Feature Card */
            .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 80px; }
            .f-card { background: var(--glass); border: 1px solid var(--border); border-radius: 30px; padding: 45px; position: relative; }
            .f-card:hover { border-color: var(--s); transform: translateY(-10px); background: rgba(255,255,255,0.08); }
            .f-card h3 { font-size: 1.4rem; color: var(--p); margin-top: 0; }
            .f-card p { line-height: 1.7; color: #ccc; }

            /* Dynamic Brain */
            .brain-section { background: rgba(255,0,255,0.02); border-radius: 50px; padding: 80px; margin-top: 100px; display: flex; gap: 60px; align-items: center; }
            .console { flex: 1; background: #000; border-radius: 20px; padding: 25px; font-family: monospace; border: 1px solid #333; line-height: 1.8; font-size: 0.9rem; box-shadow: 0 30px 60px rgba(0,0,0,0.4); }
            .console .line { margin-bottom: 5px; }
            .c-blue { color: #00ffff; } .c-pink { color: #ff00ff; } .c-green { color: #00ff00; } .c-gray { color: #666; }

            /* Comparison */
            .compare-box { margin-top: 100px; display: grid; grid-template-columns: 1fr 1fr; gap: 50px; }
            .compare-item { padding: 40px; border-radius: 35px; }
            .old-way { background: rgba(255,0,0,0.05); border: 1px solid rgba(255,0,0,0.2); }
            .new-way { background: rgba(0,255,255,0.05); border: 1px solid rgba(0,255,0,0.2); }
            .price-row { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
            
            /* Ships in 14 days */
            .ship-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 60px; }
            .ship-list { background: var(--glass); padding: 40px; border-radius: 30px; list-style: none; }
            .ship-list li { margin-bottom: 15px; padding-left: 30px; position: relative; display: flex; align-items: center; gap: 10px; }
            .ship-list li::before { content: '✓'; color: #00ff00; position: absolute; left: 0; font-weight: bold; }

            /* Pricing */
            .pricing { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 80px; }
            .p-card { background: var(--glass); border: 1px solid var(--border); border-radius: 40px; padding: 50px; text-align: center; position: relative; }
            .p-card.popular { border: 2px solid var(--s); background: rgba(0, 255, 255, 0.03); transform: scale(1.05); }
            .p-price { font-size: 3.5rem; font-weight: bold; font-family: 'Unbounded'; margin: 25px 0; }
            .p-features { list-style: none; padding: 0; text-align: left; margin: 40px 0; }
            .p-features li { padding: 12px 0; border-bottom: 1px solid var(--border); font-size: 0.95rem; opacity: 0.8; }

            /* Countdown */
            .countdown { font-family: 'Unbounded'; font-size: 1.5rem; color: var(--s); margin-top: 20px; }

            /* FAQ */
            .faq { max-width: 800px; margin: 100px auto; }
            .faq-item { border-bottom: 1px solid var(--border); padding: 30px 0; }
            .faq h4 { margin: 0 0 15px 0; font-size: 1.2rem; cursor: pointer; color: var(--s); }
            .faq p { margin: 0; color: #aaa; line-height: 1.6; }

            /* Mission Library Scroller */
            .mission-section { padding: 100px 0; overflow: hidden; position: relative; }
            .mission-scroller-wrap { 
                margin-top: 50px; 
                padding: 20px 40px; 
                overflow-x: auto; 
                display: flex; 
                gap: 25px; 
                scrollbar-width: none; 
                -ms-overflow-style: none;
                mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            }
            .mission-scroller-wrap::-webkit-scrollbar { display: none; }
            
            .mission-card { 
                flex: 0 0 350px; 
                background: var(--glass); 
                border: 1px solid var(--border); 
                border-radius: 30px; 
                padding: 40px; 
                position: relative; 
                display: flex; 
                flex-direction: column; 
                justify-content: space-between;
                min-height: 280px;
                backdrop-filter: blur(10px);
            }
            .mission-card:hover { border-color: var(--s); transform: translateY(-10px) scale(1.02); background: rgba(255,255,255,0.08); box-shadow: 0 20px 40px rgba(0,255,255,0.1); }
            
            .mission-badge { 
                display: inline-block; 
                background: rgba(0,255,255,0.1); 
                border: 1px solid rgba(0,255,255,0.3); 
                color: var(--s); 
                padding: 4px 12px; 
                border-radius: 100px; 
                font-size: 0.75rem; 
                font-weight: bold; 
                letter-spacing: 1px; 
                margin-bottom: 15px;
            }
            .mission-card h3 { font-size: 1.4rem; margin: 0 0 15px 0; line-height: 1.3; }
            .mission-card p { font-size: 0.95rem; color: #aaa; line-height: 1.6; margin: 0; }
            .mission-icon { font-size: 2.5rem; margin-bottom: 15px; }

            /* Footer */
            footer { padding: 80px 40px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; max-width: 1300px; margin: 0 auto; color: #555; font-size: 0.9rem; }

            @media (max-width: 1024px) {
                .hero, .stats-grid, .features, .pricing, .ship-grid, .compare-box, .brain-section { grid-template-columns: 1fr; flex-direction: column; }
                .hero-content { text-align: center; }
                .nav-links { display: none; }
                .hero-image { order: -1; }
                .mission-scroller-wrap { padding: 20px; }
                .mission-card { flex: 0 0 300px; }
            }
        </style>
    </head>
    <body>
        <div class="bg-glow"></div>
        <div class="blob" style="top: -100px; left: -100px;"></div>
        <div class="blob" style="bottom: -200px; right: -100px; background: var(--s);"></div>
        
        <nav>
            <div class="logo">itappens.ai</div>
            <div class="nav-links">
                <a href="#how">How it works</a>
                <a href="#pricing">Pricing</a>
                <a href="/security">Security</a>
                <a href="/dashboard" class="cta" style="padding: 12px 30px; font-size: 0.9rem; margin: 0;">Launch Your Team →</a>
            </div>
        </nav>

        <section class="section hero">
            <div class="hero-content">
                <h1>it appens<br><mark>when you sleep.</mark></h1>
                <p class="subtext">12 AI specialists. Engineers, marketers, salespeople. They work while you sleep, pick their own tools, and won't ship anything without your approval.</p>
                <a href="#pricing" class="cta" style="margin-top: 50px;">See Pricing →</a>
                <div style="margin-top: 24px; display: flex; gap: 10px; max-width: 480px; flex-wrap: wrap;">
                    <input id="hero-email" type="email" placeholder="your@email.com" style="flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 14px 20px; border-radius: 100px; font-size: 0.95rem; outline: none; min-width: 200px;">
                    <button onclick="joinWaitlist('hero-email','hero')" style="background: rgba(255,0,255,0.15); border: 1px solid rgba(255,0,255,0.4); color: var(--p); padding: 14px 24px; border-radius: 100px; cursor: pointer; font-weight: bold; font-size: 0.9rem; white-space: nowrap;">Join Waitlist</button>
                </div>
                <p id="hero-msg" style="margin-top: 10px; font-size: 0.85rem; color: #00ff88; min-height: 20px;"></p>
            </div>
            <div class="hero-image">
                <div class="tg-mockup">
                    <div class="tg-header">
                        <div class="tg-avatar">IT</div>
                        <div>
                            <div style="font-weight:bold; color: #fff;">itappens.ai workforce</div>
                            <div style="font-size:0.75rem; color:#88abd0">12 members, 12 online</div>
                        </div>
                    </div>
                    <div class="tg-body" id="tg-chat">
                        <div class="tg-msg agent">
                            <span class="tg-role">🧠 Backend Agent → Claude Sonnet</span>
                            Designing auth system before API endpoints...
                        </div>
                        <div class="tg-msg agent" style="animation-delay: 1.5s">
                            <span class="tg-role">✅ Engineering Team A</span>
                            12 REST endpoints complete. Cost: $0.43
                        </div>
                        <div class="tg-msg agent" style="animation-delay: 3s">
                            <span class="tg-role">⚡ Dynamic Router</span>
                            SEO task → Gemini Flash (long context, free)
                        </div>
                        <div class="tg-msg agent" style="animation-delay: 4.5s">
                            <span class="tg-role">🔥 Hot Lead</span>
                            Marcus replied: "tell me more"
                            <div style="display:flex; gap:8px; margin-top:10px;">
                                <div style="background: #2b5278; padding: 4px 10px; border-radius: 4px; font-size: 0.7rem;">✅ Send Draft</div>
                                <div style="background: #333; padding: 4px 10px; border-radius: 4px; font-size: 0.7rem;">✏️ Edit</div>
                            </div>
                        </div>
                        <div class="tg-msg user" style="animation-delay: 6s; background: #00ff00; color: #000;">
                            <span style="font-weight:bold">💸 Total Sprint Cost: $1.42</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="ticker-wrap">
            <div class="ticker">
                <span>Engineers shipping code 24/7</span>
                <span>Smart model routing — always cheapest</span>
                <span>Nothing goes live without your approval</span>
                <span>Leads found while you sleep</span>
                <span>$7 average daily cost</span>
                <span>Zero management required</span>
                <!-- Repeat for smooth loop -->
                <span>Engineers shipping code 24/7</span>
                <span>Smart model routing — always cheapest</span>
                <span>Nothing goes live without your approval</span>
                <span>Leads found while you sleep</span>
                <span>$7 average daily cost</span>
                <span>Zero management required</span>
            </div>
        </div>

        <section class="section stats-grid">
            <div class="stat-box">
                <div class="stat-num">$14,503</div>
                <div class="stat-label">saved/month vs hiring</div>
            </div>
            <div class="stat-box">
                <div class="stat-num">12</div>
                <div class="stat-label">AI specialists in your team</div>
            </div>
            <div class="stat-box">
                <div class="stat-num">$7</div>
                <div class="stat-label">avg daily cost</div>
            </div>
            <div class="stat-box">
                <div class="stat-num">8+/10</div>
                <div class="stat-label">quality gate minimum</div>
            </div>
        </section>

        <section class="section features">
            <div class="f-card">
                <h3>⚡ 24/7 Execution</h3>
                <p>Your team never sleeps, never complains, and never misses a standup. Ships while you thrive.</p>
            </div>
            <div class="f-card">
                <h3>🛡️ Vigil QA Firewall</h3>
                <p>Every output scored 1-10 before you see it. Below 8? Automatically redone. Nothing reaches you that isn't ready.</p>
            </div>
            <div class="f-card">
                <h3>🧠 Adaptive Brain</h3>
                <p>Remembers your stack, your voice, and your decisions. Gets smarter every sprint as it learns your business.</p>
            </div>
        </section>

        <!-- ── Mission Library (Use Case Scroller) ─────────────────────────── -->
        <section class="section mission-section">
            <div class="center">
                <div style="display:inline-block; background: rgba(0,255,255,0.1); border: 1px solid rgba(0,255,255,0.3); border-radius: 100px; padding: 8px 24px; font-size: 0.85rem; color: var(--s); margin-bottom: 20px; letter-spacing: 2px; text-transform: uppercase;">Mission Library</div>
                <h2 style="font-size: clamp(2rem, 5vw, 3.5rem);">What can your <mark>workforce</mark> do?</h2>
                <p style="font-size: 1.3rem; opacity: 0.7; max-width: 700px; margin: 20px auto 0;">Scroll through pre-configured missions designed to scale your business while you focus on the big picture.</p>
            </div>
            
            <div class="mission-scroller-wrap">
                <div class="mission-card">
                    <div>
                        <div class="mission-icon">🏗️</div>
                        <span class="mission-badge">DEV</span>
                        <h3>Autonomous SaaS Builder</h3>
                        <p>Researches niches, designs databases, builds frontends, and deploys full-stack apps in a single sprint cycle.</p>
                    </div>
                </div>
                
                <div class="mission-card">
                    <div>
                        <div class="mission-icon">🕵️</div>
                        <span class="mission-badge">INTEL</span>
                        <h3>Deep Competitor Shadowing</h3>
                        <p>Monitors pricing, new features, and social sentiment of your rivals. Delivers daily "War Room" tactical updates.</p>
                    </div>
                </div>
                
                <div class="mission-card">
                    <div>
                        <div class="mission-icon">💰</div>
                        <span class="mission-badge">PROFIT</span>
                        <h3>Passive Revenue Stream</h3>
                        <p>Autonomously searches Upwork/Fiverr, writes winning proposals, and executes technical tasks for AI-led income.</p>
                    </div>
                </div>
                
                <div class="mission-card">
                    <div>
                        <div class="mission-icon">🌟</div>
                        <span class="mission-badge">SOCIAL</span>
                        <h3>Personal Brand Omnipresence</h3>
                        <p>Creates strategy, writes posts, and handles engagement across LinkedIn/X to build your authority 24/7.</p>
                    </div>
                </div>
                
                <div class="mission-card">
                    <div>
                        <div class="mission-icon">⚖️</div>
                        <span class="mission-badge">GROWTH</span>
                        <h3>VC & Angel Scout</h3>
                        <p>Identifies active investors, analyzes their "sweet spots," and drafts hyper-personalized outreach for your next round.</p>
                    </div>
                </div>
                
                <div class="mission-card">
                    <div>
                        <div class="mission-icon">🛒</div>
                        <span class="mission-badge">ARBITRAGE</span>
                        <h3>E-com Winning Hunter</h3>
                        <p>Monitors viral TikTok trends, calculates margins, and prepares ready-to-launch product proposals for dropshipping.</p>
                    </div>
                </div>
                
                <div class="mission-card">
                    <div>
                        <div class="mission-icon">🌍</div>
                        <span class="mission-badge">MARKET</span>
                        <h3>Global Trend Arbitrage</h3>
                        <p>Identifies working models in mature markets and blueprints their equivalent for your specific target region.</p>
                    </div>
                </div>
                
                <div class="mission-card">
                    <div>
                        <div class="mission-icon">🧹</div>
                        <span class="mission-badge">HEALTH</span>
                        <h3>Security & Debt Janitor</h3>
                        <p>Audits codebases, patches vulnerabilities, and updates legacy dependencies while your core team builds features.</p>
                    </div>
                </div>
                
                <div class="mission-card">
                    <div>
                        <div class="mission-icon">🤝</div>
                        <span class="mission-badge">RETENTION</span>
                        <h3>Proactive Customer Success</h3>
                        <p>Monitors usage data and proactively reaches out to at-risk customers with helpful content to prevent churn.</p>
                    </div>
                </div>
                
                <div class="mission-card">
                    <div>
                        <div class="mission-icon">📣</div>
                        <span class="mission-badge">OUTREACH</span>
                        <h3>Influencer Outreach Engine</h3>
                        <p>Finds matching influencers, manages negotiations, and tracks conversions for high-ROI brand partnerships.</p>
                    </div>
                </div>

                <div class="mission-card">
                    <div>
                        <div class="mission-icon">📊</div>
                        <span class="mission-badge">FINANCE</span>
                        <h3>Stock Intelligence</h3>
                        <p>Your personal AI finance squad — monitoring BSE & NSE every day, so you never miss a move.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="center">
                <h2>⚡ <mark>Smart-Agnostic Routing</mark></h2>
                <p style="font-size: 1.4rem; opacity: 0.7;">The right AI for every task. Automatically.</p>
            </div>
            <div class="brain-section">
                <div style="flex: 1;">
                    <h3>Most AI tools lock you into one model.</h3>
                    <p style="font-size: 1.1rem; line-height: 1.6; opacity: 0.8;">itappens.ai picks the best brain for every single task — balancing quality, speed, and cost in real time.</p>
                    <ul style="list-style: none; padding: 0; margin-top: 30px;">
                        <li style="margin-bottom: 20px;"><strong>Architecture</strong> → Claude Sonnet 3.5</li>
                        <li style="margin-bottom: 20px;"><strong>Marketing Copy</strong> → Claude Haiku</li>
                        <li style="margin-bottom: 20px;"><strong>Research & SEO</strong> → Gemini Flash (Free)</li>
                        <li style="margin-bottom: 20px;"><strong>JSON & APIs</strong> → GPT-4o-mini</li>
                    </ul>
                </div>
                <div class="console">
                    <div class="line c-gray">// Routing Logic Active</div>
                    <div class="line"><span class="c-blue">Dynamic Router:</span> Routing <span class="c-pink">SEO Agent</span> → <span class="c-blue">Gemini Flash</span></div>
                    <div class="line c-gray">Reason: Long context task (24,847 chars), cost-free routing applied</div>
                    <div class="line"></div>
                    <div class="line"><span class="c-blue">Dynamic Router:</span> Routing <span class="c-pink">Content Lead</span> → <span class="c-blue">Claude Haiku</span></div>
                    <div class="line c-gray">Reason: Prose generation, best writing quality per dollar</div>
                    <div class="line"></div>
                    <div class="line"><span class="c-blue">Dynamic Router:</span> Routing <span class="c-pink">Lead Engineer</span> → <span class="c-blue">Claude Sonnet</span></div>
                    <div class="line c-gray">Reason: Mission-critical keyword detected: "Architecture"</div>
                    <div class="line c-green">✓ Network Optimised</div>
                </div>
            </div>
        </section>

        <section class="section">
            <h2 class="center">What Ships in <mark>14 Days</mark></h2>
            <div class="ship-grid">
                <ul class="ship-list">
                    <li style="color: var(--s); font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px;">⚙️ ENGINEERING</li>
                    <li>Full REST API</li>
                    <li>Authentication System</li>
                    <li>Payment Integration</li>
                    <li>React Dashboard</li>
                    <li>Deployed to Production</li>
                    <li>QA tested (8+/10 gate)</li>
                </ul>
                <ul class="ship-list">
                    <li style="color: var(--p); font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px;">📣 MARKETING</li>
                    <li>Landing Page — Live</li>
                    <li>4 SEO Blog Posts published</li>
                    <li>Email Welcome Sequence</li>
                    <li>30 Days of Twitter content</li>
                    <li>50+ Qualified Leads found</li>
                    <li>Outreach sent & followed up</li>
                </ul>
            </div>
            <p class="center" style="margin-top: 40px; opacity: 0.6;">Everything reviewed. Everything approved. Nothing goes live without your tap.</p>
        </section>

        <section class="section">
            <div class="compare-box">
                <div class="compare-item old-way">
                    <h3>❌ Old Way</h3>
                    <div class="price-row"><span>Junior Developer</span> <span style="color: #ff4444;">$5,000/mo</span></div>
                    <div class="price-row"><span>Marketing Manager</span> <span style="color: #ff4444;">$4,500/mo</span></div>
                    <div class="price-row"><span>SEO Specialist</span> <span style="color: #ff4444;">$2,000/mo</span></div>
                    <div class="price-row"><span>Project Manager</span> <span style="color: #ff4444;">$3,500/mo</span></div>
                    <div class="price-row" style="border: none; margin-top: 20px; font-weight: bold;"><span>Total</span> <span>$15,000/mo</span></div>
                </div>
                <div class="compare-item new-way">
                    <h3>✅ itappens.ai</h3>
                    <div class="price-row"><span>2 Engineering Teams</span> <span style="color: #00ff00;">Included</span></div>
                    <div class="price-row"><span>2 Marketing Teams</span> <span style="color: #00ff00;">Included</span></div>
                    <div class="price-row"><span>Sales & Growth Squad</span> <span style="color: #00ff00;">Included</span></div>
                    <div class="price-row"><span>AI CEO + CTO + CPO</span> <span style="color: #00ff00;">Included</span></div>
                    <div class="price-row" style="border: none; margin-top: 20px; font-weight: bold; font-size: 1.5rem;"><span>Total</span> <span>$997/mo</span></div>
                </div>
            </div>
            <p class="center" style="margin-top: 40px; font-size: 1.2rem;">You save <strong>$14,003</strong> every single month.</p>
        </section>

        <section id="how" class="section center">
            <h2>How it <mark>Works</mark></h2>
            <div class="features">
                <div>
                    <h3 style="color: #fff">01 — Type goal</h3>
                    <p>One paragraph in plain English. Your product, what to build, what to launch. That's all we need.</p>
                </div>
                <div>
                    <h3 style="color: #fff">02 — Team works</h3>
                    <p>12 AI specialists spin up in parallel. Router picks the best brain per task. Quality Gate enforces 8+/10.</p>
                </div>
                <div>
                    <h3 style="color: #fff">03 — You approve</h3>
                    <p>Telegram updates every 15 mins. Tap Approve or Reject on every output. Nothing goes live without you.</p>
                </div>
            </div>
        </section>

        <section class="section">
            <h2 class="center">You Stay <mark>In Control</mark></h2>
            <div class="center" style="margin-top: 60px;">
                <div style="background: var(--glass); border: 1px solid var(--border); border-radius: 40px; padding: 60px; max-width: 900px; margin: 0 auto; line-height: 2;">
                    <div style="opacity: 0.5;">Agent completes task</div>
                    <div style="font-size: 2rem; color: var(--s);">↓</div>
                    <div><mark>Quality Gate</mark> scores it. Below 8/10? Auto-redone.</div>
                    <div style="font-size: 2rem; color: var(--s);">↓</div>
                    <div>Telegram sends you a <mark>preview</mark> with full context</div>
                    <div style="font-size: 2rem; color: var(--s);">↓</div>
                    <div style="display: flex; gap: 20px; justify-content: center; margin: 20px 0;">
                        <span style="background: #0088cc; padding: 10px 25px; border-radius: 10px; font-weight: bold;">✅ Approve</span>
                        <span style="background: #ff4444; padding: 10px 25px; border-radius: 10px; font-weight: bold;">❌ Reject</span>
                    </div>
                    <div style="font-size: 2rem; color: var(--s);">↓</div>
                    <div style="font-size: 1.5rem; font-weight:bold;">Only then does it go live.</div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="compare-box">
                <div>
                    <h3>✅ This is for you if:</h3>
                    <p>✓ You have a product idea and no team</p>
                    <p>✓ You're shipping alone and running out of hours</p>
                    <p>✓ You want to move fast without hiring risk</p>
                    <p>✓ You believe in leverage, not labour</p>
                </div>
                <div style="opacity: 0.5;">
                    <h3>❌ NOT for you if:</h3>
                    <p>micromanage every line of code</p>
                    <p>need a human to blame</p>
                    <p>not ready to ship something real</p>
                </div>
            </div>
        </section>

        <section id="pricing" class="section center">
            <h2>Start Your <mark>AI Sprint</mark></h2>
            <div class="pricing">
                <div class="p-card">
                    <h3>STARTER</h3>
                    <div class="p-price">$497<span style="font-size: 1rem; opacity:0.5">/mo</span></div>
                    <ul class="p-features">
                        <li>1 Engineering Team</li>
                        <li>1 Marketing Team</li>
                        <li>Sales Agent</li>
                        <li>Telegram Updates</li>
                        <li>$20/day Budget</li>
                        <li>Dynamic Routing ✓</li>
                    </ul>
                    <button onclick="triggerRazorpay('starter')" class="cta" style="width: 100%; border:none;">Get Started →</button>
                </div>
                <div class="p-card popular">
                    <div style="position: absolute; top: 0; left: 50%; transform: translate(-50%, -50%); background: var(--s); color: #000; padding: 5px 20px; border-radius: 20px; font-weight: bold; font-size: 0.8rem;">MOST POPULAR</div>
                    <h3>GROWTH</h3>
                    <div class="p-price">$997<span style="font-size: 1rem; opacity:0.5">/mo</span></div>
                    <ul class="p-features">
                        <li>2 Engineering Teams</li>
                        <li>2 Marketing Teams</li>
                        <li>Full Sales Squad</li>
                        <li>Telegram + Dashboard</li>
                        <li>$50/day Budget</li>
                        <li>Adaptive Brain ✓</li>
                    </ul>
                    <button onclick="triggerRazorpay('growth')" class="cta" style="width: 100%; border:none;">Get Started →</button>
                </div>
                <div class="p-card">
                    <h3>SCALE</h3>
                    <div class="p-price">$2,497<span style="font-size: 1rem; opacity:0.5">/mo</span></div>
                    <ul class="p-features">
                        <li>4+ Custom Teams</li>
                        <li>White-label Option</li>
                        <li>Weekly Strategy Call</li>
                        <li>Dedicated Support</li>
                        <li>$150/day Budget</li>
                        <li>SLA Guarantee ✓</li>
                    </ul>
                    <button onclick="triggerRazorpay('scale')" class="cta" style="width: 100%; background: #fff; color: #000; border:none;">Talk to Sales →</button>
                </div>
            </div>
            
            <div class="ticker-wrap" style="margin-top: 100px; background: transparent;">
                <div class="ticker">
                    <span>$2.1M saved by customers</span>
                    <span>847 sprints completed</span>
                    <span>4.9★ average rating</span>
                    <span>$7.43 avg daily cost</span>
                    <span>99.2% uptime</span>
                    <!-- Repeat -->
                    <span>$2.1M saved by customers</span>
                    <span>847 sprints completed</span>
                    <span>4.9★ average rating</span>
                    <span>$7.43 avg daily cost</span>
                    <span>99.2% uptime</span>
                </div>
            </div>
        </section>

        <section class="faq">
            <h2 class="center">FAQ</h2>
            <div class="faq-item">
                <h4>What if the AI makes a mistake?</h4>
                <p>Nothing goes live without your approval. Quality Gate blocks anything below 8/10. You always have final say via Telegram.</p>
            </div>
            <div class="faq-item">
                <h4>Which AI does it use?</h4>
                <p>All of them — intelligently. The Dynamic Router picks Claude 3.5 Sonnet for code, Gemini for research, and Llama for status checks.</p>
            </div>
            <div class="faq-item">
                <h4>Is my code and data safe?</h4>
                <p>Your data never trains any AI model. We use AES-256 encryption. If you cancel, all data is deleted within 24 hours.</p>
            </div>
            <div class="faq-item">
                <h4>Can I cancel anytime?</h4>
                <p>Yes. No contracts. No questions asked. You keep everything your team built during the sprints.</p>
            </div>
        </section>

        <section class="section center" id="waitlist">
            <h2>Your competitors are shipping <br><mark>while you sleep.</mark></h2>
            <h3>So is your new AI team.</h3>
            <div class="countdown" id="timer">42 spots remaining</div>
            <a href="#pricing" class="cta" style="margin-top: 40px; padding: 25px 80px;">Start Your Sprint →</a>
            <p style="margin-top: 20px; opacity: 0.5;">First 50 founders get 30% off forever.</p>
            <div style="margin-top: 30px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; max-width: 500px; margin-left: auto; margin-right: auto;">
                <input id="cta-email" type="email" placeholder="your@email.com" style="flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 16px 24px; border-radius: 100px; font-size: 1rem; outline: none; min-width: 220px;">
                <button onclick="joinWaitlist('cta-email','cta')" style="background: linear-gradient(45deg, var(--p), #6600ff); border: none; color: #fff; padding: 16px 32px; border-radius: 100px; cursor: pointer; font-weight: bold; font-size: 1rem; white-space: nowrap;">Reserve My Spot →</button>
            </div>
            <p id="cta-msg" style="margin-top: 12px; font-size: 0.9rem; color: #00ff88; min-height: 20px;"></p>
        </section>

        <footer>
            <div class="logo" style="font-size: 1rem;">itappens.ai</div>
            <div>© 2026 itappens.ai — by blocks and loops technologies</div>
            <div style="display: flex; gap: 20px;">
                <a href="/security" style="color: inherit;">Security</a>
                <a href="#" style="color: inherit;">Twitter</a>
                <a href="#" style="color: inherit;">Terms</a>
            </div>
        </footer>

        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <script>
            async function triggerRazorpay(plan) {
                const email = prompt("Enter your email for onboarding instructions:", "");
                if (!email || !email.includes("@")) return;

                try {
                    const res = await fetch(`/create-order?plan=${plan}&email=${email}`);
                    const order = await res.json();

                    const options = {
                        "key": "RAZORPAY_KEY_PLACEHOLDER",
                        "amount": order.amount,
                        "currency": order.currency,
                        "name": "itappens.ai",
                        "description": `${plan.toUpperCase()} Plan Subscription`,
                        "order_id": order.id,
                        "handler": async function (response) {
                            const verifyRes = await fetch("/verify-payment", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                })
                            });
                            const result = await verifyRes.json();
                            if (result.status === "ok") {
                                window.location.href = `/success?plan=${plan}`;
                            } else {
                                alert("Payment verification failed. Please contact support.");
                            }
                        },
                        "prefill": { "email": email },
                        "theme": { "color": "#ff00ff" }
                    };
                    const rzp1 = new Razorpay(options);
                    rzp1.open();
                } catch (e) {
                    alert("Error initiating payment. Please try again.");
                }
            }

            // Simple Scarcity Countdown
            let spots = 42;
            setInterval(() => {
                if (spots > 3) {
                    spots -= Math.floor(Math.random() * 2);
                    document.getElementById('timer').innerText = spots + ' spots remaining';
                }
            }, 15000);

            // Waitlist signup
            async function joinWaitlist(inputId, source) {
                const input = document.getElementById(inputId);
                const msgId = source === 'hero' ? 'hero-msg' : 'cta-msg';
                const msg = document.getElementById(msgId);
                const email = input.value.trim();
                if (!email || !email.includes('@')) {
                    msg.style.color = '#ff4466';
                    msg.textContent = 'Please enter a valid email.';
                    return;
                }
                msg.style.color = '#888';
                msg.textContent = 'Adding you...';
                try {
                    const res = await fetch('/waitlist', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, source })
                    });
                    const data = await res.json();
                    if (res.ok) {
                        msg.style.color = '#00ff88';
                        msg.textContent = data.newly_added
                            ? "You're on the list. We'll be in touch."
                            : "You're already on the list. See you soon.";
                        input.value = '';
                        if (typeof posthog !== 'undefined') posthog.capture('waitlist_signup', { source });
                    } else {
                        msg.style.color = '#ff4466';
                        msg.textContent = 'Something went wrong. Try again.';
                    }
                } catch(e) {
                    msg.style.color = '#ff4466';
                    msg.textContent = 'Network error. Try again.';
                }
            }
        </script>
    </body>
    </html>
    """
    return html.replace("RAZORPAY_KEY_PLACEHOLDER", rzp_key)

@app.get("/security", response_class=HTMLResponse)
async def security_page():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Security & Trust | itappens.ai</title>
        <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;600&display=swap" rel="stylesheet">
        <style>
            :root { --p: #ff00ff; --s: #00ffff; --bg: #030014; --glass: rgba(255, 255, 255, 0.05); --border: rgba(255, 255, 255, 0.1); }
            * { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-sizing: border-box; }
            body { background: var(--bg); color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; line-height: 1.6; }
            h1, h2, h3, h4, .logo { font-family: 'Unbounded'; }
            .bg-glow { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; background: radial-gradient(circle at 50% 50%, #1a0033 0%, #030014 100%); }
            
            nav { padding: 25px 40px; display: flex; justify-content: space-between; align-items: center; max-width: 1300px; margin: 0 auto; }
            .logo { font-size: 1.5rem; color: #fff; text-decoration: none; font-weight: bold; }
            
            .container { max-width: 1000px; margin: 80px auto; padding: 0 20px; }
            h1 { font-size: 3.5rem; margin-bottom: 20px; }
            h2 { font-size: 2rem; color: var(--s); margin-top: 60px; border-bottom: 1px solid var(--border); padding-bottom: 15px; }
            
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; }
            .card { background: var(--glass); border: 1px solid var(--border); padding: 35px; border-radius: 30px; }
            .card h3 { color: var(--p); margin-top: 0; font-size: 1.2rem; }
            
            .check-list { list-style: none; padding: 0; }
            .check-list li { padding: 12px 0; padding-left: 30px; position: relative; border-bottom: 1px solid rgba(255,255,255,0.05); }
            .check-list li::before { content: '✓'; color: var(--s); position: absolute; left: 0; font-weight: bold; }
            
            .badge { display: inline-block; padding: 5px 15px; border-radius: 20px; background: rgba(0,255,255,0.1); color: var(--s); font-size: 0.8rem; font-weight: bold; margin-bottom: 15px; }
            
            .guarantee-box { background: linear-gradient(45deg, rgba(255,0,255,0.05), rgba(0,255,255,0.05)); border: 2px solid var(--s); padding: 50px; border-radius: 40px; margin-top: 80px; text-align: center; }
            .guarantee-text { font-size: 1.3rem; font-style: italic; color: #eee; max-width: 700px; margin: 0 auto; }
            
            footer { padding: 60px 40px; border-top: 1px solid var(--border); text-align: center; color: #555; }
            mark { background: none; color: var(--s); }
            .back-link { color: var(--s); text-decoration: none; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 30px; }
        </style>
    </head>
    <body>
        <div class="bg-glow"></div>
        <nav>
            <a href="/" class="logo">itappens.ai</a>
            <a href="/" class="back-link">← Back to home</a>
        </nav>

        <div class="container">
            <h1 class="center" style="text-align:center;">Security & <mark>Trust</mark></h1>
            <p class="center" style="font-size: 1.2rem; opacity: 0.7; text-align:center;">How we keep your data safe and your business protected.</p>

            <h2>Part 1: Your Safety</h2>
            <p>Infrastructure protocols for founders running the itappens.ai core.</p>
            
            <div class="grid">
                <div class="card">
                    <div class="badge">LAYER 1 & 2</div>
                    <h3>Environment Isolation</h3>
                    <ul class="check-list">
                        <li><strong>Encrypted Environments</strong>: API keys never leave your secure server</li>
                        <li><strong>Docker Sandboxing</strong>: Agents trapped in isolated containers</li>
                        <li><strong>No Host Access</strong>: Agents cannot touch your server files</li>
                    </ul>
                </div>
                <div class="card">
                    <div class="badge">LAYER 3 & 4</div>
                    <h3>Execution Guardrails</h3>
                    <ul class="check-list">
                        <li><strong>Code Blocklist</strong>: rm, delete, DROP TABLE blocked at system level</li>
                        <li><strong>Budget Kill Switch</strong>: Automatic stop at daily limit</li>
                        <li><strong>Manual Gates</strong>: AUTO_SEND=false by default</li>
                    </ul>
                </div>
            </div>

            <div class="card" style="margin-top: 40px;">
                <h3>🛡️ Safe Rollout Strategy</h3>
                <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 20px;">
                    <div style="font-size: 0.8rem; opacity: 0.6;"><strong>WEEK 1</strong><br>Dry Run only. Watch agents work.</div>
                    <div style="font-size: 0.8rem; opacity: 0.6;"><strong>WEEK 2</strong><br>Manual approval for every action.</div>
                    <div style="font-size: 0.8rem; opacity: 0.6;"><strong>WEEK 3</strong><br>Deploy to Cloud (Render) isolation.</div>
                    <div style="font-size: 0.8rem; opacity: 1; color: var(--s);"><strong>WEEK 4</strong><br>Trust established. Autopilot active.</div>
                </div>
            </div>

            <h2>Part 2: Customer Guarantees</h2>
            <p>The 6 pillars of trust we build into every customer interaction.</p>

            <div class="grid">
                <div class="card">
                    <h3>1. Total Control</h3>
                    <p>Nothing goes live without approval. No code commits, emails, or posts without an explicit tap in Telegram.</p>
                </div>
                <div class="card">
                    <h3>2. Privacy First</h3>
                    <p>Customer data never trains any AI model. Not ours, not Anthropic's, not anyone's.</p>
                </div>
                <div class="card">
                    <h3>3. Deep Isolation</h3>
                    <p>Every customer is isolated in their own container. Zero data crossover possible.</p>
                </div>
                <div class="card">
                    <h3>4. Cost Certainty</h3>
                    <p>Hard daily budget limits they control. No surprise bills. Agents stop when the limit is reached.</p>
                </div>
                <div class="card">
                    <h3>5. Full Audit Log</h3>
                    <p>Every agent action is timestamped and recorded. Every draft and code snippet is visible.</p>
                </div>
                <div class="card">
                    <h3>6. Instant Erasure</h3>
                    <p>Cancel and delete everything instantly. All data wiped within 24 hours of cancellation.</p>
                </div>
            </div>

            <h2 style="margin-top: 100px;">What We <mark>NEVER</mark> Do</h2>
            <div class="grid" style="grid-template-columns: 1fr 1fr 1fr;">
                <div style="padding: 20px;">
                    <h4 style="color: #ff4444;">✕ NO Direct Main</h4>
                    <p style="font-size: 0.8rem;">Staging branch only. Customer merges manually.</p>
                </div>
                <div style="padding: 20px;">
                    <h4 style="color: #ff4444;">✕ NO Blind Sends</h4>
                    <p style="font-size: 0.8rem;">Every email/post shown in Telegram first.</p>
                </div>
                <div style="padding: 20px;">
                    <h4 style="color: #ff4444;">✕ NO Host Files</h4>
                    <p style="font-size: 0.8rem;">Restricted to /app/workspace only.</p>
                </div>
            </div>

            <div class="guarantee-box">
                <div class="logo" style="font-size: 1.2rem; margin-bottom: 25px;">The Founder Guarantee</div>
                <p class="guarantee-text">
                    "If itappens.ai ever damages your business — sends a bad email, commits broken code, or posts something embarrassing — I will personally reach out, fix it, and refund that month. No questions asked. You have my email. Use it."
                </p>
                <div style="margin-top: 30px; font-weight: bold; color: var(--s);">— Blocks and loops technologies private limited</div>
            </div>
        </div>

        <footer>
            © 2026 itappens.ai — by blocks and loops technologies
        </footer>
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
        
        # 🔔 INTERACTIVE: Wait for Telegram approval
        approved = await telegram.ask_budget_approval(points)
        if approved:
            mission_store.approve_mission(mission_id)
            await run_approved_mission(mission_id)
        else:
            logger.info(f"Mission {mission_id} cancelled or ignored on Telegram.")

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


# ── Razorpay Billing Routes ────────────────────────────────────────────────────

@app.get("/create-order")
async def create_order(plan_slug: str = "growth", email: str = ""):
    """Create a Razorpay order for the frontend."""
    try:
        order = create_razorpay_order(plan_slug=plan_slug, customer_email=email)
        return order
    except Exception as exc:
        logger.error("Razorpay order error: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))

@app.post("/verify-payment")
async def razorpay_verify(req: RazorpayVerifyRequest):
    """Verify Razorpay payment signature."""
    try:
        success = verify_payment(
            razorpay_order_id=req.razorpay_order_id,
            razorpay_payment_id=req.razorpay_payment_id,
            razorpay_signature=req.razorpay_signature
        )
        if success:
            return {"status": "ok"}
        else:
            raise HTTPException(status_code=400, detail="Invalid signature")
    except Exception as exc:
        logger.error("Razorpay verification error: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))


# ── Lead Capture Route ────────────────────────────────────────────────────────

class WaitlistRequest(BaseModel):
    email: str
    source: str = "landing"

@app.post("/waitlist")
async def join_waitlist(req: WaitlistRequest):
    """Save email to waitlist and optionally send confirmation."""
    email = req.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=422, detail="Invalid email address")

    newly_added = add_to_waitlist(email=email, source=req.source)

    # Best-effort Gmail confirmation — never block response on email failure
    if newly_added:
        try:
            from tools.gmail_tool import gmail_send_tool
            gmail_send_tool._run(
                to=email,
                subject="You're in — itappens.ai is coming for you",
                body=(
                    "Hey,\n\n"
                    "You're on the list. We're giving early access to a small group of founders first.\n\n"
                    "When you get in, you'll have 12 AI specialists — engineers, marketers, salespeople — "
                    "shipping work for your startup while you sleep.\n\n"
                    "No hiring. No management. Just tap Approve on Telegram.\n\n"
                    "We'll be in touch shortly.\n\n"
                    "— The itappens.ai team"
                ),
            )
        except Exception as exc:
            logger.warning("Waitlist confirmation email failed: %s", exc)

    return {"status": "ok", "newly_added": newly_added}


@app.get("/success", response_class=HTMLResponse)
async def checkout_success(plan: str = "growth", session_id: str = ""):
    """Post-payment success page shown after Stripe checkout."""
    plan_display = {"starter": "Starter — $497/mo", "growth": "Growth — $997/mo", "scale": "Scale — $2,497/mo"}.get(plan, plan)
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to itappens.ai!</title>
        <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;600&display=swap" rel="stylesheet">
        <style>
            :root {{ --p: #ff00ff; --s: #00ffff; --bg: #030014; }}
            body {{ background: var(--bg); color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center; padding: 40px; }}
            h1, h2 {{ font-family: 'Unbounded'; }}
            .card {{ background: rgba(255,255,255,0.05); border: 1px solid rgba(0,255,255,0.3); border-radius: 40px; padding: 80px 60px; max-width: 700px; }}
            .check {{ font-size: 5rem; }}
            mark {{ background: none; color: var(--s); }}
            .cta {{ display: inline-block; background: linear-gradient(45deg, var(--p), #6600ff); color: #fff; padding: 18px 50px; border-radius: 100px; text-decoration: none; font-weight: bold; margin-top: 40px; }}
            p {{ color: #aaa; font-size: 1.1rem; line-height: 1.7; }}
        </style>
    </head>
    <body>
        <div class="card">
            <div class="check">🎉</div>
            <h1>You're <mark>in.</mark></h1>
            <h2 style="opacity:0.7; font-size:1.2rem">{plan_display}</h2>
            <p>Your AI team is being assembled. Check your email for onboarding instructions.<br>
            Launch your first sprint from the dashboard — your team is ready when you are.</p>
            <a href="/dashboard" class="cta">Launch Your Team →</a>
        </div>
    </body>
    </html>
    """


# ── Entry point ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    try:
        port = int(os.getenv("PORT", "10000"))
        logger.info("FINAL STAGE: Launching FastAPI server on port %d...", port)
        uvicorn.run(app, host="0.0.0.0", port=port)
    except Exception as e:
        logger.critical("FATAL CRASH DURING SERVER INITIALIZATION: %s", e, exc_info=True)
        sys.exit(1)
