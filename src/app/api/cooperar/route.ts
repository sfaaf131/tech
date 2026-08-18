import { NextResponse } from "next/server";
import { clientIp, limited, retryAfterSec } from "@/lib/rate-limit";
import { cooperateSchema, isHoneypot, isTooFast, parseJsonObject } from "@/lib/schemas";
import { saveCooperation } from "@/lib/store";

export async function POST(request: Request) {
  const ip = clientIp(request);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "El cuerpo no es JSON válido." }, { status: 400 });
  }

  const body = parseJsonObject(raw);
  if (!body) {
    return NextResponse.json({ error: "El cuerpo no es JSON válido." }, { status: 400 });
  }
  if (isHoneypot(body) || isTooFast(body)) {
    return NextResponse.json({ ok: true, stored: "pending" });
  }

  const parsed = cooperateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (limited(ip)) {
    return NextResponse.json(
      { error: "Demasiados envíos. Espera un rato." },
      { status: 429, headers: { "Retry-After": String(retryAfterSec(ip)) } },
    );
  }

  const persist = saveCooperation(parsed.data);
  return NextResponse.json({
    ok: true,
    stored: persist.stored,
  });
}
