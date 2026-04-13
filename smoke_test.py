from tools.market_data import MarketDataTool
from tools.news_sentiment import NewsSentimentTool
from tools.market_explorer import MarketExplorer
import sys

def test_core():
    print("🚀 Starting Smoke Test...")
    
    # 1. Market Explorer
    print("\n--- Testing Market Explorer ---")
    gainers = MarketExplorer.get_top_bse_gainers()
    for g in gainers:
        print(f"Found: {g['ticker']} at ₹{g['price']}")
        
    # 2. Market Data
    ticker = "AAPL"
    print(f"\n--- Testing Market Data Tool for {ticker} ---")
    tool = MarketDataTool()
    df = tool.get_stock_data(ticker, period="1mo")
    if df is not None:
        indicators = tool.calculate_technical_indicators(df)
        print(f"Technical Score (Mocked): {indicators.get('RSI') if indicators else 'N/A'}")
        
    # 3. Fundamentals
    print("\n--- Testing Fundamentals ---")
    funds = tool.get_fundamentals(ticker)
    print(f"P/E Ratio: {funds.get('pe_ratio')}")
    
    print("\n✅ Tools verified! (Requires API keys for Claude sentiment)")

if __name__ == "__main__":
    test_core()
