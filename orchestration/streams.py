"""
orchestration/streams.py
────────────────────────
Predefined automation streams for itappens.ai.
"""

STREAMS = {
    "subscriptions": {
        "goal": "Identify potential SaaS founders and small business owners on LinkedIn and Twitter. Outreach to them and pitch itappens.ai as their autonomous AI workforce to get new paid subscriptions.",
        "description": "Stream 1: itappens.ai Subscriptions (Sales & Growth)"
    },
    "freelancing": {
        "goal": "Search for AI freelancing jobs on Upwork and similar platforms (coding, content writing, data analysis). Automatically apply, perform the work using the browser tool, and submit for payment.",
        "description": "Stream 2: AI Freelancing Income (Revenue Generation)"
    },
    "marketing": {
        "goal": "Create and publish high-quality SEO content and social media posts for itappens.ai. Focus on demonstrating the power of autonomous AI teams to attract organic traffic and build brand authority.",
        "description": "Stream 3: itappens.ai Self-Marketing (Brand Awareness)"
    }
}

def get_stream(stream_name: str):
    return STREAMS.get(stream_name.lower())
