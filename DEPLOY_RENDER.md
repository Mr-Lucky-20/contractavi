# How to Deploy This Project on Render for FREE (Zero Cost Guide)

This guide walks you through deploying your **Hyperlocal Construction Marketplace (Chhattisgarh Edition)** to **[Render.com](https://render.com)** completely free forever, with **free hosting**, **free SSL (HTTPS)**, and **free MongoDB Atlas database**.

---

## Architecture Overview (Render Free Tier)

```
                       +-----------------------------------+
                       |         Render Web Service        |
                       |    (Free 750 hours/mo, Free SSL)  |
                       |   https://struct-cg.onrender.com  |
                       +-----------------+-----------------+
                                         |
                       +-----------------+-----------------+
                       |                                   |
                       v                                   v
             [Express API Server]                [Vite React Frontend]
             - /api/vendors                      - Static Build (dist)
             - /api/auth                         - SPA Fallback Route
             - /api/inventory                    - Digital Blueprint UI
                       |
                       v
       +-----------------------------------+
       |     MongoDB Atlas (M0 Shared)     |
       |      100% Free Forever (512MB)    |
       |     2dsphere Spatial Indexing     |
       +-----------------------------------+
```

By unifying the backend Express API and the compiled React frontend into a **single Render Web Service**, you only use **1 free service**, fitting 100% within Render's free tier limits without requiring any credit card!

---

## Step 1: Set Up Free MongoDB Database (MongoDB Atlas)
*(Takes ~3 minutes, 100% Free forever)*

1. Go to **[mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)** and create a free account.
2. Select **M0 Free** (Shared cluster, 512 MB storage).
3. Select Cloud Provider: **AWS** and Region: **Mumbai (ap-south-1)** for lowest latency to Chhattisgarh and India.
4. **Security - Database User**:
   - Create a username (e.g. `admin`) and a password (e.g. `StrongPass123!`).
   - *Save these credentials!*
5. **Security - Network Access**:
   - Go to **Network Access** tab in the sidebar.
   - Click **Add IP Address** -> Select **Allow Access from Anywhere (`0.0.0.0/0`)** (required so Render cloud servers can connect).
6. **Get Connection String**:
   - Go to **Database** -> Click **Connect** on your cluster.
   - Choose **Drivers** (Node.js).
   - Copy the connection string:
     ```
     mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/hyperlocal_construction?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your database user password.

> **Note:** If you do not provide a `MONGODB_URI`, our backend automatically launches an embedded in-memory database with pre-seeded Chhattisgarh suppliers and materials out-of-the-box!

---

## Step 2: Push Your Code to GitHub

Open your terminal in `d:\avishkar`:

```bash
# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Commit
git commit -m "feat: Hyperlocal Construction Marketplace Chhattisgarh Edition with Render config"

# Create a new repository on https://github.com/new (public or private)
# Then link and push:
git remote add origin https://github.com/YOUR_USERNAME/hyperlocal-construction-marketplace.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Render (Method A: 1-Click Blueprint - Fastest)

We have already configured `render.yaml` in the project root!

1. Sign up or log in to **[render.com](https://render.com)** (you can sign in with GitHub).
2. On your Render Dashboard, click **New +** (top right) -> Select **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect `render.yaml`:
   - Service Name: `struct-chhattisgarh-marketplace`
   - Region: `Singapore`
   - Plan: `Free`
5. Render will ask for your environment variables:
   - **`MONGODB_URI`**: Paste your MongoDB Atlas connection string from Step 1.
   - Click **Apply**.
6. Render will automatically build the frontend, install backend packages, and launch your live site!

---

## Step 3 (Alternative): Manual Setup on Render (Method B)

If you prefer setting up manually without Blueprint:

1. On the Render Dashboard, click **New +** -> **Web Service**.
2. Select your GitHub repository.
3. Configure the following fields:
   - **Name**: `struct-chhattisgarh-marketplace`
   - **Region**: `Singapore` (or Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: *(leave blank)*
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm run render-build
     ```
   - **Start Command**: 
     ```bash
     cd backend && npm start
     ```
   - **Instance Type**: `Free` ($0/month)
4. Scroll down to **Environment Variables** -> Click **Add Environment Variable**:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `JWT_SECRET` = `super_secret_jwt_key_chhattisgarh_2026`
   - `MONGODB_URI` = `mongodb+srv://admin:StrongPass123!@cluster0.abcde.mongodb.net/hyperlocal_construction?retryWrites=true&w=majority`
5. Click **Create Web Service**.

---

## Step 4: Verification & Live Link

1. Render will stream the build logs:
   - Installing dependencies
   - Building Vite React client (`✓ built in 27s`)
   - Starting Express server on port `10000`
   - Output: `[SERVER] Hyperlocal Construction Marketplace API Running on port 10000`
2. Once deployed, Render will display your public URL at the top:
   ```
   https://struct-chhattisgarh-marketplace.onrender.com
   ```
3. Open this link in your browser to explore the live Chhattisgarh Construction Marketplace!

---

## Important Render Free Tier Tips

1. **Cold Starts (Spin-down after inactivity)**:
   - On the Free tier, Render automatically spins down services after **15 minutes** of no traffic to save computing resources.
   - When someone visits your URL after it went to sleep, it takes **~30 to 50 seconds** to wake up. This is completely normal on Render's free tier.
   - Once awake, all requests respond instantly.
2. **Pre-Seeded Accounts Ready to Test**:
   - When the server boots for the first time, it automatically populates the database with certified Chhattisgarh yards in Bhilai, Bilaspur, Raipur, Korba, and Raigarh!
   - You can log into the Supplier Hub with:
     - **Email**: `bhilai.steel@example.com`
     - **Password**: `password123`
     *(Or `mahanadi.materials@example.com` / `password123`)*
