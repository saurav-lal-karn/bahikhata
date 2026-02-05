# Bahikhata Deployment Guide

This document describes how to deploy Bahikhata online **for free**, including the current stack (Frontend, Go Backend, PostgreSQL) and the **future Python AI server** for LLM/OCR features.

---

## 1. Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js       │     │   Go (Gin)      │     │   Python        │
│   Frontend      │────▶│   Backend API   │────▶│   AI Server     │
│   (Vercel etc.) │     │ (Render/Fly.io) │     │ (Fly.io etc.)   │
└─────────────────┘     └────────┬────────┘     └────────┬────────┘
                                 │                       │
                                 │                       │ OpenAI / Gemini
                                 ▼                       │ API keys
                        ┌─────────────────┐              ▼
                        │   PostgreSQL    │     ┌─────────────────┐
                        │   (Neon etc.)   │     │   LLM APIs      │
                        └─────────────────┘     └─────────────────┘
```

- **Frontend**: Next.js 15 — serves the UI, calls the Go backend API.
- **Backend (Go)**: Gin API — auth, families, transactions, wallets, etc. Talks to PostgreSQL and (when built) to the AI server.
- **PostgreSQL**: Database for all app data.
- **AI Server (Python)** *(planned)*: Separate service that calls LLM APIs (OpenAI, Google Gemini, etc.) for OCR, document chat, and insights. The Go backend will call this service over HTTP.

---

## 2. Free Deployment Options (Summary)

| Component        | Single-service option  | Multiple-services option (Backend + AI) |
|-----------------|-------------------------|------------------------------------------|
| **Frontend**    | Vercel                  | Vercel, Netlify, Cloudflare Pages       |
| **Go Backend**  | Render                  | **Fly.io**, Google Cloud Run            |
| **PostgreSQL**  | Neon                    | Neon, Supabase                          |
| **Python AI**   | *(Render allows only 1 free service)* | **Fly.io**, Google Cloud Run, Koyeb |

**Render limitation**: On the free tier, Render allows **only one web service per account**. You cannot run both the Go backend and the Python AI server on Render for free. Use one of the alternatives below if you need multiple backends (e.g. Go API + Python AI) in the same account.

---

## 3. Alternatives When You Need Multiple Projects (Backend + AI Server)

If you want to run **both** the Go backend and the Python AI server for free, use a platform that allows multiple apps/services:

| Platform           | Free allowance              | Multiple projects? | Notes |
|--------------------|-----------------------------|--------------------|-------|
| **Fly.io**         | ~$5/month credit (ongoing)  | Yes                | Separate “app” per service (Go + Python). Can run 2–3 small VMs + optional Postgres. No spin-down. |
| **Google Cloud Run**| Free tier by requests/compute | Yes             | Each service is a separate deployment. Pay-only beyond free tier. |
| **Koyeb**          | 1 web service + 1 DB (free) | Limited            | Free tier is tight; check current limits for multiple services. |
| **Render**         | 1 free web service         | No                 | Only one backend per free account. Use for either Go or Python, not both. |

**Recommended for Backend + AI**: **Fly.io** — create one Fly app for the Go backend and another for the Python AI server; both share the same free credit and stay up 24/7 within the allowance. See **section 5a** for Fly.io steps.

---

## 4. Step 1: Deploy PostgreSQL (Neon)

1. Sign up at [neon.tech](https://neon.tech) and create a new project.
2. Note the **connection string** (e.g. `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`).
3. From it, extract:
   - `DB_HOSTNAME` (e.g. `ep-xxx.region.aws.neon.tech`)
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME` (e.g. `neondb`)
   - `DB_PORT` (usually `5432`)

Neon’s free tier includes a small compute and generous storage; the DB may sleep after inactivity.

---

## 5. Step 2: Deploy Go Backend (Render)

1. In [Render](https://render.com), create a **Web Service**.
2. Connect your Git repo and set:
   - **Root Directory**: `backend`
   - **Runtime**: Go
   - **Build Command**: `go build -o server ./cmd/server`
   - **Start Command**: `./server`
3. Add **Environment Variables** (see section 8). Set `APP_PORT` to the port Render assigns (e.g. `10000`; Render may expose it as `PORT` — use that value for `APP_PORT` so the server binds correctly).
4. After first deploy, run migrations once (see section 9).

**Note**: On the free tier, the service may spin down after ~15 minutes of no traffic; the first request after that can be slow.

---

## 5a. Alternative: Deploy Backend + AI Server on Fly.io (Multiple Projects)

Fly.io gives you **multiple apps** under one account (within ~$5/month free credit). Use this when you want both the Go backend and the Python AI server.

### Fly.io – Go Backend

1. Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/) and sign up: `fly auth signup` (or `fly auth login`).
2. From your repo root:
   ```bash
   cd backend
   fly launch --no-deploy
   ```
   When prompted: choose app name (e.g. `bahikhata-api`), region, and **do not** add Postgres (use Neon instead).
