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
from telegram.ext import Application, CallbackQueryHandler, MessageHandler, filters, ContextTypes, CommandHandler
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
        self._temp_choices = []

    def start_polling(self) -> None:
        """Start a persistent Telegram listener in the background."""
        if not self._token: return
        
        # Avoid shadowing the global 'app' from main
        from main import mission_store, plan_mission_logic
        
        # Build the bot application
        bot_app = Application.builder().token(self._token).build()
        
        async def on_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if not update.message or str(update.effective_chat.id) != self._chat_id:
                return
            
            text = update.message.text
            # If we have any pending questions, resolve them
            found = False
            for agent_name in list(self._pending_questions.keys()):
                # Special handling for budget approval to allow natural follow-up questions
                if agent_name == "BudgetAgent":
                    text_lower = text.lower()
                    if "approve" in text_lower or "cancel" in text_lower:
                        future = self._pending_questions[agent_name]
                        if not future.done():
                            future.set_result(text)
                            return
                    else:
                        # User asked a question or sent a non-approval message
                        await update.message.reply_text("👋 I hear you! If you have a question about the plan, I'll pass it to the team after launch. For now, please *Approve* the budget to start the work.", parse_mode="Markdown")
                        return

                future = self._pending_questions[agent_name]
                if not future.done():
                    future.set_result(text)
                    await update.message.reply_text(f"✅ Message sent to *{agent_name}*.", parse_mode="Markdown")
                    found = True
                    break
            
            if not found:
                await update.message.reply_text("I heard you, but no agents are currently waiting for your input. Type /help for commands.")

        async def launch_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
            """Usage: /launch [Goal]"""
            if str(update.effective_chat.id) != self._chat_id: return
            goal = " ".join(context.args)
            if not goal:
                await update.message.reply_text("❌ Please provide a goal. Usage: `/launch My New SaaS Goal`", parse_mode="Markdown")
                return
            customer_id = f"tg_{update.effective_user.id}"
            await update.message.reply_text(f"🚀 *Initializing Collective Core...*\nGoal: _{goal}_", parse_mode="Markdown")
            mission_id = mission_store.create_mission(customer_id, goal)
            asyncio.create_task(plan_mission_logic(mission_id))
            await update.message.reply_text(f"🤖 Zenith is now planning your mission. I will ping you for approval shortly.")

        async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if str(update.effective_chat.id) != self._chat_id: return
            help_text = (
                "🛸 *itappens.ai | Control Center*\n\n"
                "Available Commands:\n"
                "• `/launch [goal]` - Start a new AI mission\n"
                "• `/status` - View current active teams and activity\n"
                "• `/history` - See last 5 completed jobs\n"
                "• `/tokens` - Detailed token spend report\n"
                "• `/stream` - Launch a predefined automation stream\n"
                "• `Approve` / `Reject` - Budget & Output control\n\n"
                "You can also ask me anything about the current state!"
            )
            await update.message.reply_text(help_text, parse_mode="Markdown")

        async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if str(update.effective_chat.id) != self._chat_id: return
            msg = self._sprint_board.generate_summary() if self._sprint_board else "Board not connected."
            
            # Add last 3 activity items
            from dashboard.api.main import ACTIVITY_LOG_PATH, _read_json
            activity = _read_json(ACTIVITY_LOG_PATH, [])
            if activity:
                msg += "\n\n*Recent Activity:*\n"
                for item in activity[-3:][::-1]:
                    msg += f"• `{item['agent']}`: {item['action']} - _{item['thought'][:100]}..._\n"
            
            await update.message.reply_text(msg, parse_mode="Markdown")

        async def history_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if str(update.effective_chat.id) != self._chat_id: return
            from dashboard.api.main import JOB_HISTORY_PATH, _read_json
            history = _read_json(JOB_HISTORY_PATH, [])
            if not history:
                await update.message.reply_text("No history found.")
                return
            
            msg = "*🕰️ Job History (Last 5)*\n\n"
            for job in history[-5:][::-1]:
                msg += f"✅ *{job['team_id']}* ({job['type']})\n_{job['goal']}_\n\n"
            
            await update.message.reply_text(msg, parse_mode="Markdown")

        async def tokens_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if str(update.effective_chat.id) != self._chat_id: return
            if not self._cost_tracker:
                await update.message.reply_text("Cost tracker not connected.")
                return
            
            msg = self._cost_tracker.telegram_cost_block()
            
            # Add detailed agent breakdown for today
            from cost.cost_tracker import COST_LOG_PATH
            import json
            from datetime import date
            today = date.today().isoformat()
            try:
                log = json.loads(COST_LOG_PATH.read_text(encoding="utf-8"))
                today_entries = [e for e in log if e["date"] == today]
                
                # Group by agent and task type
                breakdown = {}
                for e in today_entries:
                    key = (e["agent"], e.get("task", "General"))
                    breakdown[key] = breakdown.get(key, 0) + e["cost_usd"]
                
                msg += "\n\n*Task Breakdown:*\n"
                # Top 5 tasks by cost
                sorted_tasks = sorted(breakdown.items(), key=lambda x: x[1], reverse=True)[:5]
                for (agent, task), cost in sorted_tasks:
                    msg += f"• *{agent}* ({task[:20]}): `${cost:.4f}`\n"
            except: pass
            
            await update.message.reply_text(msg, parse_mode="Markdown")

        async def stream_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if str(update.effective_chat.id) != self._chat_id: return
            from orchestration.streams import STREAMS
            
            keyboard = []
            for name, info in STREAMS.items():
                keyboard.append([InlineKeyboardButton(f"🚀 {name.capitalize()}", callback_data=f"launch_stream:{name}")])
            
            reply_markup = InlineKeyboardMarkup(keyboard)
            await update.message.reply_text("🌊 *Select an Automation Stream to Launch:*", reply_markup=reply_markup, parse_mode="Markdown")

        # Add handlers to OUR bot_app instance
        bot_app.add_handler(CommandHandler("launch", launch_command))
        bot_app.add_handler(CommandHandler("help", help_command))
        bot_app.add_handler(CommandHandler("status", status_command))
        bot_app.add_handler(CommandHandler("history", history_command))
        bot_app.add_handler(CommandHandler("tokens", tokens_command))
        bot_app.add_handler(CommandHandler("stream", stream_command))
        bot_app.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), on_message))
        bot_app.add_handler(CallbackQueryHandler(self._on_button_click))
        
        async def bootstrap():
            try:
                await bot_app.initialize()
                await bot_app.start()
                if bot_app.updater:
                    await bot_app.updater.start_polling()
                logger.info("Telegram Bot listener is now active.")
            except Exception as e:
                logger.error("Failed to start Telegram polling: %s", e)

        # Non-blocking background launch
        asyncio.create_task(bootstrap())

    async def ask_budget_approval(self, points: int) -> bool:
        """Present a budget estimate with interactive buttons."""
        from telegram import InlineKeyboardButton, InlineKeyboardMarkup
        
        cost_usd = points / 10.0
        keyboard = [
            [
                InlineKeyboardButton("✅ Approve", callback_data=f"approve:{points}"),
                InlineKeyboardButton("❌ Cancel", callback_data=f"cancel:mission")
            ]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        msg = (
            f"💰 *Budget Request Form*\n\n"
            f"Zenith has estimated this sprint will cost:\n"
            f"📊 *{points} Points* (~${cost_usd:.2f} USD)\n\n"
            f"Click below to approve or type *Approve* manually."
        )
        await self._send_async(msg, reply_markup=reply_markup)
        
        # We reuse the same pending questions logic but for 'BudgetAgent'
        loop = asyncio.get_event_loop()
        future = loop.create_future()
        self._pending_questions["BudgetAgent"] = future
        
        try:
            # Short timeout for budget approval: 5 mins
            answer = await asyncio.wait_for(future, timeout=300.0)
            return "approve" in answer.lower().strip()
        except asyncio.TimeoutError:
            await self._send_async("🛑 Budget approval timed out. Mission cancelled.")
            return False
        finally:
            self._pending_questions.pop("BudgetAgent", None)

    async def present_choices(self, agent_name: str, title: str, choices: list[str]) -> str:
        """Present a list of choices as buttons and wait for the user to select one."""
        from telegram import InlineKeyboardButton, InlineKeyboardMarkup
        
        if not self._bot or not self._chat_id:
            return "Human not reachable (Telegram not configured)."

        keyboard = []
        # Create a button for each choice. Limit choice text to 30 chars for UI.
        for i, choice in enumerate(choices[:8]):  # Max 8 choices to keep it clean
            btn_text = f"{i+1}. {choice[:27]}..." if len(choice) > 30 else f"{i+1}. {choice}"
            # Format: 'pick:{index}' to avoid long callback data
            keyboard.append([InlineKeyboardButton(btn_text, callback_data=f"pick:{i}")])
        
        reply_markup = InlineKeyboardMarkup(keyboard)
        msg = f"🧐 *{agent_name} found {len(choices)} options:*\n{title}\n\n_Please select which one the team should focus on:_"
        
        await self._send_async(msg, reply_markup=reply_markup)
        
        # We store the full choices list in a temporary memory so we can retrieve it on callback
        self._temp_choices = choices
        
        loop = asyncio.get_event_loop()
        future = loop.create_future()
        self._pending_questions["ChoiceAgent"] = future
        
        try:
            # Wait for choice (timeout 10 mins)
            index_str = await asyncio.wait_for(future, timeout=600.0)
            index = int(index_str)
            if 0 <= index < len(choices):
                return choices[index]
            return choices[0] # Fallback
        except (asyncio.TimeoutError, ValueError):
            return "No choice selected (timeout or error)."
        finally:
            self._pending_questions.pop("ChoiceAgent", None)
            self._temp_choices = []

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

    async def _on_button_click(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle button clicks for lead processing, output approval, and budget."""
        query = update.callback_query
        await query.answer()

        data = query.data
        if ":" not in data: return
        action, target = data.split(":", 1)

        if action == "approve":
            # Resolve budget approval if waiting
            if "BudgetAgent" in self._pending_questions:
                self._pending_questions["BudgetAgent"].set_result("Approve")
                await query.edit_message_text(text=f"✅ *Budget Approved:* Mission starting now...", parse_mode="Markdown")
            else:
                await query.edit_message_text(text=f"✅ *Approved:* Output `{target}` has been delivered to customer.", parse_mode="Markdown")
        
        elif action == "reject":
            await query.edit_message_text(text=f"❌ *Rejected:* Output `{target}` was sent back for revision.", parse_mode="Markdown")
        
        elif action == "pick":
            if "ChoiceAgent" in self._pending_questions:
                idx = int(target)
                choice_text = self._temp_choices[idx] if 0 <= idx < len(self._temp_choices) else "Unknown"
                self._pending_questions["ChoiceAgent"].set_result(target)
                await query.edit_message_text(text=f"🎯 *Selection Made:* `{choice_text}`\nTeam is proceeding with this option.", parse_mode="Markdown")
        
        elif action == "cancel":
            if "BudgetAgent" in self._pending_questions:
                self._pending_questions["BudgetAgent"].set_result("Cancel")
            await query.edit_message_text(text=f"❌ *Cancelled:* Mission aborted.", parse_mode="Markdown")
        
        elif action == "send_draft":
            await query.edit_message_text(text=f"✅ *Success:* Response sent to @{target} on the original platform.", parse_mode="Markdown")
        
        elif action == "human_handle":
            await query.edit_message_text(text=f"📞 *Handed Over:* You are now handling @{target} manually.", parse_mode="Markdown")

        elif action == "launch_stream":
            from orchestration.streams import STREAMS
            from main import mission_store, plan_mission_logic
            stream_info = STREAMS.get(target)
            if stream_info:
                customer_id = f"tg_{query.from_user.id}"
                goal = stream_info["goal"]
                await query.edit_message_text(text=f"🌊 *Launching {target.capitalize()} Stream...*\nGoal: _{goal[:100]}..._", parse_mode="Markdown")
                mission_id = mission_store.create_mission(customer_id, goal)
                asyncio.create_task(plan_mission_logic(mission_id))
            else:
                await query.edit_message_text(text="❌ Stream not found.")

    async def send_status_now(self):
        """Immediately send a status update to the user."""
        await self._send_update()

    def send_now(self, message: str) -> None:
        """
        Send a message immediately (synchronous helper).
        Safe to call from non-async context.
        """
        if not self._bot or not self._chat_id:
            logger.warning("Telegram not configured — skipping message.")
            return
        try:
            # We check if we are already in an event loop
            try:
                loop = asyncio.get_running_loop()
                loop.create_task(self._send_async(message))
            except RuntimeError:
                # No running loop, use run() or new loop
                asyncio.run(self._send_async(message))
        except Exception as exc:
            logger.error("Telegram send_now failed: %s", exc)

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
