# itappens.ai — Setup Guide

## Prerequisites

- Python 3.11+
- Node.js 18+ (for dashboard frontend)
- A Google Cloud project with Gmail API enabled

---

## Step 1 — Clone and install

```bash
cd itappens.ai
pip install -r requirements.txt
```

---

## Step 2 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in **every** value. Here's where to get each key:

| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com) (fallback only) |
| `TELEGRAM_BOT_TOKEN` | Message `@BotFather` on Telegram → `/newbot` |
| `TELEGRAM_CHAT_ID` | Visit `https://api.telegram.org/bot<TOKEN>/getUpdates` after sending one message to your bot |
| `GMAIL_SENDER_EMAIL` | Your Gmail address |
| `TWITTER_API_KEY` etc | [developer.twitter.com](https://developer.twitter.com) — Elevated Access |
| `SERPER_API_KEY` | [serper.dev](https://serper.dev) — free 2,500 searches/mo |
| `GITHUB_TOKEN` | [github.com/settings/tokens](https://github.com/settings/tokens) (repo scope) |
| `FOUNDER_NAME` | Your first name (used in exit interview emails) |
| `FOUNDER_EMAIL` | Your personal email address |
| `CALENDLY_LINK` | Your Calendly booking URL |

---

## Step 3 — Set up Gmail OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project → Enable **Gmail API**
3. Create **OAuth 2.0 credentials** → Download as `credentials.json`
4. Place `credentials.json` in the project root (same folder as `main.py`)
5. First run will open a browser for OAuth consent → generates `token.json`

---

## Step 4 — Set up Twitter Developer Access

1. Apply for [Elevated Access](https://developer.twitter.com/en/portal/petition/essential/basic-info) at Twitter
2. Create an App → enable **Read + Write + Direct Messages** permissions
3. Generate all 5 credentials and add to `.env`

---

## Step 5 — First run

```bash
python main.py
```

**What happens:**
1. Checks budget — stops if `DAILY_BUDGET_USD` would be exceeded
2. Detects new customer → starts 5-question Telegram onboarding interview
3. Once you answer all 5 questions → AI team spins up in 60 seconds
4. CEO Agent plans the sprint → issues missions to CTO and CPO
5. All engineering + marketing teams run **simultaneously** via asyncio
6. Every output scored 1-10 by Quality Gate before delivery
7. You receive a 15-minute Telegram update with: team status, quality scores, cost
8. Sprint complete → CEO synthesizes results → customer brain updated

---

## Step 6 — Dashboard

Start the FastAPI backend:

```bash
python dashboard/api/main.py
# or:
uvicorn dashboard.api.main:app --reload --port 8000
```

The dashboard serves at `http://localhost:8000`

For the React frontend (optional, for dev with HMR):

```bash
cd dashboard/frontend
npm create vite@latest . -- --template react
npm install
npm run dev
```

---

## Step 7 — Run the sales team manually

```bash
python -c "import asyncio; from main import run_daily_sales; asyncio.run(run_daily_sales())"
```

The sales team automatically runs daily at 9am once the main scheduler is active.

---

## Pricing

| Plan | Price | Eng Teams | Mkt Teams | Token Budget |
|------|-------|-----------|-----------|--------------|
| Starter | $497/mo | 1 | 1 | $20/day |
| Growth | $997/mo | 2 | 2 | $50/day |
| Scale | $2,497/mo | 4+ | Custom | $150/day |

Update `DAILY_BUDGET_USD` in `.env` to match the customer's plan.

---

## What $497/mo replaces

| Role | Market Rate |
|------|-------------|
| Junior Developer | $5,000/mo |
| Marketing Manager | $4,500/mo |
| SEO Specialist | $2,000/mo |
| Project Manager | $3,500/mo |
| **Total** | **$15,000/mo** |
| **itappens.ai** | **$497/mo** |
| **You save** | **$14,503/mo** |

---

## Architecture Overview

```
main.py
  └── CEOAgent          (claude-sonnet-4-5) — plans missions
        ├── CTOAgent    (claude-sonnet-4-5) — issues technical briefs
        │     └── [eng_1, eng_2, ...]  ← run in parallel via asyncio
        │           ├── PM Agent          (haiku)
        │           ├── Lead Engineer     (sonnet)
        │           ├── Backend Dev       (haiku)
        │           ├── Frontend Dev      (haiku)
        │           └── QA Engineer       (haiku)
        └── CPOAgent    (claude-sonnet-4-5) — issues marketing briefs
              └── [mkt_1, mkt_2, ...]  ← run in parallel via asyncio
                    ├── PM Agent          (haiku)
                    ├── Content Lead      (sonnet)
                    ├── SEO Specialist    (haiku)
                    └── Marketing Analyst (haiku)

Every output → QualityGateAgent (sonnet) → score 1-10 → deliver / redo / escalate

Schedulers:
  - Telegram updates:    every 15 min
  - Sales team:          daily at 9am
  - Weekly Win email:    Friday 5pm UTC
```

---

## Cost optimization (built-in)

- **Model routing**: Haiku (5x cheaper) for simple agents; Sonnet only for complex decisions
- **Prompt caching**: System prompts cached — 90% off on repeat calls
- **Daily kill switch**: Hard stops at `DAILY_BUDGET_USD`, warns at `ALERT_THRESHOLD_USD`
- **GPT-4o fallback**: Switches silently if Claude API is down — never surfaces to customer

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `credentials.json not found` | Download from Google Cloud Console → place in project root |
| Telegram bot not responding | Verify `TELEGRAM_BOT_TOKEN` and send `/start` to your bot first |
| `BudgetExceededError` | Budget already spent today — resumes automatically at midnight UTC |
| Twitter API fails | Ensure Elevated Access is approved and all 5 credentials are correct |
| `ModuleNotFoundError: crewai` | Run `pip install -r requirements.txt` |
| Quality gate always scoring low | Check `ANTHROPIC_API_KEY` is valid — fallback to GPT-4o may be scoring differently |

---

## File structure

```
itappens.ai/
├── main.py                    ← Start here
├── requirements.txt
├── .env.example               ← Copy to .env
├── orchestration/             ← CEO, CTO, CPO agents
├── teams/                     ← Engineering, Marketing, Sales crews
├── quality/                   ← Quality Gate + rubrics
├── customer/                  ← Brain, Onboarding, Weekly Win, Exit, Referral
├── dashboard/                 ← FastAPI backend + React frontend
├── tools/                     ← Gmail, Twitter, GitHub, Code Executor
├── cost/                      ← AutoRouter + CostTracker
├── memory/                    ← sprint_board.json + customer_brains/
└── telegram_bot/              ← 15-min reporter
```