3. Set secrets (env vars):
   ```bash
   fly secrets set APP_HOST=0.0.0.0 APP_PORT=8080
   fly secrets set CLIENT_URL=https://your-app.vercel.app
   fly secrets set APP_URL=https://bahikhata-api.fly.dev
   fly secrets set DB_USER=... DB_PASSWORD=... DB_NAME=... DB_HOSTNAME=... DB_PORT=5432
   fly secrets set ACCESS_KEY=... REFRESH_KEY=...
   ```
4. Ensure the app listens on `PORT` (Fly sets this). In `fly.toml`, set:
   ```toml
   [env]
     PORT = "8080"
   ```
   and in your Go app use `APP_PORT` or `PORT` (see section 8). If your app reads `PORT`, set `APP_PORT` from `PORT` in `fly.toml`: `APP_PORT = "8080"`.
5. Deploy:
   ```bash
   fly deploy
   ```
   Your API will be at `https://bahikhata-api.fly.dev` (or the name you chose).

### Fly.io – Python AI Server (when you add it)

1. In the same Fly account:
   ```bash
   cd ai-server   # or wherever your FastAPI app lives
   fly launch --no-deploy --name bahikhata-ai
   ```
2. Set secrets:
   ```bash
   fly secrets set OPENAI_API_KEY=... GEMINI_API_KEY=...
   ```
3. Deploy:
   ```bash
   fly deploy
   ```
   AI server URL: `https://bahikhata-ai.fly.dev`. Set `AI_SERVER_URL` in the Go backend (Fly secrets or Render env) to this URL.

**Fly.io free tier**: You can run several small VMs (e.g. 256MB) and stay within the monthly credit. Monitor usage in the Fly dashboard.

---

## 6. Step 3: Deploy Frontend (Vercel)

