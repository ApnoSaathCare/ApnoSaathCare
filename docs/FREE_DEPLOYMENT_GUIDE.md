# Free Cloud Deployment Guide for AapnoSaath Care

This guide walks you through deploying the complete full-stack **AapnoSaath Care** application (Angular Frontend + NestJS Backend + Cloud PostgreSQL) 100% free with SSL and continuous deployment from GitHub.

---

## Architecture Overview

```
                      +-----------------------------+
                      |       Users / Clients       |
                      +--------------+--------------+
                                     |
                +--------------------+--------------------+
                |                                         |
     (Frontend Static App)                     (Backend REST API)
     Vercel / Render Static                   Render Web Service
     https://aapnosaath.vercel.app            https://aapnosaath-api.onrender.com
                |                                         |
                +-----------------------------------------+
                                     |
                         (Free Cloud PostgreSQL)
                         Neon.tech / Supabase
```

---

## Step 1: Free Cloud Database (Neon.tech - Recommended)

[Neon](https://neon.tech) offers a free, serverless PostgreSQL database that never expires and requires no credit card.

1. Go to [https://neon.tech](https://neon.tech) and sign up with your GitHub account.
2. Click **Create Project**:
   - **Name**: `aapnosaath-db`
   - **Database Name**: `neondb` (default)
   - **Region**: Choose the closest region (e.g., `Singapore` or `Frankfurt`).
3. In your Neon dashboard, copy the **Connection String**. It looks like:
   ```text
   postgresql://user:password@ep-cool-flower-12345.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Save this connection string for Step 2.

> **Note**: You do not need to manually create tables! The NestJS backend is configured to automatically generate all tables and seed the initial service plans and Vadodara coverage areas on its first startup.

---

## Step 2: Deploy Backend (Render.com - Free Web Service)

Render provides free hosting for Node.js / NestJS web services.

1. Go to [https://render.com](https://render.com) and log in with your GitHub account.
2. Click **New +** -> **Web Service**.
3. Select your repository: `ApnoSaathCare/ApnoSaathCare`.
4. Configure the service settings:
   - **Name**: `aapnosaath-backend`
   - **Region**: Choose closest to database (e.g., `Singapore` or `Frankfurt`).
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install --include=dev && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and add:
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `DB_TYPE` | `postgres` |
   | `DATABASE_URL` | *(Paste connection string from Step 1)* |
   | `DB_SYNCHRONIZE` | `true` |
   | `CORS_ORIGIN` | `*` *(or your frontend URL after Step 3)* |
6. Click **Deploy Web Service**.
7. Once deployment finishes, Render will provide your backend URL:
   `https://aapnosaath-backend.onrender.com`
8. Verify it by visiting:
   - Health check: `https://aapnosaath-backend.onrender.com/api/v1/health`
   - Interactive Swagger docs: `https://aapnosaath-backend.onrender.com/api/docs`

---

## Step 3: Deploy Frontend (Vercel or Render Static Site)

### Option A: Vercel (Recommended - Fastest Global CDN)

1. Go to [https://vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New...** -> **Project**.
3. Import `ApnoSaathCare/ApnoSaathCare`.
4. In the Project Configuration:
   - **Root Directory**: Click `Edit` and select `frontend`.
   - **Framework Preset**: Angular (detected automatically).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/frontend/browser`
5. Click **Deploy**.
6. Vercel will build and assign your free live URL: `https://aapnosaath-care.vercel.app`.

### Option B: Render Static Site (All on Render)

If you prefer keeping frontend and backend under one dashboard:
1. In Render, click **New +** -> **Static Site**.
2. Connect your repository.
3. Settings:
   - **Name**: `aapnosaath-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist/frontend/browser`
4. In **Redirects / Rewrites**, add:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
5. Click **Create Static Site**.

---

## Step 4: Connecting Frontend to Your Live Backend

Once your backend is live on Render (e.g. `https://aapnosaath-backend.onrender.com`):

1. Update `frontend/src/environments/environment.prod.ts`:
   ```ts
   export const environment = {
     production: true,
     apiUrl: 'https://aapnosaath-backend.onrender.com/api/v1',
   };
   ```
2. Commit and push:
   ```bash
   git add frontend/src/environments/environment.prod.ts
   git commit -m "Configure production backend URL"
   git push origin main
   ```
3. Vercel / Render will automatically rebuild and deploy within 60 seconds!

---

## Verification Checklist

- [ ] **Home Page Loads**: Banner, hero, and stats display cleanly.
- [ ] **Service Plans**: Loaded from database API (`/api/v1/services`).
- [ ] **Service Area Checker**: Test Vadodara localities (e.g., "Alkapuri", "390007") returns instant coverage confirmation.
- [ ] **Consultation & Enquiry Submission**: Submit a test inquiry on `/contact`; check that it returns a unique reference number (e.g. `ASC-ENQ-XXXXXX`).
- [ ] **Swagger Documentation**: Accessible at `https://aapnosaath-backend.onrender.com/api/docs`.
