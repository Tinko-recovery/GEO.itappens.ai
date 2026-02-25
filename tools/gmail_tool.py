"""
tools/gmail_tool.py
───────────────────
CrewAI BaseTool classes for Gmail: send emails, check replies, send follow-ups.
Authenticates via OAuth 2.0 using credentials.json → token.json.
All sent emails are logged to memory/outreach_log.json.
"""

import base64
import json
import logging
import os
from datetime import datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from typing import Type

from crewai.tools import BaseTool
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

SCOPES = [
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify",
]

CREDENTIALS_PATH = Path(__file__).parent.parent / "credentials.json"
TOKEN_PATH = Path(__file__).parent.parent / "token.json"
OUTREACH_LOG_PATH = Path(__file__).parent.parent / "memory" / "outreach_log.json"


# ── Gmail auth helper ────────────────────────────────────────────────────────

def get_gmail_service():
    """Authenticate and return a Gmail API service object."""
    creds = None
    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDENTIALS_PATH.exists():
                raise FileNotFoundError(
                    "credentials.json not found. "
                    "Download from Google Cloud Console and place in project root."
                )
            flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIALS_PATH), SCOPES)
            creds = flow.run_local_server(port=0)
        TOKEN_PATH.write_text(creds.to_json())
    return build("gmail", "v1", credentials=creds)


def _read_outreach_log() -> list:
    OUTREACH_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    if not OUTREACH_LOG_PATH.exists():
        OUTREACH_LOG_PATH.write_text("[]")
    return json.loads(OUTREACH_LOG_PATH.read_text())


def _write_outreach_log(data: list) -> None:
    OUTREACH_LOG_PATH.write_text(json.dumps(data, indent=2))


# ── Input schemas ────────────────────────────────────────────────────────────

class SendEmailInput(BaseModel):
    to: str = Field(..., description="Recipient email address.")
    subject: str = Field(..., description="Email subject line.")
    body: str = Field(..., description="Plain-text email body.")
    lead_name: str = Field("", description="Lead's name for logging.")


class CheckRepliesInput(BaseModel):
    hours_back: int = Field(24, description="Check emails received in the last N hours.")


class SendFollowUpInput(BaseModel):
    days_since_first_email: int = Field(3, description="Send follow-up to leads silent for N days.")


# ── Tools ─────────────────────────────────────────────────────────────────────

class SendEmailTool(BaseTool):
    """
    Send an email via Gmail API and log it to outreach_log.json.
    Authenticate with OAuth 2.0 (credentials.json → token.json).
    Returns the Gmail message ID on success.
    """

    name: str = "gmail_send"
    description: str = (
        "Send an email via Gmail. Provide recipient address, subject, and body. "
        "The email is logged automatically."
    )
    args_schema: Type[BaseModel] = SendEmailInput

    def _run(self, to: str, subject: str, body: str, lead_name: str = "") -> str:
        try:
            service = get_gmail_service()
            sender = os.getenv("GMAIL_SENDER_EMAIL", "me")

            msg = MIMEMultipart("alternative")
            msg["To"] = to
            msg["From"] = sender
            msg["Subject"] = subject
            msg.attach(MIMEText(body, "plain"))

            raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
            sent = service.users().messages().send(userId="me", body={"raw": raw}).execute()
            message_id = sent.get("id", "unknown")

            # Log to outreach_log.json
            log = _read_outreach_log()
            log.append({
                "message_id": message_id,
                "to": to,
                "lead_name": lead_name,
                "subject": subject,
                "sent_at": datetime.utcnow().isoformat(),
                "status": "sent",
                "follow_up_sent": False,
                "replied": False,
            })
            _write_outreach_log(log)

            return f"✅ Email sent to {to}. Message ID: {message_id}"
        except Exception as exc:
            logger.error("Gmail send failed: %s", exc)
            return f"ERROR sending email: {exc}"


