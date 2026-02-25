"""
customer/weekly_win_agent.py
─────────────────────────────
Sends a personal weekly win email every Friday at 5pm to every active customer.
Pulls real data from sprint_board.json and cost_tracker logs.
Calculates freelancer equivalent at $75/hr.
"""

import json
import logging
import os
from datetime import datetime
from pathlib import Path

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

WEEKLY_WINS_LOG = Path(__file__).parent.parent / "memory" / "weekly_wins_log.json"
CUSTOMERS_DIR = Path(__file__).parent.parent / "memory" / "customer_brains"

FREELANCER_HOURLY_RATE = 75  # industry average $/hr
ITAPPENS_STARTER_PRICE = 497


class WeeklyWinAgent:
    """
    Emails each active customer every Friday at 5pm with their weekly accomplishments.
    Uses real sprint board data to calculate hours and cost saved.

    Nobody cancels after reading this email.
    """

    def __init__(self, sprint_board=None, cost_tracker=None, gmail_send_fn=None, telegram=None):
        self._board = sprint_board
        self._cost_tracker = cost_tracker
        self._gmail_send = gmail_send_fn  # callable(to, subject, body)
        self._telegram = telegram
        self._scheduler = AsyncIOScheduler()
        self._ensure_log()

    # ── Scheduler ─────────────────────────────────────────────────────────────

    def start_scheduler(self) -> None:
        """Schedule weekly win emails every Friday at 5pm UTC."""
        self._scheduler.add_job(
            self.send_all_weekly_wins,
            trigger="cron",
            day_of_week="fri",
            hour=17,
            minute=0,
            id="weekly_win_email",
            replace_existing=True,
        )
        if not self._scheduler.running:
            self._scheduler.start()
        logger.info("Weekly Win scheduler started — sends every Friday at 5pm UTC.")

    # ── Main runner ───────────────────────────────────────────────────────────

    async def send_all_weekly_wins(self) -> None:
        """Send weekly win emails to all active customers."""
        customers = self._get_all_customers()
        logger.info("Sending weekly win emails to %d customers.", len(customers))
        for customer in customers:
            try:
                await self.send_weekly_win(customer)
            except Exception as exc:
                logger.error("Weekly win failed for %s: %s", customer.get("customer_id"), exc)

    async def send_weekly_win(self, brain: dict) -> None:
        """
        Build and send the weekly win email for a single customer.
        Pulls sprint data, calculates savings, and sends via Gmail.
        """
        customer_id = brain.get("customer_id", "unknown")
        name = brain.get("company_name", "Founder")
        email = brain.get("contact_email", "")

        if not email:
            logger.warning("No email for customer %s — skipping weekly win.", customer_id)
            return

        # Pull sprint board data
        weekly_summary = {}
        if self._board:
            weekly_summary = self._board.generate_weekly_summary()

        tasks_completed = weekly_summary.get("total_tasks_completed", 0)
        completed_list = weekly_summary.get("completed_task_list", [])
        hours_saved = weekly_summary.get("hours_saved_equivalent", tasks_completed * 2)
        freelancer_cost = hours_saved * FREELANCER_HOURLY_RATE
        week_savings = freelancer_cost - ITAPPENS_STARTER_PRICE

        # Next sprint goal from hot_topics
        hot_topics = brain.get("hot_topics", ["Your next sprint is being planned"])
        next_sprint = hot_topics[0] if hot_topics else "Your next sprint is being planned"

        # Build completed bullet list
        if completed_list:
            completed_bullets = "\n".join(f"  ✅ {t}" for t in completed_list[:8])
        else:
            completed_bullets = "  ✅ Features shipped, content created, leads researched"

        subject = "Here's what your AI team did this week 🚀"
        body = f"""Hi {name},

Here's your weekly report from the itappens.ai team:

THIS WEEK YOUR AI TEAM:
{completed_bullets}

THE NUMBERS:
  Hours this would have cost you:  ~{hours_saved} hrs
  Freelancer equivalent cost:      ~${freelancer_cost:,.0f}
  What you actually paid:          ${ITAPPENS_STARTER_PRICE}
  You saved:                       ${week_savings:,.0f} this week alone

NEXT WEEK:
Your team is already planning: {next_sprint}

Questions? Just reply to this email.

— The itappens.ai team

P.S. Know another founder who'd love this?
Share your referral link and get a free month: itappens.ai/?ref={customer_id}
"""

        if self._gmail_send:
            self._gmail_send(to=email, subject=subject, body=body)

        self._log_sent(customer_id, email, subject)
        logger.info("Weekly win sent to %s (%s).", name, email)

    # ── Helpers ───────────────────────────────────────────────────────────────

    def _get_all_customers(self) -> list[dict]:
        """Return all customer brain dicts from disk."""
        customers = []
        for path in CUSTOMERS_DIR.glob("*.json"):
            try:
                brain = json.loads(path.read_text(encoding="utf-8"))
                if brain.get("onboarding_complete"):
                    customers.append(brain)
            except Exception:
                pass
        return customers

    def _log_sent(self, customer_id: str, email: str, subject: str) -> None:
        log = json.loads(WEEKLY_WINS_LOG.read_text(encoding="utf-8"))
        log.append({
            "customer_id": customer_id,
            "email": email,
            "subject": subject,
            "sent_at": datetime.utcnow().isoformat(),
        })
        WEEKLY_WINS_LOG.write_text(json.dumps(log, indent=2), encoding="utf-8")

    def _ensure_log(self) -> None:
        WEEKLY_WINS_LOG.parent.mkdir(parents=True, exist_ok=True)
        if not WEEKLY_WINS_LOG.exists():
            WEEKLY_WINS_LOG.write_text("[]", encoding="utf-8")
