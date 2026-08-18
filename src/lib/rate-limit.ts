const hits = new Map<string, { count: number; reset: number }>();

function evict(now: number) {
  for (const [key, value] of hits) {
    if (value.reset < now) hits.delete(key);
  }
}

export function limited(ip: string, max = 5, windowMs = 60 * 60 * 1000, now = Date.now()) {
  evict(now);
  const current = hits.get(ip);
  if (!current || current.reset < now) {
    hits.set(ip, { count: 1, reset: now + windowMs });
    return false;
  }
  current.count += 1;
  return current.count > max;
}

export function retryAfterSec(ip: string, now = Date.now()) {
  const current = hits.get(ip);
  if (!current || current.reset < now) return 3600;
  return Math.max(1, Math.ceil((current.reset - now) / 1000));
}

export function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "local"
  );
}
