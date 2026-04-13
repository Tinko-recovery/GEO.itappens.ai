from crewai import Agent, Task
from tools.market_data import MarketDataTool
from tools.news_sentiment import NewsSentimentTool

class FundamentalAnalystAgent:
    def get_agent(self):
        return Agent(
            role='Lead Fundamental Analyst',
            goal='Analyze company financial health, valuation metrics, and news sentiment to determine long-term value.',
            backstory="""You are a seasoned value investor influenced by Benjamin Graham and Warren Buffett. 
            You look at P/E ratios, debt levels, revenue growth, and profit margins. You also factor in 
            real-world news sentiment to see if the qualitative side supports the quantitative financials.""",
            verbose=True,
            allow_delegation=False,
            memory=True,
            llm="anthropic/claude-3-5-sonnet-20241022"
        )

    def get_task(self, ticker: str):
        market_tool = MarketDataTool()
        news_tool = NewsSentimentTool()
        
        fundamentals = market_tool.get_fundamentals(ticker)
        news_articles = news_tool.get_news(ticker)
        sentiment = news_tool.analyze_sentiment(ticker, news_articles)
        
        return Task(
            description=f"""
            Conduct a fundamental analysis for {ticker}.
            Financial Metrics:
            {fundamentals}
            
            News Sentiment Analysis:
            {sentiment}
            
            1. Evaluate the valuation (P/E ratio compared to growth).
            2. Check the balance sheet (Debt to Equity).
            3. Analyze revenue and earnings trajectory.
            4. Factor in the recent news sentiment.
            
            Provide a fundamental rating from 0-100 (0 = failing business, 100 = perfect outlier).
            """,
            expected_output="A comprehensive fundamental report including a 0-100 score, valuation assessment, and news impact summary.",
            agent=self.get_agent()
        )
