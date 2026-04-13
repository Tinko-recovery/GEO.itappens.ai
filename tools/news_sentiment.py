import requests
from config import NEWS_API_KEY, ANTHROPIC_API_KEY, logger
from anthropic import Anthropic
import yfinance as yf

class NewsSentimentTool:
    def __init__(self):
        self.anthropic = Anthropic(api_key=ANTHROPIC_API_KEY)

    def get_news(self, ticker: str, limit: int = 5):
        """Fetches news from NewsAPI, falling back to yfinance if key is missing."""
        articles = []
        
        if NEWS_API_KEY:
            try:
                url = f"https://newsapi.org/v2/everything?q={ticker}&language=en&sortBy=publishedAt&pageSize={limit}&apiKey={NEWS_API_KEY}"
                response = requests.get(url)
                if response.status_code == 200:
                    news_data = response.json()
                    for art in news_data.get("articles", []):
                        articles.append({
                            "title": art["title"],
                            "description": art["description"],
                            "url": art["url"],
                            "source": art["source"]["name"]
                        })
            except Exception as e:
                logger.error(f"NewsAPI error for {ticker}: {e}")

        # Fallback to yfinance news if no articles found
        if not articles:
            try:
                stock = yf.Ticker(ticker)
                yf_news = stock.news
                for art in yf_news[:limit]:
                    articles.append({
                        "title": art.get("title"),
                        "description": "", # yfinance doesn't always provide snippets
                        "url": art.get("link"),
                        "source": art.get("publisher")
                    })
            except Exception as e:
                logger.error(f"yfinance news error for {ticker}: {e}")
                
        return articles

    def analyze_sentiment(self, ticker: str, articles: list):
        if not articles:
            return "Neutral (No recent news found)"
            
        news_text = "\n".join([f"- {a['title']}: {a['description']}" for a in articles])
        
        prompt = f"""
        Analyze the following news sentiment for {ticker}. 
        Provide a concise sentiment score (1-10, where 10 is extremely bullish) 
        and a summary of how this news affects the stock's outlook.
        
        News:
        {news_text}
        
        Format: Sentiment Score: X/10. Reasoning: [Your brief summary]
        """
        
        try:
            response = self.anthropic.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=300,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.content[0].text
        except Exception as e:
            logger.error(f"Sentiment analysis error for {ticker}: {e}")
            return "Sentiment Analysis Unavailable"
