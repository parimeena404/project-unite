# Deployment Instructions

## Quick Fix for Current Error

Your Vercel deployment is failing because NextAuth requires environment variables. Follow these steps:

### 1. Set Environment Variables in Vercel

Go to your Vercel dashboard → project-unite → Settings → Environment Variables

Add these **required** variables:

```bash
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://project-unite-eight.vercel.app
```

Generate `NEXTAUTH_SECRET` with:
```bash
openssl rand -base64 32
```

### 2. Add OAuth Providers (Optional but recommended)

For Google OAuth:
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create OAuth credentials
- Add to Vercel:
  - `GOOGLE_CLIENT_ID=your-google-id`
  - `GOOGLE_CLIENT_SECRET=your-google-secret`

For GitHub OAuth:
- Go to GitHub Settings → Developer settings → OAuth Apps
- Create new OAuth App
- Add to Vercel:
  - `GITHUB_ID=your-github-id`
  - `GITHUB_SECRET=your-github-secret`

### 3. Redeploy

After adding environment variables, go to Vercel dashboard → Deployments → click the three dots → "Redeploy"

## Alternative: Disable Auth Temporarily

If you just want to see the site working, the code now handles missing auth gracefully. Just set:

```bash
NEXTAUTH_SECRET=temporary-secret-for-testing-only
NEXTAUTH_URL=https://project-unite-eight.vercel.app
```

The app will work but authentication features will be disabled until you add OAuth credentials.

## Notes

- Backend (Express) is not deployed yet - it only runs on localhost:4000
- Socket.io features won't work in production without backend deployment
- AI features will use mock data unless you add `OPENAI_API_KEY`
