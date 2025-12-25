# PaperTalks Deployment Guide

Production deployment using Vercel + Supabase + Cloudflare + Bunny.net

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   CLOUDFLARE (CDN + WAF)                    │
│                   └── R2 Storage (PDFs)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     VERCEL (Next.js 14)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   SSR/ISR    │  │  API Routes  │  │ Edge Runtime │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
         │                    │                    
         ▼                    ▼                    
┌─────────────┐      ┌─────────────┐      
│  SUPABASE   │      │ BUNNY.NET   │      
│  Database   │      │   Stream    │      
│  Auth       │      │  (Videos)   │      
│  Realtime   │      │             │      
└─────────────┘      └─────────────┘      
```

## 📋 Pre-Deployment Checklist

- [ ] Supabase project created (Pro plan: $25/mo)
- [ ] Vercel account ready (Pro plan: $20/mo)
- [ ] Cloudflare account with R2 enabled (Free tier)
- [ ] Bunny.net account with Stream library (Pay-as-you-go)
- [ ] Domain configured (optional but recommended)

---

## 1️⃣ Supabase Setup

### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project (select region closest to users)
3. Wait for project to initialize

### Run Database Schema
```bash
# In Supabase SQL Editor, run:
# Contents of supabase/schema.sql
```

### Configure Authentication
1. **Settings → Authentication → URL Configuration**
   - Site URL: `https://papertalks.com`
   - Redirect URLs:
     - `https://papertalks.com/auth/callback`
     - `http://localhost:3000/auth/callback` (for dev)

2. **Enable OAuth Providers**
   - Google: Add client ID & secret
   - ORCID: Add client ID & secret (for researcher auth)

### Get Credentials
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 2️⃣ Vercel Deployment

### Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select `papertalks` as root directory

### Configure Build Settings
```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudflare R2
CLOUDFLARE_R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_key
CLOUDFLARE_R2_BUCKET_NAME=papertalks
CLOUDFLARE_R2_PUBLIC_URL=https://storage.papertalks.com

# Bunny.net Stream
BUNNY_STREAM_API_KEY=your_bunny_api_key
BUNNY_STREAM_LIBRARY_ID=your_library_id
BUNNY_STREAM_PULL_ZONE=vz-xxxxxx

# Optional: External APIs
CROSSREF_API_EMAIL=your@email.com
SEMANTIC_SCHOLAR_API_KEY=your_key
```

### Deploy
```bash
# Push to main branch triggers auto-deploy
git push origin main
```

---

## 3️⃣ Cloudflare R2 Setup

### Create R2 Bucket
1. Cloudflare Dashboard → R2 → Create Bucket
2. Name: `papertalks`
3. Location: Auto (or select region)

### Create API Token
1. R2 → Manage R2 API Tokens → Create API Token
2. Permissions: Object Read & Write
3. Specify bucket: `papertalks`
4. Copy Access Key ID and Secret Access Key

### Configure Public Access (Optional)
For public files (thumbnails, avatars):
1. Bucket Settings → Public Access → Enable
2. Or use Cloudflare CDN with custom domain

### Custom Domain (Recommended)
1. Add CNAME: `storage.papertalks.com` → `YOUR_BUCKET.r2.cloudflarestorage.com`
2. Enable Cloudflare proxy for caching

---

## 4️⃣ Bunny.net Stream Setup

### Create Stream Library
1. Go to [bunny.net](https://bunny.net) → Stream
2. Create new Video Library
3. Name: `papertalks-videos`
4. Select closest region

### Get API Credentials
1. Library Settings → API
2. Copy:
   - API Key
   - Library ID
   - Pull Zone hostname

### Configure Settings
- **Encoding**: 720p, 1080p (balance quality/cost)
- **Player**: Enable chapters, captions
- **Security**: Enable signed URLs for private videos

---

## 5️⃣ Domain & DNS Setup

### Recommended DNS Configuration
```
# Vercel (main app)
papertalks.com          A      76.76.21.21
www.papertalks.com      CNAME  cname.vercel-dns.com

# Cloudflare R2 (storage)
storage.papertalks.com  CNAME  papertalks.r2.cloudflarestorage.com

# (Optional) Separate video subdomain
videos.papertalks.com   CNAME  vz-xxxxxx.b-cdn.net
```

### SSL/TLS
- Vercel: Automatic SSL
- Cloudflare: Full (strict) mode
- Bunny.net: Automatic SSL

---

## 6️⃣ Post-Deployment

### Verify Deployment
```bash
# Check main site
curl -I https://papertalks.com

# Check API health
curl https://papertalks.com/api/health

# Check Supabase connection
curl https://papertalks.com/api/early-access
```

### Set Up Monitoring
1. **Vercel Analytics**: Enable in dashboard
2. **Sentry** (optional): Add for error tracking
   ```env
   SENTRY_DSN=your_sentry_dsn
   ```

### Configure Cron Jobs
Vercel cron jobs (in `vercel.json`):
- Citation updates: Weekly
- Analytics aggregation: Daily

---

## 💰 Monthly Cost Estimate

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Pro | $20/mo |
| Supabase | Pro | $25/mo |
| Cloudflare | Free | $0/mo |
| Cloudflare R2 | Usage | ~$5/mo* |
| Bunny.net Stream | Usage | ~$20/mo* |
| Domain | Annual | ~$1/mo |
| **Total** | | **~$71/mo** |

*Usage estimates for early stage (~1000 users)

---

## 🔒 Security Checklist

- [ ] All API keys in environment variables (not in code)
- [ ] Supabase RLS policies enabled
- [ ] Rate limiting on API routes
- [ ] CORS configured properly
- [ ] Security headers set (via `vercel.json`)
- [ ] Signed URLs for private content
- [ ] Regular dependency updates

---

## 🚀 Scaling Checklist

When you reach growth milestones:

### 10K Users
- [ ] Enable Supabase connection pooling
- [ ] Add Redis caching (Upstash)
- [ ] Implement ISR for static pages

### 100K Users
- [ ] Upgrade to Supabase Team ($599/mo)
- [ ] Add read replicas for analytics
- [ ] Consider Algolia for search
- [ ] Multi-region deployment

### 1M+ Users
- [ ] Enterprise plans (Vercel, Supabase)
- [ ] Consider self-hosted Supabase on AWS
- [ ] CDN optimization
- [ ] Dedicated support contracts

---

## 📞 Support Resources

- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Cloudflare R2**: [developers.cloudflare.com/r2](https://developers.cloudflare.com/r2)
- **Bunny.net**: [docs.bunny.net](https://docs.bunny.net)

