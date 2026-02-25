"""
tools/twitter_tool.py
─────────────────────
Five CrewAI BaseTool classes for Twitter/X using Tweepy v2:
  PostTweetTool, PostThreadTool, FindLeadsTool, SendDMTool, CheckMentionsTool
All credentials come from .env.
Lead data is persisted to memory/twitter_leads.json.
"""

import json
import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Type

import tweepy
from crewai.tools import BaseTool
from dotenv import load_dotenv
from pydantic import BaseModel, Field

load_dotenv()
logger = logging.getLogger(__name__)

TWITTER_LOG_PATH = Path(__file__).parent.parent / "memory" / "twitter_log.json"
TWITTER_LEADS_PATH = Path(__file__).parent.parent / "memory" / "twitter_leads.json"


# ── Auth helper ─────────────────────────────────────────────────────────────

def get_twitter_client() -> tweepy.Client:
    """Return an authenticated Tweepy v2 Client."""
    return tweepy.Client(
        bearer_token=os.getenv("TWITTER_BEARER_TOKEN"),
        consumer_key=os.getenv("TWITTER_API_KEY"),
        consumer_secret=os.getenv("TWITTER_API_SECRET"),
        access_token=os.getenv("TWITTER_ACCESS_TOKEN"),
        access_token_secret=os.getenv("TWITTER_ACCESS_TOKEN_SECRET"),
        wait_on_rate_limit=True,
    )


def _read_json(path: Path) -> list | dict:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_text("[]")
    return json.loads(path.read_text())


def _write_json(path: Path, data) -> None:
    path.write_text(json.dumps(data, indent=2, default=str))


# ── Input schemas ────────────────────────────────────────────────────────────

class PostTweetInput(BaseModel):
    text: str = Field(..., description="Tweet text (max 280 chars).")
    reply_to_id: str = Field("", description="Tweet ID to reply to (optional).")


class PostThreadInput(BaseModel):
    tweets: list[str] = Field(..., description="List of tweet texts to chain as a thread.")


class FindLeadsInput(BaseModel):
    keywords: list[str] = Field(..., description="List of search keywords to find leads.")
    max_results: int = Field(20, description="Max tweets to retrieve (10-100).")


class SendDMInput(BaseModel):
    username: str = Field(..., description="Twitter username (without @) to DM.")
    message: str = Field(..., description="DM text to send.")


class CheckMentionsInput(BaseModel):
    count: int = Field(10, description="Number of recent mentions to retrieve.")


# ── Tools ─────────────────────────────────────────────────────────────────────

class PostTweetTool(BaseTool):
    """Post a single tweet. Validates 280-char limit. Logs to twitter_log.json."""

    name: str = "twitter_post"
    description: str = "Post a tweet (max 280 chars). Returns the tweet URL."
    args_schema: Type[BaseModel] = PostTweetInput

    def _run(self, text: str, reply_to_id: str = "") -> str:
        if len(text) > 280:
            return f"ERROR: Tweet is {len(text)} chars — max 280."
        try:
            client = get_twitter_client()
            kwargs = {"text": text}
            if reply_to_id:
                kwargs["in_reply_to_tweet_id"] = reply_to_id

            resp = client.create_tweet(**kwargs)
            tweet_id = resp.data["id"]
            username = os.getenv("TWITTER_USERNAME", "itappens_ai")
            url = f"https://twitter.com/{username}/status/{tweet_id}"

            log = _read_json(TWITTER_LOG_PATH)
            log.append({"tweet_id": tweet_id, "text": text, "url": url,
                         "posted_at": datetime.utcnow().isoformat()})
            _write_json(TWITTER_LOG_PATH, log)
            return f"✅ Tweet posted: {url}"
        except Exception as exc:
            return f"ERROR posting tweet: {exc}"


class PostThreadTool(BaseTool):
    """Post a Twitter thread from a list of tweet strings. Returns the URL of the first tweet."""

    name: str = "twitter_thread"
    description: str = "Post a Twitter thread. Provide a list of tweets to chain."
    args_schema: Type[BaseModel] = PostThreadInput

    def _run(self, tweets: list[str]) -> str:
        if not tweets:
            return "ERROR: No tweets provided."
        post_tool = PostTweetTool()
        first_url = None
        reply_id = ""
        for i, tweet in enumerate(tweets):
            result = post_tool._run(text=tweet, reply_to_id=reply_id)
            if result.startswith("ERROR"):
                return f"Thread failed at tweet {i + 1}: {result}"
            if i == 0:
                first_url = result.split()[-1]  # extract URL
            # Extract tweet ID from URL for chaining
            reply_id = first_url.split("/")[-1] if first_url else ""
        return f"✅ Thread posted: {first_url}"


