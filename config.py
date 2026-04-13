import os
import logging
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Logging Configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("itappens.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("itappens")

# API Keys
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") # For Vision/OCR if needed

# Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE") # Use Service Role for backend operations

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.error("Supabase credentials missing in .env")
    supabase: Client = None
else:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Disclaimer Suffix
DISCLAIMER = "\n\n⚠️ itappens is an AI research tool, not a registered investment advisor. All decisions are yours alone. AI can make mistakes."

# Strategy Settings
IST_TZ = "Asia/Kolkata"
DAILY_REPORT_TIME = "08:00" # IST
INTRADAY_CHECK_INTERVAL = 30 # Minutes
PRICE_ALERT_THRESHOLD = 0.03 # 3%
