import yfinance as yf
import pandas as pd
import numpy as np
from config import logger

class MarketDataTool:
    @staticmethod
    def get_stock_data(ticker: str, period: str = "6mo", interval: str = "1d"):
        try:
            stock = yf.Ticker(ticker)
            history = stock.history(period=period, interval=interval)
            
            if history.empty:
                logger.warning(f"No data found for {ticker}")
                return None
                
            return history
        except Exception as e:
            logger.error(f"Error fetching yfinance data for {ticker}: {e}")
            return None

    @staticmethod
    def calculate_technical_indicators(df: pd.DataFrame):
        """Calculates RSI, MACD, and SMAs."""
        if df is None or len(df) < 30:
            return None
            
        # 1. RSI (14 days)
        delta = df['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['RSI'] = 100 - (100 / (1 + rs))
        
        # 2. MACD
        exp1 = df['Close'].ewm(span=12, adjust=False).mean()
        exp2 = df['Close'].ewm(span=26, adjust=False).mean()
        df['MACD'] = exp1 - exp2
        df['Signal_Line'] = df['MACD'].ewm(span=9, adjust=False).mean()
        
        # 3. Moving Averages
        df['SMA_50'] = df['Close'].rolling(window=50).mean()
        df['SMA_200'] = df['Close'].rolling(window=200).mean()
        
        return df.iloc[-1].to_dict()

    @staticmethod
    def get_fundamentals(ticker: str):
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            
            metrics = {
                "pe_ratio": info.get("trailingPE"),
                "forward_pe": info.get("forwardPE"),
                "market_cap": info.get("marketCap"),
                "dividend_yield": info.get("dividendYield"),
                "profit_margins": info.get("profitMargins"),
                "revenue_growth": info.get("revenueGrowth"),
                "debt_to_equity": info.get("debtToEquity"),
                "earnings_growth": info.get("earningsGrowth"),
                "free_cashflow": info.get("freeCashflow")
            }
            return metrics
        except Exception as e:
            logger.error(f"Error fetching fundamentals for {ticker}: {e}")
            return {}

    @staticmethod
    def get_current_price(ticker: str):
        try:
            stock = yf.Ticker(ticker)
            # Use fast_info if available or history for 1 day
            data = stock.history(period="1d")
            if not data.empty:
                return data['Close'].iloc[-1]
            return None
        except Exception as e:
            logger.error(f"Error fetching current price for {ticker}: {e}")
            return None
