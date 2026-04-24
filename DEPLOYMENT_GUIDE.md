# Student Twin — Free Deployment Guide
## Deploy Frontend + Backend + Database for $0

---

## Overview

| Service | Platform | Free Tier | URL |
|---|---|---|---|
| **Frontend** | Vercel | Unlimited static sites | `student-twin.vercel.app` |
| **Backend API** | Render | 750hrs/month + 512MB RAM | `student-twin-api.onrender.com` |
| **Database** | Render PostgreSQL | 1GB storage | Internal only |

**Total Cost: $0**

---

## Step 1: Prepare Your Code for Production

### 1.1 Update API Base URL (Dynamic)

Edit `frontend/src/services/api.js`:

```javascript
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE,
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
```

### 1.2 Create Environment Files

Create `frontend/.env.production`:
```
VITE_API_URL=https://student-twin-api.onrender.com/api
```

Create `frontend/.env.local` (for local dev):
```
VITE_API_URL=http://localhost:5000/api
```

### 1.3 Update CORS in Backend

Edit `backend/src/app.js`, update CORS origin:

```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://student-twin.vercel.app",
  "https://student-twin-git-main-afhammirza1.vercel.app", // preview URLs
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
```

### 1.4 Add Production Start Script

In `backend/package.json`, ensure you have:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

### 1.5 Create `backend/vercel.json` (Skip — backend goes to Render)

---

## Step 2: Deploy Backend + Database (Render)

### 2.1 Sign Up
Go to https://render.com and sign up with GitHub.

### 2.2 Create PostgreSQL Database
1. Dashboard → **New** → **PostgreSQL**
2. Name: `student-twin-db`
3. Region: `Singapore` (closest to India)
4. Plan: **Free**
5. Click **Create Database**
6. Copy the **Internal Database URL** (looks like: `postgresql://user:pass@host:5432/dbname`)

### 2.3 Update Backend Environment Variables

Create `backend/.env` (already exists, update it):
```
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/dbname  ← paste from Render
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
FRONTEND_URL=https://student-twin.vercel.app
OPENAI_API_KEY=sk-your-openai-key
```

### 2.4 Create Web Service on Render
1. Dashboard → **New** → **Web Service**
2. Connect your GitHub repo: `Afhammirza1/student_twin`
3. Name: `student-twin-api`
4. Region: `Singapore`
5. Branch: `main`
6. Root Directory: `backend`
7. Runtime: `Node`
8. Build Command: `npm install`
9. Start Command: `npm start`
10. Plan: **Free**
11. Click **Create Web Service**

### 2.4 Add Environment Variables on Render
Go to your web service → **Environment** → Add:
- `DATABASE_URL` = your PostgreSQL internal URL
- `JWT_SECRET` = generate a random string (run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `FRONTEND_URL` = `https://student-twin.vercel.app`
- `OPENAI_API_KEY` = your OpenAI API key

### 2.5 Deploy!
Render will auto-deploy on every `git push`.

**Your API URL:** `https://student-twin-api.onrender.com`

---

## Step 3: Deploy Frontend (Vercel)

### 3.1 Sign Up
Go to https://vercel.com and sign up with GitHub.

### 3.2 Import Project
1. Click **Add New...** → **Project**
2. Import `Afhammirza1/student_twin`
3. Configure:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Environment Variables:
   - `VITE_API_URL` = `https://student-twin-api.onrender.com/api`
5. Click **Deploy**

### 3.3 Update Vercel Domain
1. Go to project settings → **Domains**
2. Your default domain: `student-twin.vercel.app`
3. (Optional) Add custom domain in future

---

## Step 4: Initialize Database

### 4.1 Run Migrations on Render
Render PostgreSQL starts empty. You need to create tables.

Option A: **Render Shell** (easiest)
1. Go to your PostgreSQL dashboard on Render
2. Click **Shell** tab
3. Run your SQL files:

```sql
-- Paste contents of backend/database.sql (your schema)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ... rest of your schema

-- Add unique constraint
ALTER TABLE skills ADD CONSTRAINT skills_name_unique UNIQUE (name);
```

Option B: **Local psql with Render External URL**
```bash
psql "postgresql://user:pass@host:5432/dbname" < backend/database.sql
```

### 4.2 Verify Connection
Your backend should auto-connect on next deploy. Check Render logs for:
```
Database connected successfully
```

---

## Step 5: Final Verification Checklist

| Check | Command / Action | Expected Result |
|---|---|---|
| Backend running | `curl https://student-twin-api.onrender.com/` | `"API running..."` |
| Frontend loads | Open `https://student-twin.vercel.app` | Login page shows |
| Register user | Fill signup form | Success toast, redirect to dashboard |
| Add skill | Add "React", level 5 | Skill saved, chart updates |
| AI Roadmap | Enter "Full Stack Developer" | 30-day plan generated |
| CORS working | Browser DevTools → Network | No CORS errors |

---

## Troubleshooting

### CORS Error
```
Access to fetch blocked by CORS policy
```
**Fix:** Add your Vercel preview URL to `allowedOrigins` in `backend/src/app.js`:
```javascript
"https://student-twin-git-main-afhammirza1.vercel.app"
```

### Database Connection Error
```
ECONNREFUSED database
```
**Fix:** Check `DATABASE_URL` env var on Render. Must use **Internal URL**, not External.

### Frontend Shows "Cannot GET /dashboard"
**Fix:** Add `vercel.json` to `frontend/`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### API Slow (5+ seconds)
**Cause:** Render free tier spins down after 15 min inactivity.
**Fix:** Use Render paid tier ($7/mo) or add UptimeRobot ping every 10 min.

---

## Alternative Free Platforms

| Platform | Best For | Free Tier |
|---|---|---|
| **Railway** | Full-stack (frontend + backend + DB) | $5/mo credit (~1 month free) |
| **Fly.io** | Docker containers | 3 shared-cpu-1m 256mb VMs |
| **Supabase** | Database + Auth + Storage | 2 databases, 500MB storage |
| **Neon** | Serverless PostgreSQL | 3 projects, 500MB storage |
| **Cyclic** | Full-stack Node.js | 1 app, 10,000 requests/month |

---

## Custom Domain (Free Options)

| Provider | Free Domain | SSL | Notes |
|---|---|---|---|
| **Freenom** | `.tk`, `.ml`, `.ga` | ❌ | Often blocked by networks |
| **GitHub Student Pack** | `.me` via Namecheap | ✅ | Best option if you're a student |
| **Vercel Subdomain** | `.vercel.app` | ✅ | Professional, instant |
| **Render Subdomain** | `.onrender.com` | ✅ | Professional, instant |

### Student Pack (Recommended)
If you have `.edu` email:
1. https://education.github.com/pack
2. Get free Namecheap domain + SSL
3. Point to Vercel/Render

---

## Quick Start Commands

```bash
# 1. Push latest code
git add .
git commit -m "Production ready"
git push origin main

# 2. Backend auto-deploys on Render

# 3. Frontend auto-deploys on Vercel

# 4. Visit your live app:
# https://student-twin.vercel.app
```

---

**Status:** Ready to deploy 🚀

**Estimated Time:** 30 minutes

**Cost:** $0/month
