import os
import asyncio
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, CallbackQueryHandler, ContextTypes
from telegram.error import Conflict
from dotenv import load_dotenv

load_dotenv()

class TelegramHandler:
    def __init__(self):
        self.token = os.getenv("TELEGRAM_BOT_TOKEN")
        self.chat_id = os.getenv("TELEGRAM_CHAT_ID")
        self.portfolio_channel_id = os.getenv("TELEGRAM_PORTFOLIO_CHANNEL_ID")
        # Increasing timeouts for better cloud stability
        self.app = (
            ApplicationBuilder()
            .token(self.token)
            .read_timeout(30)
            .connect_timeout(30)
            .build()
        )

    async def send_to_portfolio(self, content: dict, label: str = "Portfolio Insight"):
        """Broadcasts approved content to the public portfolio channel."""
        if not self.portfolio_channel_id:
            print("Portfolio Channel ID not set. Skipping broadcast.")
            return

        image_url = content.get("image_url")
        # Use the agency version or personal depending on the context, 
        # but usually, for a showroom, we show the high-value personal insight.
        body = content.get('linkedin_personal', '')
        
        broadcast_text = (
            f"🌟 <b>Portfolio Spotlight: {label}</b>\n\n"
            f"{body}\n\n"
            f"<i>Generated & Scheduled by itappens.ai</i>"
        )

        try:
            if image_url:
                await self.app.bot.send_photo(
                    chat_id=self.portfolio_channel_id,
                    photo=image_url,
                    caption=self._clean_text(broadcast_text),
                    parse_mode='HTML'
                )
            else:
                await self.app.bot.send_message(
                    chat_id=self.portfolio_channel_id,
                    text=self._clean_text(broadcast_text),
                    parse_mode='HTML'
                )
            print(f"Successfully broadcasted to portfolio: {self.portfolio_channel_id}")
        except Exception as e:
            print(f"Failed to broadcast to portfolio: {e}")

    def _clean_text(self, text):
        """Removes surrogate characters that cause UnicodeEncodeErrors."""
        if not text:
            return text
        return text.encode('utf-8', 'ignore').decode('utf-8')

    async def ping_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        await update.message.reply_text("🏓 <b>Pong!</b> I am alive and listening.", parse_mode='HTML')

    async def trigger_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        # We'll override this in main.py to trigger content generation
        pass

    async def send_for_approval(self, content_id, content: dict, day_num: int):
        """Sends itappens.ai brand content to Telegram with approval buttons."""
        image_url = content.get("image_url")

        li_preview = content.get('linkedin_company', '')[:300]
        tw_preview = content.get('twitter', '')[:200]
        ig_preview = content.get('instagram', '')[:200]

        text = (
            f"🚀 <b>itappens.ai Content Ready!</b> (Day {day_num})\n\n"
            f"🏢 <b>LINKEDIN (Company Page):</b>\n{li_preview}...\n\n"
            f"🐦 <b>TWITTER/X:</b>\n{tw_preview}...\n\n"
            f"📸 <b>INSTAGRAM:</b>\n{ig_preview}..."
        )

        keyboard = [
            [
                InlineKeyboardButton("✅ LinkedIn", callback_data=f"approve_li_{content_id}"),
                InlineKeyboardButton("✅ Twitter/X", callback_data=f"approve_tw_{content_id}"),
            ],
            [
                InlineKeyboardButton("🎥 Instagram Reel", callback_data=f"approve_ig_{content_id}"),
                InlineKeyboardButton("📺 YouTube Short", callback_data=f"approve_yt_{content_id}"),
            ],
            [
                InlineKeyboardButton("🚀 APPROVE ALL", callback_data=f"approve_all_{content_id}"),
            ],
            [
                InlineKeyboardButton("❌ Reject", callback_data=f"reject_{content_id}")
            ]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)

        if self.app:
            try:
                send_fn = self.app.bot.send_photo if image_url else self.app.bot.send_message
                if image_url:
                    await self.app.bot.send_photo(
                        chat_id=self.chat_id,
                        photo=image_url,
                        caption=self._clean_text(text),
                        parse_mode='HTML',
                        reply_markup=reply_markup
                    )
                else:
                    await self.app.bot.send_message(
                        chat_id=self.chat_id,
                        text=self._clean_text(text),
                        parse_mode='HTML',
                        reply_markup=reply_markup
                    )

                # Full text preview for copy/paste
                full_text = (
                    f"📄 <b>Full Content: {content_id}</b>\n\n"
                    f"<b>LinkedIn Company:</b>\n{content.get('linkedin_company', '')}\n\n"
                    f"<b>Twitter/X:</b>\n{content.get('twitter', '')}\n\n"
                    f"<b>Instagram:</b>\n{content.get('instagram', '')}"
                )
                chunks = [full_text[i:i+4000] for i in range(0, len(full_text), 4000)]
                for chunk in chunks:
                    await self.app.bot.send_message(
                        chat_id=self.chat_id,
                        text=self._clean_text(chunk),
                        parse_mode='HTML'
                    )

            except Exception as e:
                print(f"❌ Telegram approval error: {e}")

    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        await update.message.reply_text("🤖 <b>Zero-Touch Bot is ONLINE!</b>\n\nI am listening for approvals and running the daily scheduler. Every morning at your scheduled time, I will ping you here.", parse_mode='HTML')

    async def handle_callback(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        # We'll override this in main.py to handle the actual approval logic
        pass

    async def _handle_conflict_error(self, update, context):
        """Gracefully handle Telegram Conflict errors on redeploy."""
        if isinstance(context.error, Conflict):
            logging.warning("Telegram Conflict detected — another instance is running. Waiting for it to shut down...")
        else:
            logging.error(f"Unhandled error: {context.error}")

    def run(self, callback_handler=None, trigger_handler=None):
        """Starts the bot to listen for callbacks and commands."""
        self.app.add_handler(CommandHandler("start", self.start_command))
        self.app.add_handler(CommandHandler("ping", self.ping_command))
        
        if trigger_handler:
            self.app.add_handler(CommandHandler("trigger", trigger_handler))
        else:
            self.app.add_handler(CommandHandler("trigger", self.trigger_command))

        if callback_handler:
            self.app.add_handler(CallbackQueryHandler(callback_handler))
        else:
            self.app.add_handler(CallbackQueryHandler(self.handle_callback))
        
        # Register error handler to suppress conflict spam on redeploy
        self.app.add_error_handler(self._handle_conflict_error)
        
        print("\nTelegram Bot is starting...")
        # drop_pending_updates=True ensures we don't fight old instances on redeploy
        self.app.run_polling(drop_pending_updates=True)
