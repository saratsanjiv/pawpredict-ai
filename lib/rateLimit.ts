/**
 * In-memory rate limiter.
 * Tracks requests per IP using a sliding window.
 * For production at scale, swap this for Upstash Redis:
 *   https://github.com/upstash/ratelimit
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000;
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart > windowMs) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetIn: number;
} {
  const max = Number(process.env.RATE_LIMIT_MAX) || 10;
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000;
  const now = Date.now();

  const entry = store.get(ip);

  if (!entry || now - entry.windowStart > windowMs) {
    // New window
    store.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: max - 1, resetIn: windowMs };
  }

  if (entry.count >= max) {
    const resetIn = windowMs - (now - entry.windowStart);
    return { allowed: false, remaining: 0, resetIn };
  }

  entry.count++;
  return { allowed: true, remaining: max - entry.count, resetIn: windowMs - (now - entry.windowStart) };
}
