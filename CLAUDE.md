# Story Time — Claude Code Context

A children's interactive storybook web app. Kids tap a pink microphone, say what they want in a story, and it generates a fully interactive storybook read aloud in a cloned voice. Built for my nieces (ages 1, 4, 7) to use on an iPad.

## Tech stack
- Single HTML file frontend (`public/index.html`) + login page (`public/login.html`)
- Netlify Functions for all backend (`netlify/functions/`) — auth, story generation, TTS
- Claude API (claude-sonnet-4-6) for story generation
- ElevenLabs v3 for voice narration (cloned voice)
- Web Audio API for sound effects (fart, boing, magic, roar)
- Family password gate with HttpOnly cookie (30 days)
- GitHub repo: https://github.com/lyssielindsay/storytime.git
- Deployed on Netlify, auto-deploys on push to main

## Key files
- `public/index.html` — entire frontend app
- `public/login.html` — family password gate
- `netlify/functions/generate-story.js` — calls Claude API
- `netlify/functions/tts.js` — calls ElevenLabs API
- `netlify/functions/auth-login.js` — password check, sets cookie
- `netlify/functions/get-config.js` — serves kids config to frontend
- `netlify/functions/lib/auth.js` — cookie checker
- `netlify/functions/lib/rateLimit.js` — in-memory rate limiter
- `.env.example` — template for env vars
- `netlify.toml` — build config

## Environment variables (set in Netlify dashboard, never committed)
- `ANTHROPIC_API_KEY` — Claude API key
- `ANTHROPIC_MODEL` — defaults to claude-sonnet-4-6
- `ELEVENLABS_API_KEY` — ElevenLabs key
- `ELEVENLABS_VOICE_ID` — VTELUeVYyAOtqSyQsu0U
- `ELEVENLABS_MODEL` — defaults to eleven_v3
- `FAMILY_PASSWORD` — shared family password
- `KIDS` — e.g. Enna:7,Maddie:4,Teo:1
- `AUNTY_NAME` — Aunty Ping
- `STORIES_PER_DAY` — 3
- `STORY_PROMPT_EXTRAS` — e.g. Always start with Once upon a time.

## Known iOS Safari quirks
- Must be used in Safari on iPad (Web Speech API requirement)
- Audio routed through Web Audio API gain node to force iOS main speaker output
- Silent video element (`#iosSpeakerUnlock`) tricks iOS into speaker mode instead of earpiece
- `recognition.abort()` fires an `onerror` with type `aborted` — this is silent/expected
- Common silent mic errors: no-speech, audio-capture, aborted, network
- Auth check happens via GET to `/.netlify/functions/get-config` on load
- Audio pre-fetched one page ahead and cached in `audioCache`
- Emotion tags like [laughing] [dramatic] stripped from display text but sent to ElevenLabs
- Page 0 audio awaited before showing reader to avoid blank flash

## When making changes
- Always think about Safari on iPad — not desktop Chrome
- After any change: `git add . && git commit -m "description" && git push`
- Netlify auto-deploys on every push to main
- Never hardcode API keys — all secrets live in Netlify env vars only
