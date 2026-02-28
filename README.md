# ✨ Story Time

An interactive AI storybook app for kids. They tap a microphone, say what they want in a story, and it generates a fully interactive storybook — read aloud in a cloned voice, with tap animations, mini games, and silly sound effects.

**Built with:** Claude (story generation) · ElevenLabs v3 (voice) · Netlify (hosting + serverless backend)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/storytime)

> 💡 **Just want to use it?** Click the button above and follow the setup steps — you'll have it running in about 15 minutes.

---

## What it does

- 🎤 **Voice input** — kids tap and talk, no typing needed
- 📖 **Interactive storybook** — page by page, with animated characters
- 🔊 **Read aloud** in a voice you clone yourself (or a built-in voice)
- 🎮 **Tap-to-animate** characters, mini games, sound effects
- 🔢 **Counting game** on the loading screen keeps little ones busy
- 🔒 **Family password** so only your family can access it
- 🛡️ **API keys never in the browser** — all handled server-side

---

## Setup guide

### What you'll need

Before starting, get these (all have free tiers):

| Account | What for | Sign up |
|---|---|---|
| Anthropic | Story generation (Claude) | [console.anthropic.com](https://console.anthropic.com) |
| ElevenLabs | Voice narration | [elevenlabs.io](https://elevenlabs.io) |
| Netlify | Hosting | [netlify.com](https://netlify.com) |
| GitHub | Code storage | [github.com](https://github.com) |

---

### Step 1 — Deploy to Netlify

Click the button at the top of this page, or go to:
**app.netlify.com → Add new site → Import from GitHub → pick this repo**

Leave all build settings as they are and click **Deploy site**.

---

### Step 2 — Add your environment variables

This is the most important step. Go to:
**Netlify dashboard → your site → Site configuration → Environment variables → Add a variable**

Add each of these:

**Required:**

| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys → Create key |
| `ELEVENLABS_API_KEY` | [elevenlabs.io](https://elevenlabs.io) → Profile (top right) → API Key |
| `ELEVENLABS_VOICE_ID` | See "Choosing a voice" below |
| `FAMILY_PASSWORD` | Make up anything — e.g. `rainbows42` |

**Your kids (makes stories personal):**

| Variable | Example value |
|---|---|
| `KIDS` | `Sofia:7,James:4,Mia:1` (Name:Age, comma separated) |
| `AUNTY_NAME` | `Aunty Sarah` (adult character in stories) |

**Optional:**

| Variable | Default | What it does |
|---|---|---|
| `STORIES_PER_DAY` | `3` | Max stories per device per day |
| `STORY_PROMPT_EXTRAS` | _(blank)_ | Extra instructions e.g. `Always start with Once upon a time.` |

After adding all variables, go to **Deploys → Trigger deploy → Deploy site**.

---

### Step 3 — Add to iPad home screen

1. Open your Netlify URL in **Safari** (must be Safari)
2. Tap the **Share** button (box with arrow)
3. Tap **Add to Home Screen**
4. It now appears as an app icon — tap it like any other app

---

### Choosing a voice

**Option A — Clone your own voice (recommended, feels magical for kids)**
1. Go to elevenlabs.io → Voices → Add Voice → Instant Voice Clone
2. Record 2-3 minutes of yourself reading out loud with lots of energy — vary your pitch, pause dramatically, smile while you talk. Reading a kids book works great.
3. Upload and save, then copy the **Voice ID** from the voice settings page
4. Paste it as `ELEVENLABS_VOICE_ID` in Netlify

**Option B — Use a built-in voice (easier, no recording needed)**

Some good storytelling voices:

| Voice | Style | Voice ID |
|---|---|---|
| Matilda | Warm, friendly | `XrExE9yKIg1WjnnlVkGX` |
| Charlotte | Expressive | `XB0fDUnXU5powFXDhCwa` |
| Alice | Calm, clear | `Xb7hH8MSUJpSbSDYk0k2` |

---

### ElevenLabs free tier note

The free tier gives ~10,000 characters/month ≈ 20 stories. Voice silently stops if you hit the limit (the rest of the app still works). Upgrade to Creator ($22/mo) for ~200 stories/month.

---

## Troubleshooting

**"Wrong password" on login** → Check `FAMILY_PASSWORD` in Netlify env vars and trigger a redeploy.

**No voice narration** → Check `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` are correct and your account has remaining characters.

**Blank screen** → Open browser dev tools (F12 → Console) and look for errors — usually a missing env var.

**Voice sounds flat** → Re-record with more energy, or switch to a built-in ElevenLabs voice. The app already uses emotion tags like `[laughing]` to help with expressiveness.

---

## For developers — local setup

```bash
npm install -g netlify-cli
git clone https://github.com/YOUR_USERNAME/storytime.git
cd storytime
cp .env.example .env   # fill in your real values
netlify dev            # runs functions + frontend locally
```

Pushing updates:
```bash
git add .
git commit -m "describe your change"
git push   # Netlify auto-deploys
```

---

## Security

- All API keys live in Netlify env vars — never in the browser or GitHub
- Family password gate with HttpOnly cookie (30-day session)
- Auth enforced server-side on every function — not just the UI
- Rate limiting on all endpoints
- Children's content safety system prompt baked into story generation

---

*Made with ❤️ for my nieces. Claude for stories, ElevenLabs for voice, a big pink microphone button, and a lot of fart sound effects.*