1. Import your repo in [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Next.js** (auto-detected).
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Go backend base URL + `/api`  
     Example: `https://your-backend.onrender.com/api`
5. Deploy. Vercel will assign a URL like `https://your-app.vercel.app`.

**CORS**: Ensure the Go backend’s `CLIENT_URL` is set to this frontend URL (e.g. `https://your-app.vercel.app`) so login and API calls work.

---

## 7. Step 4: Python AI Server (Future)

When you add the AI component:

- **Role**: Call LLM APIs (OpenAI, Gemini, etc.) for OCR, document Q&A, and insights.
- **Interface**: REST (e.g. `/parse-receipt`, `/chat`, `/insights`). The Go backend will call this server over HTTP (internal or public URL).

### 7.1 Hosting the AI Server (Free)

- **Render**: Create a second Web Service from the same repo.
  - Root directory: e.g. `ai-server` (or wherever you put the Python app).
  - Runtime: Python.
  - Build: `pip install -r requirements.txt`.
  - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- **Railway / Fly.io**: Same idea — deploy the Python app and note its public URL.

### 7.2 AI Server Environment Variables (when you build it)

- `OPENAI_API_KEY` or `GEMINI_API_KEY` (or both).
- Optional: `PORT` (Render/Fly set this automatically).

### 7.3 Go Backend → AI Server

- Add to the Go backend config an env var, e.g. `AI_SERVER_URL=https://your-ai-service.onrender.com`.
- From Go, call the AI server with HTTP client (e.g. `net/http` or a small client library). Use the same auth (e.g. pass through user/family context) so the AI only sees allowed data.

### 7.4 Suggested Python AI Server Layout (later)

```text
ai-server/
├── requirements.txt    # fastapi, uvicorn, openai, google-generativeai, etc.
├── app/
│   ├── main.py         # FastAPI app, routes
│   ├── ocr.py          # receipt / document parsing
│   ├── llm.py          # LLM client wrappers
│   └── config.py       # env (API keys, etc.)
```

No code for the AI server is required for the *current* deployment; this section is a blueprint for when you add it.

---

## 8. Environment Variables Checklist

### 8.1 Go Backend (Render)

| Variable           | Description                    | Example                          |
|--------------------|--------------------------------|----------------------------------|
| `APP_HOST`         | Bind host                      | `0.0.0.0`                        |
| `APP_PORT`         | Port (Render sets `PORT`)      | Use `PORT` in start command      |
| `APP_MODE`         | Environment                    | `release`                        |
| `APP_URL`          | Public URL of this backend     | `https://your-backend.onrender.com` |
| `CLIENT_URL`       | Frontend URL (for CORS/invites)| `https://your-app.vercel.app`    |
| `DB_USER`          | PostgreSQL user                | From Neon                        |
| `DB_PASSWORD`      | PostgreSQL password           | From Neon                        |
| `DB_NAME`          | Database name                  | e.g. `neondb`                    |
| `DB_HOSTNAME`      | DB host                        | From Neon                        |
| `DB_PORT`          | DB port                        | `5432`                           |
| `ACCESS_KEY`       | JWT access secret              | Long random string               |
| `REFRESH_KEY`      | JWT refresh secret             | Long random string               |
| `ACCESS_KEY_TTL`   | Access token TTL (seconds)     | `3600`                           |
| `REFRESH_KEY_TTL`  | Refresh token TTL (seconds)    | `86400`                          |
| `AI_SERVER_URL`    | *(Later)* Python AI base URL   | `https://your-ai.onrender.com`    |

**Security**: Generate strong values for `ACCESS_KEY`, `REFRESH_KEY`, and DB password. Do not commit `.env` to Git.

### 8.2 Frontend (Vercel)

| Variable               | Description           | Example                                    |
|------------------------|-----------------------|--------------------------------------------|
| `NEXT_PUBLIC_API_URL`  | Go backend API base   | `https://your-backend.onrender.com/api`     |

### 8.3 AI Server (when added)

| Variable         | Description   | Example        |
|------------------|---------------|----------------|
| `OPENAI_API_KEY` | OpenAI key    | `sk-...`      |
| `GEMINI_API_KEY` | Gemini key    | From Google AI |
| `PORT`           | Server port   | Set by host    |

---

## 9. Running Migrations After Deploy

The Go backend does not run migrations automatically. After the first deploy:

1. **Option A – From your machine**  
   Use the same Neon connection string and run Goose from the `backend` directory:

   ```bash
   cd backend
   goose -dir ./migrations postgres "YOUR_NEON_CONNECTION_STRING" up
   ```

   Alternatively, use the app’s migrate command: `go run cmd/migrate/migrate.go` (with DB env vars set).

2. **Option B – Render Shell**  
   If Render provides a shell, install Goose there and run the same command with the env-based connection string.

3. **Option C – Migrate at startup**  
   You can add a small migration step in the Go server startup (run migrations then start HTTP server). Not included in this repo by default.

---

## 10. Post-Deploy Checklist

- [ ] Backend health: open `https://your-backend.onrender.com/health` (or your health route).
- [ ] Frontend loads and shows login/register.
- [ ] Login and one full flow (e.g. create wallet, add transaction).
- [ ] CORS: no browser errors when calling the API from the Vercel domain.
- [ ] Invite link uses `CLIENT_URL` (check email or copy link).
- [ ] When AI server is added: Go backend can reach `AI_SERVER_URL`; API keys are only in the AI service env.

---

## 11. Optional: Self-Hosted (Docker Compose)

If you later use a free or cheap VPS (e.g. Oracle Free Tier, small Droplet), you can run everything with Docker:

- **Frontend**: Build Next.js and serve with Node or nginx.
- **Backend**: Single Dockerfile that builds the Go binary and runs it.
- **PostgreSQL**: Official Postgres image.
- **AI server**: Python image with FastAPI/uvicorn.

A single `docker-compose.yml` can define all four services and env files. This is not “free hosting” but keeps the same architecture and makes the AI server a normal internal service (e.g. `http://ai-server:8000`).

---

## 12. Summary

**Single backend (Render):**

| Step | Component   | Where      | What you set                                      |
|------|-------------|------------|----------------------------------------------------|
| 1    | PostgreSQL  | Neon       | Create project, copy connection params            |
| 2    | Go Backend  | Render     | Build/start, env vars (DB, JWT, CLIENT_URL)       |
| 3    | Frontend    | Vercel     | Root `frontend`, `NEXT_PUBLIC_API_URL`             |
| 4    | Migrations  | Once       | Run Goose against Neon DB                          |
| 5    | AI Server   | —          | Render free tier allows only 1 service; use Fly.io for a second backend |

**Multiple backends (Go + Python AI) – use Fly.io:**

| Step | Component   | Where      | What you set                                      |
|------|-------------|------------|----------------------------------------------------|
| 1    | PostgreSQL  | Neon       | As above                                           |
| 2    | Go Backend  | Fly.io     | `fly launch` in `backend`, secrets (DB, JWT, CLIENT_URL) |
| 3    | Frontend    | Vercel     | `NEXT_PUBLIC_API_URL` = Fly backend URL             |
| 4    | Migrations  | Once       | Run Goose against Neon DB                          |
| 5    | AI Server   | Fly.io     | Second Fly app (e.g. `bahikhata-ai`); set `AI_SERVER_URL` on Go backend |

Using the free tiers above, you can run Bahikhata online at no cost. For both the Go API and the Python AI server, use **Fly.io** (or Google Cloud Run); **Render** is limited to one free web service per account.
