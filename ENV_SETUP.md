# Environment Variables Setup Guide

## ⚠️ Important Security Note

**NEVER commit `.env.local` to GitHub!** This file contains sensitive credentials.

Your `.gitignore` already protects this file from being committed (`.env*` is ignored).

## Local Development Setup

### 1. Copy `.env.example` to `.env.local`
```bash
cp .env.example .env.local
```

### 2. Fill in `.env.local` with your actual values

#### Firebase Configuration
Get these from your Firebase Console:
1. Go to https://console.firebase.google.com
2. Select your project (netflix-clone-59003)
3. Go to Project Settings > General
4. Scroll down to find your Web app configuration

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAjJY4b_czNQYKgFfTmRlNZ0Ax3CSBKQQA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=netflix-clone-59003.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=netflix-clone-59003
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=netflix-clone-59003.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=950518356253
NEXT_PUBLIC_FIREBASE_APP_ID=1:950518356253:web:b88b56cdf2cd42b1c8e9f4
```

#### TMDB API Configuration
Get this from TMDB:
1. Go to https://www.themoviedb.org/settings/api
2. Copy your API Key

```env
NEXT_PUBLIC_TMDB_API_KEY=06dd8bb7f4f960bc7d4567e2f5fedd0c
```

### 3. Run locally
```bash
npm run dev
# Visit http://localhost:3000
```

## Production Deployment (Vercel)

### Step 1: Add Environment Variables to Vercel
1. Go to https://vercel.com/dashboard
2. Click on your Netflix Clone project
3. Go to Settings > Environment Variables
4. Add all variables from `.env.local`:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Your Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Your Firebase Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your Firebase App ID |
| `NEXT_PUBLIC_TMDB_API_KEY` | Your TMDB API Key |

### Step 2: Redeploy
After adding env variables to Vercel:
- Push a commit to GitHub
- Vercel will automatically redeploy
- Or manually trigger redeploy in Vercel dashboard

## Why Use Environment Variables?

✅ **Security**: Secrets never exposed in code
✅ **Flexibility**: Different values for dev/production
✅ **Safety**: `.env.local` is git-ignored
✅ **Simplicity**: Easy to manage credentials

## File Structure

```
netflix-clone/
├── .env.local          ← YOUR SECRET CREDENTIALS (git-ignored, never commit)
├── .env.example        ← TEMPLATE FOR GITHUB (no real values, always commit)
├── lib/
│   ├── firebase.ts     ← Uses process.env variables
│   └── tmdb.ts         ← Uses process.env variables
└── .gitignore          ← Contains .env* rule
```

## Verification

To verify environment variables are loaded correctly:

```bash
# Create a test file
npm run dev
# Check in browser console or add this to a component:
console.log(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
```

---

**Your secrets are now safe! ✅**
