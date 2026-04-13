import yfinance as yf
import pandas as pd
from config import logger

class MarketExplorer:
    @staticmethod
    def get_top_bse_gainers():
        """
        Fetches top gainers from BSE. 
        Note: yfinance doesn't have a direct 'top gainers' endpoint for BSE specifically,
        so we simulate this by checking a watchlist of major BSE/NSE indices.
        """
        # Major Indian Tickers (BSE/NSE)
        major_tickers = [
            "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "ICICIBANK.NS", "INFY.NS", 
            "SBIN.NS", "BHARTIARTL.NS", "LICI.NS", "ITC.NS", "HINDUNILVR.NS"
        ]
        
        results = []
        for ticker in major_tickers:
            try:
                stock = yf.Ticker(ticker)
                data = stock.history(period="1d")
                if not data.empty:
                    close = data['Close'].iloc[-1]
                    prev_close = stock.info.get("previousClose", close)
                    change = ((close - prev_close) / prev_close) * 100
                    results.append({
                        "ticker": ticker,
                        "price": close,
                        "change": round(change, 2)
                    })
            except:
                continue
                
        # Sort by change
        results.sort(key=lambda x: x['change'], reverse=True)
        return results[:5]
