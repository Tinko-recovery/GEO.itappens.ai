from telegram import Update
from telegram.ext import ContextTypes
from database.supabase_client import SupabaseDB
from orchestration.engine import AnalysisEngine
from tools.portfolio_parser import PortfolioParser
from tools.market_explorer import MarketExplorer
from config import DISCLAIMER, logger
import io

class BotHandlers:
    def __init__(self):
        self.engine = AnalysisEngine()

    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        user = update.effective_user
        telegram_id = str(user.id)
        
        db_user = SupabaseDB.get_user_by_telegram_id(telegram_id)
        
        if db_user:
            await update.message.reply_text(
                f"Welcome back, {db_user.get('user_name', 'User')}! 🚀\nitappens is ready to monitor your wealth.\n\n"
                "Commands:\n/portfolio - View your holdings\n/add SYMBOL QTY PRICE - Add stock\n/analyze SYMBOL - Get instant AI check"
            )
        else:
            await update.message.reply_text(
                "Welcome to itappens! 🤖\n\nIt looks like your Telegram ID is not linked to an account yet. "
                "Please link it via the dashboard or contact support.\n"
                f"Your Telegram ID: `{telegram_id}`",
                parse_mode='Markdown'
            )

    async def add_stock(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        user_id = str(update.effective_user.id)
        db_user = SupabaseDB.get_user_by_telegram_id(user_id)
        
        if not db_user:
            await update.message.reply_text("Unauthorized. Please link your Telegram ID first.")
            return

        try:
            ticker = context.args[0].upper()
            qty = float(context.args[1])
            price = float(context.args[2])
            
            success = SupabaseDB.add_to_portfolio(db_user['id'], ticker, qty, price)
            if success:
                await update.message.reply_text(f"Added {qty} units of {ticker} to your portfolio! ✅")
            else:
                await update.message.reply_text("Failed to add stock. Please try again.")
        except (IndexError, ValueError):
            await update.message.reply_text("Usage: /add TICKER QUANTITY PRICE\nExample: /add AAPL 10 150.50")

    async def view_portfolio(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        db_user = SupabaseDB.get_user_by_telegram_id(str(update.effective_user.id))
        if not db_user: return

        holdings = SupabaseDB.get_portfolio(db_user['id'])
        if not holdings:
            await update.message.reply_text("Your portfolio is empty. Add stocks with /add.")
            return

        msg = "Your Portfolio 📈\n\n"
        for h in holdings:
            msg += f"• *{h['ticker']}*: {h['quantity']} units (@ {h['buy_price']})\n"
        
        await update.message.reply_text(msg, parse_mode='Markdown')

    async def analyze_stock(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        if not context.args:
            await update.message.reply_text("Please provide a ticker: /analyze TICKER")
            return
            
        ticker = context.args[0].upper()
        await update.message.reply_text(f"🤖 itappens is analyzing {ticker} using Technical and Fundamental agents... Please wait.")
        
        try:
            report = self.engine.run_full_analysis(ticker)
            await update.message.reply_text(report)
        except Exception as e:
            logger.error(f"Analysis failed: {e}")
            await update.message.reply_text(f"Sorry, analysis for {ticker} failed. {DISCLAIMER}")

    async def remove_stock(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        db_user = SupabaseDB.get_user_by_telegram_id(str(update.effective_user.id))
        if not db_user: return

        if not context.args:
            await update.message.reply_text("Usage: /remove TICKER")
            return

        ticker = context.args[0].upper()
        success = SupabaseDB.remove_from_portfolio(db_user['id'], ticker)
        if success:
            await update.message.reply_text(f"Removed {ticker} from your portfolio. 🗑️")
        else:
            await update.message.reply_text(f"Could not find {ticker} in your portfolio.")

    async def handle_document(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        db_user = SupabaseDB.get_user_by_telegram_id(str(update.effective_user.id))
        if not db_user: return

        doc = update.message.document
        await update.message.reply_text(f"Processing uploaded file: {doc.file_name}... 🧐")
        
        file = await context.bot.get_file(doc.file_id)
        file_bytes = await file.download_as_bytearray()
        
        parser = PortfolioParser()
        holdings = []
        
        if doc.file_name.endswith('.json'):
            holdings = parser.parse_json(file_bytes.decode('utf-8'))
        elif doc.file_name.endswith(('.xlsx', '.xls')):
            # Temp save for pandas
            with open("tmp_portfolio.xlsx", "wb") as f:
                f.write(file_bytes)
            holdings = parser.parse_excel("tmp_portfolio.xlsx")
        elif doc.file_name.endswith('.pdf'):
            # PDFs are tricky, we'll try vision if it's treated as image or just warn
            await update.message.reply_text("PDF support is currently via Vision. Please send a clear screenshot of your portfolio for best results.")
            return

        self._import_holdings(db_user['id'], holdings, update)

    async def handle_photo(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        db_user = SupabaseDB.get_user_by_telegram_id(str(update.effective_user.id))
        if not db_user: return

        await update.message.reply_text("OCR: Reading your portfolio screenshot using Claude 3.5 Sonnet... 👁️")
        
        photo = update.message.photo[-1] # Best quality
        file = await context.bot.get_file(photo.file_id)
        file_bytes = await file.download_as_bytearray()
        
        parser = PortfolioParser()
        holdings = parser.parse_with_vision(file_bytes, "image/jpeg")
        
        self._import_holdings(db_user['id'], holdings, update)

    def _import_holdings(self, user_id, holdings, update):
        if not holdings:
            asyncio.create_task(update.message.reply_text("Could not extract any stock data. Please check the file format."))
            return
            
        count = 0
        for h in holdings:
            if SupabaseDB.add_to_portfolio(user_id, h.get('ticker'), h.get('quantity', 0), h.get('buy_price', 0)):
                count += 1
        
        asyncio.create_task(update.message.reply_text(f"Successfully imported {count} stocks to your portfolio! 🚀"))

    async def explore_market(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        await update.message.reply_text("🔎 Fetching top performing BSE/NSE stocks for today...")
        
        try:
            gainers = MarketExplorer.get_top_bse_gainers()
            if not gainers:
                await update.message.reply_text("No significant market data found right now.")
                return
                
            msg = "🔥 *Today's Top Performers (BSE/NSE)*:\n\n"
            for g in gainers:
                msg += f"• *{g['ticker']}*: ₹{g['price']:.2f} ({g['change']:+}%)\n"
            
            msg += "\nUse `/analyze TICKER` for a detailed AI deep dive on any of these."
            await update.message.reply_text(msg, parse_mode='Markdown')
        except Exception as e:
            logger.error(f"Explore failed: {e}")
            await update.message.reply_text("Market exploration currently unavailable.")
