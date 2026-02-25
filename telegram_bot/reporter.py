"""
telegram_bot/reporter.py
────────────────────────
Unified 30-minute Telegram update system.
Runs via APScheduler — sends a comprehensive status report every 30 minutes.
Now supports Real-time Agent Chatter and Human-in-the-Loop (HITL) questions.
"""

import asyncio
import logging
import os
from datetime import datetime

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from telegram import Bot, InlineKeyboardButton, InlineKeyboardMarkup, Update
from telegram.ext import Application, CallbackQueryHandler, MessageHandler, filters, ContextTypes
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)


class TelegramReporter:
    """
    Sends 30-minute sprint updates to Telegram.
    Supports inline buttons for approving outputs and real-time agent thoughts.

    Usage:
        reporter = TelegramReporter(sprint_board, cost_tracker)
        reporter.start_scheduler()         # begins 30-min loop
        reporter.start_polling()           # begins HITL listener
    """

    def __init__(self, sprint_board=None, cost_tracker=None):
        self._token = os.getenv("TELEGRAM_BOT_TOKEN", "")
        self._chat_id = os.getenv("TELEGRAM_CHAT_ID", "")
        self._sprint_board = sprint_board
        self._cost_tracker = cost_tracker
        self._bot = Bot(token=self._token) if self._token else None
        self._scheduler = AsyncIOScheduler()
        self._pending_questions = {} # {agent_name: Future}

    def start_polling(self) -> None:
        """Start a persistent Telegram listener in the background."""
        if not self._token: return
        
        # We use a separate application for polling to avoid conflicts with send_now
        app = Application.builder().token(self._token).build()
        
        async def on_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if not update.message or str(update.effective_chat.id) != self._chat_id:
                return
            
            text = update.message.text
            # If we have any pending questions, resolve them
            found = False
            for agent_name in list(self._pending_questions.keys()):
                future = self._pending_questions[agent_name]
                if not future.done():
                    future.set_result(text)
                    await update.message.reply_text(f"✅ Message sent to *{agent_name}*.")
                    found = True
                    break
            
            if not found:
                await update.message.reply_text("I heard you, but no agents are currently waiting for your input.")
        
        app.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), on_message))
        
        # Start the application in a background task
        loop = asyncio.get_event_loop()
        loop.create_task(app.initialize())
        loop.create_task(app.start())
        loop.create_task(app.updater.start_polling())
        
        logger.info("Telegram polling started — you can now 'talk' to agents.")

    async def ask_human_link(self, agent_name: str, question: str) -> str:
        """Send a question and WAIT for the user to type a reply in Telegram."""
        if not self._bot or not self._chat_id:
            return "Human not reachable (Telegram not configured)."
        
        await self._send_async(f"❓ *{agent_name} is asking you:* \n\n{question}\n\n_(Please type your reply below)_")
        
        loop = asyncio.get_event_loop()
        future = loop.create_future()
        self._pending_questions[agent_name] = future
        
        try:
            # Wait for answer (timeout 10 mins)
            answer = await asyncio.wait_for(future, timeout=600.0)
            return answer
        except asyncio.TimeoutError:
            return "No response from human after 10 minutes."
        finally:
            self._pending_questions.pop(agent_name, None)


    # ── Scheduler ────────────────────────────────────────────────────────────

    def start_scheduler(self) -> None:
        """Start the 30-minute update scheduler."""
        self._scheduler.add_job(
            self._send_update,
            trigger="interval",
            minutes=30,
            id="telegram_30min",
            replace_existing=True,
        )
        if not self._scheduler.running:
            self._scheduler.start()
        logger.info("Telegram scheduler started — updates every 30 minutes.")

    def stop_scheduler(self) -> None:
        """Stop the scheduler gracefully."""
        if self._scheduler.running:
            self._scheduler.shutdown(wait=False)

    # ── Send helpers ─────────────────────────────────────────────────────────

    def send_now(self, message: str) -> None:
        """
        Send a message immediately (synchronous helper).
        Safe to call from non-async context.
        """
        if not self._bot or not self._chat_id:
            logger.warning("Telegram not configured — skipping message.")
            return
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                asyncio.ensure_future(self._send_async(message))
            else:
                loop.run_until_complete(self._send_async(message))
        except Exception as exc:
            logger.error("Telegram send_now failed: %s", exc)

    async def _send_async(self, message: str, reply_markup=None) -> None:
        """Send a Telegram message asynchronously."""
        if not self._bot or not self._chat_id:
            return
        try:
            await self._bot.send_message(
                chat_id=self._chat_id,
                text=message[:4096],  # Telegram limit
                parse_mode="Markdown",
                reply_markup=reply_markup,
            )
        except Exception as exc:
            logger.error("Telegram async send failed: %s", exc)

    # ── 30-minute update ─────────────────────────────────────────────────────

    async def _send_update(self) -> None:
        """Build and send the unified 30-minute status update."""
        now = datetime.utcnow().strftime("%H:%M UTC")
        lines = [f"*🤖 itappens.ai — {now}*", ""]

        # Sprint board summary
        if self._sprint_board:
            lines.append(self._sprint_board.generate_summary())
        else:
            lines.append("_Sprint board not connected._")

        lines.append("")

        # Cost report
        if self._cost_tracker:
            lines.append(self._cost_tracker.telegram_cost_block())
        else:
            lines.append("_Cost tracker not connected._")

        lines.append("")
        lines.append("_Next update in 30 min | Dashboard: itappens.ai/dashboard_")

        message = "\n".join(lines)
        await self._send_async(message)

    def send_thought(self, agent_role: str, thought: str) -> None:
        """Send a real-time 'thought' or action from an agent to Telegram."""
        # Clean the thought to show key actions
        if "Action:" in thought or "Delegating" in thought or "Action Input" in thought:
            icon = "🧠" if "Action:" in thought else "💬"
            # Extract first line for brevity
            clean_thought = thought.split("\n")[0].replace("Action:", "").replace("Action Input:", "").strip()
            if not clean_thought: return
            
            msg = f"{icon} *{agent_role}*: _{clean_thought[:200]}_"
            self.send_now(msg)


    # ── Hot lead alert ───────────────────────────────────────────────────────

    async def send_hot_lead_alert(
        self,
        lead_name: str,
        platform: str,
        original_post: str,
        their_reply: str,
        draft_reply: str,
        lead_username: str = "",
    ) -> None:
        """
        Send a hot lead alert with inline [✅ Send Draft] [✏️ Edit] [📞 I'll Handle] buttons.
        """
        text = (
            f"🔥 *HOT LEAD — {platform}*\n\n"
            f"*Lead:* {lead_name} (@{lead_username})\n"
            f"*Their post:* {original_post[:200]}\n"
            f"*Their reply:* {their_reply[:200]}\n\n"
            f"*Draft reply:*\n_{draft_reply[:300]}_"
        )
        keyboard = InlineKeyboardMarkup([
            [
                InlineKeyboardButton("✅ Send Draft", callback_data=f"send_draft:{lead_username}"),
                InlineKeyboardButton("✏️ Edit First", callback_data=f"edit_draft:{lead_username}"),
                InlineKeyboardButton("📞 I'll Handle It", callback_data=f"human_handle:{lead_username}"),
            ]
        ])
        await self._send_async(text, reply_markup=keyboard)

    # ── Output approval alert ────────────────────────────────────────────────
    async def send_output_approval(
        self,
        output_id: str,
        output_type: str,
        preview: str,
        quality_score: int,
    ) -> None:
        """
        Send an output approval request with [Approve] [Reject] buttons.
        """
        text = (
            f"📋 *Output Review Required*\n\n"
            f"Type: {output_type}\n"
            f"Quality Score: {quality_score}/10\n\n"
            f"Preview:\n`{preview[:300]}`"
        )
        keyboard = InlineKeyboardMarkup([
            [
                InlineKeyboardButton("✅ Approve", callback_data=f"approve:{output_id}"),
                InlineKeyboardButton("❌ Reject", callback_data=f"reject:{output_id}"),
            ]
        ])
        await self._send_async(text, reply_markup=keyboard)

    # ── Startup / completion messages ────────────────────────────────────────

    def send_startup(self, goal: str, customer_id: str, num_eng: int, num_mkt: int) -> None:
        """Send a startup notification when a new company run begins."""
        msg = (
            f"🚀 *itappens.ai STARTING*\n\n"
            f"Customer: `{customer_id}`\n"
            f"Goal: {goal[:200]}\n"
            f"Teams: {num_eng} Engineering + {num_mkt} Marketing\n"
            f"Time: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}"
        )
        self.send_now(msg)

    def send_completion(self, customer_id: str, summary: str) -> None:
        """Send a completion report when all teams finish."""
        msg = (
            f"✅ *Sprint Complete* — `{customer_id}`\n\n"
            f"{summary[:600]}"
        )
        self.send_now(msg)
