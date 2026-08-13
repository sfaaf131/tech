import { NextResponse } from "next/server";
import { sealEvent } from "@/lib/audit";
import { saveApplication } from "@/lib/db";
import { clientIp, limited } from "@/lib/rate-limit";
import { applySchema } from "@/lib/schemas";

export async function POST(request: Request) {
  if (limited(clientIp(request))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const parsed = applySchema.safeParse(await request.json());
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
