# 🚀 itappens.ai — Deployment Checklist

Your code is now containerized and version-controlled. Follow these steps to take **itappens.ai** from your local machine to the global cloud.

---

## 🛠️ Step 1: Create a Private GitHub Repository
1.  Go to [github.com/new](https://github.com/new).
2.  **Name**: `itappens-ai`
3.  **Privacy**: Set to **Private** (Crucial: even with .gitignore, it's safer).
4.  Run these commands in your local terminal:
    ```powershell
    git remote add origin https://github.com/YOUR_USERNAME/itappens-ai.git
    git branch -M main
    git push -u origin main
    ```

---

## ☁️ Step 2: Deploy Backend to Render.com
1.  Log into [Render.com](https://render.com).
2.  **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  **Runtime**: `Python 3`.
5.  **Build Command**: `pip install -r requirements.txt`.
6.  **Start Command**: `python main.py`.
7.  **Environment Variables**: Add every key from your `.env`:
    *   `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
    *   `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`
    *   `GOOGLE_API_KEY`, `GROQ_API_KEY` (Important for the Dynamic Brain)

---

## 🎨 Step 3: Deploy Dashboard to Vercel
1.  Go to [Vercel.com](https://vercel.com).
2.  **Add New Project** -> Import your GitHub repo.
3.  **Root Directory**: Select the `dashboard/` folder.
4.  **Framework**: It should auto-detect Next.js/React.
5.  Click **Deploy**.

---

## 🧪 Step 4: Final Test
1.  Once Render says "Live", send a message to your Telegram Bot.
2.  Check if you get the startup notification.
3.  Try replying to an agent's question to verify the **Human-in-the-Loop** connection.

---

### ✅ Checklist Complete
*   [x] Git Initialized
*   [x] .gitignore created
*   [x] First commit finished
*   [ ] Push to GitHub
*   [ ] Connect to Render
*   [ ] Connect to Vercel

*“itappens.ai: The last team you’ll ever hire.”*
