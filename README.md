# Smart Expense Tracker

A logic-driven expense tracker (no AI) with rule-based categorization, spending trends, alerts, and graphs. Fully responsive.

**Stack:** React + Vite + Chart.js (client) · Node + Express + MongoDB/Mongoose (server)

## Project structure

```
Smart Expense/
├── client/   React + Vite + Chart.js frontend
└── server/   Node + Express + MongoDB API
```

## Quick start

### 1. Server

```bash
cd server
npm install
cp .env.example .env       # then edit MONGO_URI if needed
npm run dev                # http://localhost:5000
```

Edit `.env` and set `MONGO_URI` to your MongoDB connection string (a local MongoDB instance or a MongoDB Atlas cluster).

### 2. Client

```bash
cd client
npm install
npm run dev                # http://localhost:5173
```

The Vite dev server proxies `/api/*` to the backend automatically.

## Features

- **Rule-based categorization** — keyword rules (Food, Transport, Bills, etc.) auto-tag expenses; manual override available.
- **Spending trends** — switchable 7/30/90-day line chart.
- **Category breakdown** — doughnut chart of spend by category.
- **Alerts** — when monthly category spend hits 80 % / 100 % of budget.
- **Budgets** — per-category monthly budgets, persisted in MongoDB.
- **Responsive** — mobile-first layout, hamburger nav, fluid grid.

## API

| Method | Endpoint                | Purpose                       |
|-------:|-------------------------|-------------------------------|
| GET    | `/api/expenses`         | List all expenses             |
| POST   | `/api/expenses`         | Create expense (auto-categorized if no category) |
| PUT    | `/api/expenses/:id`     | Update expense                |
| DELETE | `/api/expenses/:id`     | Delete expense                |
| GET    | `/api/budgets`          | List budgets                  |
| PUT    | `/api/budgets/:category`| Upsert budget for category    |

## Deployment (free tier)

This is a one-time setup. Backend goes on **Render**, frontend on **Vercel**, database is **Atlas**.

### 0. Push the project to GitHub

```bash
cd "Smart Expense"
git init
git add .
git commit -m "Initial commit"
git branch -M main
# Create a new empty repo on github.com first, then:
git remote add origin https://github.com/<your-username>/smart-expense.git
git push -u origin main
```

### 1. Backend on Render

1. Go to https://render.com and sign in with GitHub.
2. **New → Web Service** → connect your repo.
3. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. **Environment Variables:**
   - `MONGO_URI` = your Atlas connection string (with `/smart-expense` database)
   - `CLIENT_ORIGIN` = (leave blank for now — fill in after step 2)
5. Click **Create Web Service**. Wait for deploy. Note the URL, e.g. `https://smart-expense-api.onrender.com`.

### 2. Frontend on Vercel

1. Go to https://vercel.com and sign in with GitHub.
2. **Add New → Project** → import your repo.
3. Settings:
   - **Root Directory:** `client`
   - Framework preset: **Vite** (auto-detected)
4. **Environment Variables:**
   - `VITE_API_URL` = your Render backend URL from step 1
5. Click **Deploy**. Note the URL, e.g. `https://smart-expense.vercel.app`.

### 3. Update Render with the frontend URL

Back in Render → your service → **Environment** → set:
- `CLIENT_ORIGIN` = `https://smart-expense.vercel.app`

Click **Save** — Render will redeploy. Done. Visit your Vercel URL.

### Notes

- The Render free tier sleeps after 15 minutes of inactivity. The first request after a sleep takes ~30 seconds to cold-start.
- For multiple frontends (e.g. preview deploys), set `CLIENT_ORIGIN` to a comma-separated list.
- Atlas Network Access must include `0.0.0.0/0` (or Render's outbound IPs) for the connection to work.
