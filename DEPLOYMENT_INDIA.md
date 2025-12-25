# 🇮🇳 PaperTalks India Stack Deployment

Budget-friendly deployment optimized for Indian users.

## 💰 Cost: Starting at ₹500/mo (~$6/mo)

```
┌─────────────────────────────────────────────┐
│         CLOUDFLARE (Free CDN + WAF)         │
│         └── R2 Storage (10GB Free)          │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│           RAILWAY.APP (Next.js)             │
│           Free → $5/mo                      │
└─────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────┐      ┌─────────────┐
│  SUPABASE   │      │ IMAGEKIT.IO │
│  Free Tier  │      │  🇮🇳 Indian  │
│  $0/mo      │      │  Free Tier  │
└─────────────┘      └─────────────┘
```

---

## 📋 What You'll Set Up

| Service | Purpose | Free Tier | Paid |
|---------|---------|-----------|------|
| **Railway.app** | Next.js hosting | $5 credit | $5/mo |
| **Supabase** | Database + Auth | 500MB, 50K requests | $25/mo |
| **Cloudflare R2** | PDF/Image storage | 10GB | $0.015/GB |
| **ImageKit.io** 🇮🇳 | Video + Images | 20GB delivery/mo | ₹4,070/mo |

---

## 1️⃣ Supabase Setup (Free Tier)

### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Choose region: **Mumbai (ap-south-1)** 🇮🇳
5. Set a strong database password
6. Wait for project to initialize (~2 minutes)

### Run Database Schema
1. Go to **SQL Editor** in Supabase dashboard
2. Paste contents of `supabase/schema.sql`
3. Click **Run**

### Configure Authentication
1. **Settings → Authentication → URL Configuration**
   ```
   Site URL: https://your-app.up.railway.app
   Redirect URLs:
   - https://your-app.up.railway.app/auth/callback
   - http://localhost:3000/auth/callback
   ```

2. **Enable Google OAuth** (optional)
   - Settings → Authentication → Providers → Google
   - Add Client ID and Secret from Google Cloud Console

### Copy Credentials
From **Settings → API**, copy:
- Project URL
- Anon public key
- Service role key (keep secret!)

---

## 2️⃣ ImageKit.io Setup 🇮🇳

### Create Account
1. Go to [imagekit.io](https://imagekit.io)
2. Sign up (Indian company - INR billing available!)
3. Verify email

### Get Credentials
From Dashboard → Developer Options:
- **Public Key**: `public_xxxxx`
- **Private Key**: `private_xxxxx`
- **URL Endpoint**: `https://ik.imagekit.io/your_id`

### Configure Settings
1. **Settings → Upload**
   - Enable: Videos
   - Max file size: 100MB (for explainer videos)

2. **Settings → URL Endpoint**
   - Note your endpoint URL

### Free Tier Limits
- 20GB media delivery/month
- 20GB storage
- Unlimited transformations

---

## 3️⃣ Cloudflare R2 Setup

### Create Account
1. Go to [cloudflare.com](https://cloudflare.com)
2. Sign up (free)
3. Add your domain (or skip for now)

### Enable R2
1. Dashboard → R2 → Enable R2
2. No credit card required for free tier!

### Create Bucket
1. R2 → Create Bucket
2. Name: `papertalks`
3. Location: Auto

### Create API Token
1. R2 → Manage R2 API Tokens
2. Create API Token
3. Permissions: Object Read & Write
4. Copy:
   - Access Key ID
   - Secret Access Key
   - Endpoint URL

### Free Tier Limits
- 10GB storage
- 10 million requests/month
- No egress fees! 🎉

---

## 4️⃣ Railway.app Deployment

### Create Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `PaperTalks` repository
4. Select `papertalks` folder as root

### Configure Environment Variables
In Railway Dashboard → Variables, add:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ImageKit.io
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxx
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Cloudflare R2
CLOUDFLARE_R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=papertalks
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxx.r2.dev

# App
NEXT_PUBLIC_APP_URL=https://your-app.up.railway.app
```

### Deploy
1. Railway auto-deploys on git push
2. Or click "Deploy" manually
3. Wait for build (~3-5 minutes)

### Get Your URL
- Railway provides: `https://your-app.up.railway.app`
- Or add custom domain in Settings

---

## 5️⃣ Connect Everything

### Update Supabase Redirect URLs
Add your Railway URL:
```
https://your-app.up.railway.app/auth/callback
```

### Test Deployment
```bash
# Check health
curl https://your-app.up.railway.app/api/health

# Should return:
# {"status":"healthy","checks":{"database":"healthy"}}
```

---

## 📱 Local Development

### Install Dependencies
```bash
cd papertalks
npm install imagekit
```

### Create `.env.local`
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ImageKit.io
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxx
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Cloudflare R2 (optional for local dev)
CLOUDFLARE_R2_ENDPOINT=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=papertalks
CLOUDFLARE_R2_PUBLIC_URL=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Locally
```bash
npm run dev
```

---

## 💰 Cost Breakdown

### Phase 1: Launch (0-1000 users)
```
Railway.app:     $5/mo credit = ₹0 (free)
Supabase:        Free tier    = ₹0
Cloudflare R2:   Free tier    = ₹0
ImageKit.io:     Free tier    = ₹0
────────────────────────────────────────
Total:                        = ₹0/mo 🎉
```

### Phase 2: Growth (1K-10K users)
```
Railway.app:     $5/mo        = ₹415
Supabase:        Free tier    = ₹0
Cloudflare R2:   ~$2/mo       = ₹166
ImageKit.io:     Free tier    = ₹0
────────────────────────────────────────
Total:                        = ₹581/mo
```

### Phase 3: Scale (10K-50K users)
```
Railway.app:     $20/mo       = ₹1,660
Supabase Pro:    $25/mo       = ₹2,075
Cloudflare R2:   ~$10/mo      = ₹830
ImageKit Pro:    $49/mo       = ₹4,070
────────────────────────────────────────
Total:                        = ₹8,635/mo
```

---

## 🚀 Quick Commands

```bash
# Install ImageKit SDK
npm install imagekit

# Install R2 SDK (S3 compatible)
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

# Build for production
npm run build

# Start production server
npm start

# Push to deploy (Railway auto-deploys)
git push origin main
```

---

## ✅ Deployment Checklist

- [ ] Supabase project created (Mumbai region)
- [ ] Database schema deployed
- [ ] ImageKit.io account created
- [ ] Cloudflare R2 bucket created
- [ ] Railway.app project connected
- [ ] Environment variables added
- [ ] First deployment successful
- [ ] Health check passing
- [ ] Auth flow tested

---

## 🆘 Troubleshooting

### Build Fails on Railway
- Check Node.js version (use 18+)
- Verify all environment variables are set
- Check build logs for specific errors

### Database Connection Issues
- Verify Supabase URL and keys
- Check if free tier limits exceeded
- Ensure RLS policies are correct

### Video Upload Fails
- Check ImageKit credentials
- Verify file size limits
- Check browser console for errors

### Images Not Loading
- Verify ImageKit URL endpoint
- Check if files were uploaded successfully
- Clear CDN cache

---

## 📞 Support

- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **ImageKit**: [docs.imagekit.io](https://docs.imagekit.io) (Email: support@imagekit.io)
- **Cloudflare R2**: [developers.cloudflare.com/r2](https://developers.cloudflare.com/r2)

