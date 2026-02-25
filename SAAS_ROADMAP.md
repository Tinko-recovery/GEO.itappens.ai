# 🛣️ itappens.ai — SaaS Roadmap (2026-2027)

Turning itappens.ai from a local multi-agent system into a world-class SaaS AI service.

---

## 🏗️ Phase 1: The Core Foundation (Month 1)
*Moving from local scripts to a scalable platform.*

### 1. Database & State Management
*   **Current State:** Local JSON files (`storage/`, `memory/`).
*   **Target:** Managed PostgreSQL (e.g., **Supabase** or **Neon**).
*   **Action:** Migrate the `CustomerBrain` and `SprintBoard` to SQL tables. This allows multiple companies to run simultaneously without file locks.

### 2. User Authentication
*   **Target:** **Clerk** or **Auth0**.
*   **Function:** Allow founders to sign up, verify their emails, and log into their private dashboard.

### 3. API & Webhooks
*   **Target:** FastAPI (already started in `dashboard/`).
*   **Function:** Create a robust REST API so the frontend and agents can talk securely.

---

## 💳 Phase 2: Productization & Payments (Month 2)
*Automating revenue and subscription management.*

### 1. Stripe Integration
*   **Tiers:**
    *   **Seed ($199/mo):** 1 Mission/mo, 1 Eng Team, 1 Mkt Team.
    *   **Growth ($497/mo):** 4 Missions/mo, 2 Eng Teams, 2 Mkt Teams.
    *   **Scale ($997/mo):** Unlimited Missions, 4 Eng Teams, 4 Mkt Teams + Dedicated Sales.
*   **Action:** Implement Stripe Webhooks to unlock "Sprints" only after payment is confirmed.

### 2. The Founder Dashboard
*   **Tech:** Next.js + TailwindCSS.
*   **Features:**
    *   Real-time "Mission Control" (Live logs of what agents are doing).
    *   Feedback loop (Approve/Reject agent outputs).
    *   Cost/Usage analytics.

---

## ☁️ Phase 3: Scaling & Cloud Infrastructure (Month 3)
*Handling heavy AI workloads without crashes.*

### 1. Task Queues (The Brain)
*   **Tech:** **Redis + Celery** or **Inngest**.
*   **Why:** AI sprints take 10+ minutes. We cannot run them in the request/response cycle. Sprints must be "Jobs" that run in the background on worker servers.

### 2. Cloud Deployment
*   **Web Server:** Render or Vercel.
*   **AI Workers:** **DigitalOcean Droplets** or **AWS EC2**. Workers need stable Python environments and enough RAM for the long-running `asyncio` loops.

---

## 🚀 Phase 4: Launch & GTM (Month 4+)
*Getting itappens.ai into the hands of founders.*

### 1. Domain Configuration
*   Point `www.itappens.ai` to your Next.js frontend (Vercel).
*   Configure `api.itappens.ai` for the backend.

### 2. Dogfooding (The AI Sales Team)
*   Activate the `SalesTeam` from `teams/team_factory.py`.
*   Let the AI find leads on Twitter/X, cold email them, and book demos on your Calendly.

### 3. Quality Gate 2.0
*   Implement human-in-the-loop (HITL) where you (The Founder) approve the final delivery before the customer sees it.

---

## 🛠️ Immediate "Pushing" Checklist
1. [ ] **Git Init:** `git init` -> `git remote add origin ...`.
2. [ ] **Github Actions:** Set up a CI/CD pipeline to auto-deploy to Render.
3. [ ] **Environment Secrecy:** Ensure `.env` is in `.gitignore`. Use **AWS Secrets Manager** or Render Env Vars.
4. [ ] **Vercel Setup:** Connect your GitHub repo to Vercel for the frontend.

---

*“itappens.ai: The last team you’ll ever hire.”*
