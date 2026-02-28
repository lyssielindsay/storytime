const rateLimit = require('./lib/rateLimit');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: 'Method not allowed' }) };
  }

  // Rate limit: 10 attempts per 10 min per IP
  const ip = event.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  if (!rateLimit(ip, 'login', 10, 600)) {
    return { statusCode: 429, body: JSON.stringify({ ok: false, error: 'Too many attempts. Try again later.' }) };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Invalid JSON' }) }; }

  const { password } = body;
  if (!password || typeof password !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Password required' }) };
  }

  const correct = process.env.FAMILY_PASSWORD;
  if (!correct) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'Server misconfigured' }) };
  }

  if (password !== correct) {
    return { statusCode: 401, body: JSON.stringify({ ok: false, error: 'Wrong password' }) };
  }

  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': `family_auth=1; Max-Age=2592000; Path=/; HttpOnly; Secure; SameSite=Lax`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ok: true }),
  };
};
