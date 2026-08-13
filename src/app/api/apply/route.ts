import { NextResponse } from "next/server";
import { sealEvent } from "@/lib/audit";
import { saveApplication } from "@/lib/db";
import { clientIp, limited } from "@/lib/rate-limit";
import { applySchema, isHoneypot, parseJsonObject } from "@/lib/schemas";

export async function POST(request: Request) {
  if (limited(clientIp(request))) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Espera unos minutos." },
      { status: 429 },
    );
  }

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
  if (isHoneypot(body)) {
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
