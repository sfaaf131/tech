const hits = new Map<string, { count: number; reset: number }>();

export function limited(ip: string, max = 5, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const current = hits.get(ip);
  if (!current || current.reset < now) {
    hits.set(ip, { count: 1, reset: now + windowMs });
    return false;
  }
  current.count += 1;
  return current.count > max;
}

export function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "local"
  );
}

export function allowRequest(
  table: Map<string, number[]>,
  key: string,
  now: number,
  limit = 5,
  windowMs = 10 * 60 * 1000,
) {
  const recent = (table.get(key) ?? []).filter((stamp) => now - stamp < windowMs);
  if (recent.length >= limit) {
    table.set(key, recent);
    return false;
  }
  recent.push(now);
  table.set(key, recent);
  return true;
}
