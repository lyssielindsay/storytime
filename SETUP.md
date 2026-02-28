# Story Time — Secure Deployment Guide

## Folder structure
```
storytime/
├── netlify.toml
├── public/
│   ├── index.html        ← your main app
│   └── login.html        ← family password gate
└── netlify/
    └── functions/
        ├── auth-login.js
        ├── auth-logout.js
        ├── generate-story.js
        ├── tts.js
        └── lib/
            ├── auth.js
            └── rateLimit.js
```

## Step 1 — Set environment variables in Netlify

Go to: Netlify Dashboard → Your Site → Site Configuration → Environment Variables

Add these 4 variables:

| Key                    | Value                        |
|------------------------|------------------------------|
| ANTHROPIC_API_KEY      | sk-ant-...your key...        |
| ELEVENLABS_API_KEY     | sk_...your key...            |
| ELEVENLABS_VOICE_ID    | VTELUeVYyAOtqSyQsu0U        |
| FAMILY_PASSWORD        | choose something memorable   |

## Step 2 — Deploy to Netlify

Option A — Netlify Drop (simplest):
1. Zip the entire `storytime/` folder
2. Go to app.netlify.com/drop
3. Drop the zip

Option B — Netlify CLI:
```bash
npm install -g netlify-cli
cd storytime
netlify deploy --prod
```

## Step 3 — Test

1. Open your Netlify URL → should redirect to /login
2. Enter wrong password → should show error
3. Enter correct password → should redirect to app
4. Generate a story → should work with no API key prompts
5. Voice should play on each page

## Step 4 — Share with family

Send your sister-in-law the Netlify URL + the family password separately.
She opens it in Safari → Add to Home Screen → done!

## Rate limits (built-in)
- Login: 10 attempts / 10 min per IP
- Story generation: 30 requests / 10 min per IP  
- TTS: 60 requests / 10 min per IP

Note: Rate limits reset on Netlify function cold starts (fine for family use).

## To change the password
Update FAMILY_PASSWORD in Netlify env vars → Redeploy (or trigger a new deploy).
Cookie persists 30 days so existing logged-in users won't be affected.
