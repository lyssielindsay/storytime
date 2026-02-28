const rateLimit = require('./lib/rateLimit');
const { checkAuth } = require('./lib/auth');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Auth check
  if (!checkAuth(event)) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  // Rate limit: 60 requests per 10 min per IP (TTS is called per page)
  const ip = event.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  if (!rateLimit(ip, 'tts', 60, 600)) {
    return { statusCode: 429, body: JSON.stringify({ error: 'Too many requests' }) };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { text, voiceId } = body;

  if (!text || typeof text !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ error: 'Text required' }) };
  }

  // Enforce max text length
  if (text.length > 2500) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Text too long (max 2500 chars)' }) };
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const defaultVoiceId = process.env.ELEVENLABS_VOICE_ID || voiceId;

  if (!apiKey || !defaultVoiceId) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfigured' }) };
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${defaultVoiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_MODEL || 'eleven_v3',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    if (!response.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: 'ElevenLabs error' }) };
    }

    // Return audio as base64 so it works cleanly in JSON
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio: base64, mimeType: 'audio/mpeg' }),
    };
  } catch (e) {
    console.error('tts error:', e);
    return { statusCode: 500, body: JSON.stringify({ error: 'TTS failed' }) };
  }
};