class FindLeadsTool(BaseTool):
    """
    Search recent tweets for leads using keyword queries.
    Filters to English, non-RT, non-reply tweets.
    Saves leads to twitter_leads.json with outreach_sent=false.
    """

    name: str = "twitter_find_leads"
    description: str = (
        "Search Twitter for potential leads using keywords. "
        "Returns name, username, bio, follower count, tweet text, and profile URL."
    )
    args_schema: Type[BaseModel] = FindLeadsInput

    def _run(self, keywords: list[str], max_results: int = 20) -> str:
        try:
            client = get_twitter_client()
            query = " OR ".join(f'"{kw}"' for kw in keywords)
            query += " -is:retweet -is:reply lang:en"

            resp = client.search_recent_tweets(
                query=query,
                max_results=min(max(10, max_results), 100),
                expansions=["author_id"],
                user_fields=["name", "username", "public_metrics", "description"],
            )

            if not resp.data:
                return "No leads found."

            users = {u.id: u for u in (resp.includes.get("users") or [])}
            leads = []
            output_lines = []

            for tweet in resp.data:
                author = users.get(tweet.author_id)
                if not author:
                    continue
                followers = (author.public_metrics or {}).get("followers_count", 0)
                lead = {
                    "name": author.name,
                    "username": author.username,
                    "followers": followers,
                    "bio": author.description or "",
                    "tweet_text": tweet.text,
                    "profile_url": f"https://twitter.com/{author.username}",
                    "tweet_id": tweet.id,
                    "found_at": datetime.utcnow().isoformat(),
                    "outreach_sent": False,
                }
                leads.append(lead)
                output_lines.append(
                    f"@{author.username} ({followers} followers)\n"
                    f"Bio: {author.description or '—'}\n"
                    f"Tweet: {tweet.text[:120]}"
                )

            # Save to leads file (deduplicate by username)
            existing = _read_json(TWITTER_LEADS_PATH)
            existing_usernames = {e["username"] for e in existing}
            new_leads = [l for l in leads if l["username"] not in existing_usernames]
            existing.extend(new_leads)
            _write_json(TWITTER_LEADS_PATH, existing)

            return f"Found {len(leads)} leads ({len(new_leads)} new):\n\n" + "\n---\n".join(output_lines)
        except Exception as exc:
            return f"ERROR finding leads: {exc}"


class SendDMTool(BaseTool):
    """
    Send a Twitter DM to a user by username.
    Marks outreach_sent=true in twitter_leads.json.
    """

    name: str = "twitter_dm"
    description: str = "Send a Twitter DM to a user by their username (without @)."
    args_schema: Type[BaseModel] = SendDMInput

    def _run(self, username: str, message: str) -> str:
        try:
            client = get_twitter_client()
            user_resp = client.get_user(username=username)
            if not user_resp.data:
                return f"ERROR: User @{username} not found."
            user_id = user_resp.data.id
            client.create_direct_message(participant_id=user_id, text=message)

            # Mark outreach_sent in leads file
            leads = _read_json(TWITTER_LEADS_PATH)
            for lead in leads:
                if lead["username"].lower() == username.lower():
                    lead["outreach_sent"] = True
                    lead["outreach_sent_at"] = datetime.utcnow().isoformat()
            _write_json(TWITTER_LEADS_PATH, leads)

            return f"✅ DM sent to @{username}"
        except Exception as exc:
            return f"ERROR sending DM to @{username}: {exc}"


class CheckMentionsTool(BaseTool):
    """Return the last N mentions of the authenticated Twitter account."""

    name: str = "twitter_mentions"
    description: str = "Check the last N mentions of the itappens.ai Twitter account."
    args_schema: Type[BaseModel] = CheckMentionsInput

    def _run(self, count: int = 10) -> str:
        try:
            client = get_twitter_client()
            me = client.get_me()
            if not me.data:
                return "ERROR: Could not retrieve authenticated user."
            resp = client.get_users_mentions(
                id=me.data.id,
                max_results=min(count, 100),
            )
            if not resp.data:
                return "No mentions found."
            lines = []
            for tweet in resp.data:
                url = f"https://twitter.com/i/web/status/{tweet.id}"
                lines.append(f"@{tweet.author_id}: {tweet.text[:120]}\n{url}")
            return "\n---\n".join(lines)
        except Exception as exc:
            return f"ERROR checking mentions: {exc}"


# Convenience instances
twitter_post_tool = PostTweetTool()
twitter_thread_tool = PostThreadTool()
twitter_find_leads_tool = FindLeadsTool()
twitter_dm_tool = SendDMTool()
twitter_mentions_tool = CheckMentionsTool()
