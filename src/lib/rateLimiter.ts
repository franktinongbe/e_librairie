type Entry = { count: number; reset: number };

const windowMs = 60 * 1000; // 1 minute
const maxRequests = Number(process.env.API_RATE_LIMIT || 60);

const store = new Map<string, Entry>();

export function isRateLimited(key: string): { limited: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const e = store.get(key);
  if (!e || e.reset <= now) {
    store.set(key, { count: 1, reset: now + windowMs });
    return { limited: false, remaining: maxRequests - 1, reset: now + windowMs };
  }

  e.count += 1;
  if (e.count > maxRequests) {
    return { limited: true, remaining: 0, reset: e.reset };
  }

  return { limited: false, remaining: maxRequests - e.count, reset: e.reset };
}