class CheckRepliesTool(BaseTool):
    """
    Check Gmail inbox for replies received in the last N hours.
    Updates outreach_log.json marking replied=true for matching leads.
    Returns a list of replies with sender, subject, and preview.
    """

    name: str = "gmail_check_replies"
    description: str = (
        "Check Gmail inbox for new replies in the last N hours. "
        "Returns sender, subject, and a 200-char preview for each reply."
    )
    args_schema: Type[BaseModel] = CheckRepliesInput

    def _run(self, hours_back: int = 24) -> str:
        try:
            service = get_gmail_service()
            cutoff = datetime.utcnow() - timedelta(hours=hours_back)
            query = f"in:inbox after:{int(cutoff.timestamp())}"
            results = service.users().messages().list(userId="me", q=query).execute()
            messages = results.get("messages", [])

            if not messages:
                return "No new replies."

            log = _read_outreach_log()
            log_ids = {e["message_id"] for e in log}
            output_lines = []

            for m in messages[:20]:
                msg = service.users().messages().get(userId="me", id=m["id"]).execute()
                headers = {h["name"]: h["value"] for h in msg["payload"]["headers"]}
                sender = headers.get("From", "Unknown")
                subject = headers.get("Subject", "(no subject)")
                snippet = msg.get("snippet", "")[:200]
                output_lines.append(f"From: {sender}\nSubject: {subject}\nPreview: {snippet}\n")

                # Mark as replied in log
                for entry in log:
                    if entry.get("to", "").lower() in sender.lower():
                        entry["replied"] = True

            _write_outreach_log(log)
            return "\n---\n".join(output_lines) if output_lines else "No replies found."
        except Exception as exc:
            return f"ERROR checking replies: {exc}"


class SendFollowUpTool(BaseTool):
    """
    Send follow-up emails to leads that haven't replied after N days.
    Reads outreach_log.json to find eligible leads and marks follow_up_sent=true.
    Max 1 follow-up per lead. Not pushy — adds value.
    """

    name: str = "gmail_follow_up"
    description: str = (
        "Send follow-up emails to leads that haven't replied in N days. "
        "Automatically finds eligible leads from the outreach log."
    )
    args_schema: Type[BaseModel] = SendFollowUpInput

    def _run(self, days_since_first_email: int = 3) -> str:
        try:
            log = _read_outreach_log()
            cutoff = datetime.utcnow() - timedelta(days=days_since_first_email)
            sent_count = 0
            send_tool = SendEmailTool()

            for entry in log:
                if entry.get("replied") or entry.get("follow_up_sent"):
                    continue
                sent_at_str = entry.get("sent_at", "")
                if not sent_at_str:
                    continue
                sent_at = datetime.fromisoformat(sent_at_str)
                if sent_at > cutoff:
                    continue

                # Build a short, value-adding follow-up
                lead_name = entry.get("lead_name", "there")
                follow_up_body = (
                    f"Hey {lead_name},\n\n"
                    "Just wanted to follow up quickly — I know inboxes get busy.\n\n"
                    "We've helped a few founders ship their entire MVP in under a week "
                    "using our AI product team. No hiring, no management overhead.\n\n"
                    "Would a quick 10-min demo be useful? Happy to show you the team working "
                    "on your actual goal in real time.\n\n"
                    "— The itappens.ai team"
                )

                result = send_tool._run(
                    to=entry["to"],
                    subject=f"Re: {entry['subject']}",
                    body=follow_up_body,
                    lead_name=lead_name,
                )
                entry["follow_up_sent"] = True
                sent_count += 1
                logger.info("Follow-up sent to %s: %s", entry["to"], result)

            _write_outreach_log(log)
            return f"✅ Sent {sent_count} follow-up emails."
        except Exception as exc:
            return f"ERROR sending follow-ups: {exc}"


# Convenience instances
gmail_send_tool = SendEmailTool()
gmail_check_replies_tool = CheckRepliesTool()
gmail_follow_up_tool = SendFollowUpTool()
