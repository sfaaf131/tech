import { NextResponse } from "next/server";
import { sealEvent } from "@/lib/audit";
import { saveApplication } from "@/lib/db";
import { clientIp, limited } from "@/lib/rate-limit";
import { applySchema } from "@/lib/schemas";

export async function POST(request: Request) {
  if (limited(clientIp(request))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (typeof body.company_website === "string" && body.company_website.trim()) {
    return NextResponse.json({ id: "ok" });
  }

  const parsed = applySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const event = sealEvent("application.received", parsed.data);
  const persist = await saveApplication(parsed.data, event.hash);
  return NextResponse.json({
    id: event.id,
    hash: event.hash,
    stored: persist.stored,
  });
}
