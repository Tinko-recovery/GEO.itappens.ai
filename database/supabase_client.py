from config import supabase, logger
from typing import List, Dict, Any

class SupabaseDB:
    @staticmethod
    def get_user_by_telegram_id(telegram_id: str):
        try:
            response = supabase.table("profiles").select("*").eq("telegram_id", str(telegram_id)).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error fetching user by telegram_id: {e}")
            return None

    @staticmethod
    def add_to_portfolio(user_id: str, ticker: str, quantity: float, buy_price: float):
        try:
            data = {
                "user_id": user_id,
                "ticker": ticker.upper(),
                "quantity": quantity,
                "buy_price": buy_price
            }
            supabase.table("portfolios").insert(data).execute()
            return True
        except Exception as e:
            logger.error(f"Error adding to portfolio: {e}")
            return False

    @staticmethod
    def remove_from_portfolio(user_id: str, ticker: str):
        try:
            supabase.table("portfolios").delete().eq("user_id", user_id).eq("ticker", ticker.upper()).execute()
            return True
        except Exception as e:
            logger.error(f"Error removing from portfolio: {e}")
            return False

    @staticmethod
    def get_portfolio(user_id: str) -> List[Dict]:
        try:
            response = supabase.table("portfolios").select("*").eq("user_id", user_id).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching portfolio: {e}")
            return []

    @staticmethod
    def save_market_signal(ticker: str, signal: str, tech_score: float, fund_score: float, reasoning: str):
        try:
            data = {
                "ticker": ticker.upper(),
                "last_signal": signal,
                "technical_score": tech_score,
                "fundamental_score": fund_score,
                "reasoning": reasoning,
                "last_updated": "now()"
            }
            # Upsert into market_signals
            supabase.table("market_signals").upsert(data, on_conflict="ticker").execute()
            
            # Record in history
            history_data = {
                "ticker": ticker.upper(),
                "signal": signal,
                "reasoning": reasoning
            }
            supabase.table("analysis_history").insert(history_data).execute()
            return True
        except Exception as e:
            logger.error(f"Error saving market signal: {e}")
            return False

    @staticmethod
    def get_latest_signal(ticker: str):
        try:
            response = supabase.table("market_signals").select("*").eq("ticker", ticker.upper()).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error fetching latest signal: {e}")
            return None
