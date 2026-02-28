// In-memory rate limiter — resets on cold start, good enough for family use
// Map: `${ip}:${action}` -> { count, windowStart }
const store = new Map();

/**
 * Returns true if the request is allowed, false if rate limited.
 * @param {string} ip
 * @param {string} action - namespace (e.g. 'story', 'tts', 'login')
 * @param {number} maxRequests
 * @param {number} windowSeconds
 */
function rateLimit(ip, action, maxRequests, windowSeconds) {
  const key = `${ip}:${action}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const entry = store.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

module.exports = rateLimit;
