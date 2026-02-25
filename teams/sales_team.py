"""
teams/sales_team.py
───────────────────
Sales & Growth Team: Lead Researcher + Outreach Agent + Content Agent + Follow-up Agent
Runs daily at 9am via APScheduler. Fully autonomous customer acquisition.
"""

import logging
import os

from crewai import Agent, Crew, Process, Task
from crewai_tools import SerperDevTool

from tools.gmail_tool import gmail_send_tool, gmail_check_replies_tool, gmail_follow_up_tool
from tools.twitter_tool import (
    twitter_post_tool, twitter_thread_tool,
    twitter_find_leads_tool, twitter_dm_tool, twitter_mentions_tool
)
from tools.file_tool import read_file_tool, write_file_tool
from customer.customer_brain import CustomerBrain

logger = logging.getLogger(__name__)
serper_tool = SerperDevTool()


# Lead search keywords — match pain points of solo founders
LEAD_KEYWORDS = [
    "need developer",
    "hiring engineer expensive",
    "can't ship fast enough",
    "need technical cofounder",
    "MVP developer",
    "dev team too expensive",
    "build startup alone",
    "no CTO",
    "solo founder product",
]


def build_sales_crew(
    product_description: str,
    llm_sonnet,
    llm_haiku,
    sprint_board=None,
) -> Crew:
    """
    Build the autonomous sales & growth crew.
    Runs independently every day — finds leads, sends outreach, manages pipeline.
    """

    # ── Agents ────────────────────────────────────────────────────────────────

    lead_researcher = Agent(
        role="Lead Researcher",
        goal=(
            "Find 10+ qualified leads per day on Twitter and the web. "
            "Score each lead 1-10. Only surface leads scoring 7 or higher."
        ),
        backstory=(
            f"You find potential customers for: {product_description}\n\n"
            "You search for founders who are struggling with: slow development, expensive engineering, "
            "inability to ship features fast enough. You score leads by pain signal strength: "
            "high pain + budget signal = 9-10, vague interest = 5-6."
        ),
        llm=llm_haiku,
        tools=[twitter_find_leads_tool, serper_tool, write_file_tool],
        verbose=False,
        allow_delegation=False,
    )

    outreach_agent = Agent(
        role="Outreach Agent",
        goal=(
            "Write hyper-personalized outreach messages. Max 4 sentences. "
            "No price in first message. End with: 'Would a 2-min demo be useful?'"
        ),
        backstory=(
            f"You write personalized cold outreach for: {product_description}\n\n"
            "Your messages reference the lead's specific situation — their tweet, their product, their pain. "
            "You NEVER send generic templates. You try Twitter DM first, then email. "
            "Max 20 messages per day. On hot lead reply: write draft reply immediately."
        ),
        llm=llm_sonnet,
        tools=[twitter_dm_tool, gmail_send_tool, gmail_check_replies_tool, read_file_tool],
        verbose=False,
        allow_delegation=False,
    )

    content_agent = Agent(
        role="Content Agent",
        goal="Post daily Twitter content that demonstrates the system working. Use real data.",
        backstory=(
            f"You create daily social content for: {product_description}\n\n"
            "Content Calendar:\n"
            "Monday: 'How our AI team shipped X this week' (real sprint board data)\n"
            "Tuesday: Cost comparison AI team vs hiring (real numbers)\n"
            "Wednesday: Behind the scenes — Telegram updates, sprint screenshots\n"
            "Thursday: Thread: 'How to build a product team for $500/mo'\n"
            "Friday: Win of the week — customer result or metric\n\n"
            "Always use real data. Never make up stats."
        ),
        llm=llm_sonnet,
        tools=[twitter_post_tool, twitter_thread_tool, twitter_mentions_tool,
               serper_tool, read_file_tool],
        verbose=False,
        allow_delegation=False,
    )

    followup_agent = Agent(
        role="Follow-up Agent",
        goal=(
            "Check replies. Send follow-ups after 3 days silence. "
            "Send breakup emails after 7 days. Generate daily pipeline report."
        ),
        backstory=(
            "You manage the outreach pipeline for a B2B SaaS company. "
            "You check replies, send value-adding follow-ups (NOT pushy), "
            "and send a kind 'breakup' email after 7 days of silence. "
            "You flag hot leads immediately with a draft reply for human review."
        ),
        llm=llm_haiku,
        tools=[gmail_check_replies_tool, gmail_follow_up_tool, twitter_mentions_tool, write_file_tool],
        verbose=False,
        allow_delegation=False,
    )

    # ── Tasks ─────────────────────────────────────────────────────────────────

    research_task = Task(
        description=(
            f"Search Twitter and the web for leads. Use these keywords: {', '.join(LEAD_KEYWORDS)}.\n"
            "Find 10+ leads. Score each 1-10 based on pain signal strength. "
            "Only include leads scoring 7 or above in your output. "
            "Write results to workspace/todays_leads.md"
        ),
        agent=lead_researcher,
        expected_output="List of 7+ qualified leads with score, username, and pain signal quote.",
    )

    outreach_task = Task(
        description=(
            "Read today's qualified leads from workspace/todays_leads.md. "
            "Write a personalized outreach message for each lead (max 4 sentences, no price). "
            "Send via Twitter DM first; fall back to email if no Twitter. "
            "End every message with: 'Would a 2-min demo be useful?' "
            "Max 20 messages today. Log sent messages."
        ),
        agent=outreach_agent,
        expected_output="List of outreach messages sent with platform (DM/email) and lead name.",
        context=[research_task],
    )

    content_task = Task(
        description=(
            "Post today's scheduled Twitter content based on the content calendar. "
            "Read real sprint data from memory/sprint_board.json if available. "
            "Choose today's content type based on day of week. "
            "If it's a thread day (Thursday), post a thread of 5-7 tweets."
        ),
        agent=content_agent,
        expected_output="Confirmation of posted content with tweet URL(s).",
    )

    followup_task = Task(
        description=(
            "1. Check Gmail for replies in the last 24 hours.\n"
            "2. Send follow-up emails to leads silent for 3+ days.\n"
            "3. Send breakup emails to leads silent for 7+ days.\n"
            "4. Check Twitter mentions for any replies.\n"
            "5. Write a daily pipeline report to workspace/pipeline_report.md with: "
            "leads found today, outreach sent, replies received, hot leads flagged."
        ),
        agent=followup_agent,
        expected_output="Pipeline report written to workspace/pipeline_report.md",
        context=[outreach_task],
    )

    return Crew(
        agents=[lead_researcher, outreach_agent, content_agent, followup_agent],
        tasks=[research_task, outreach_task, content_task, followup_task],
        process=Process.sequential,
        verbose=False,
    )
