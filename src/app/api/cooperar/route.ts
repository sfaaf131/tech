import { NextResponse } from "next/server";
import { clientIp, limited } from "@/lib/rate-limit";
import { cooperateSchema, isHoneypot, parseJsonObject } from "@/lib/schemas";

export async function POST(request: Request) {
  if (limited(clientIp(request))) {
    return NextResponse.json(
      { error: "Demasiadas notas. Espera unos minutos." },
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
    return NextResponse.json({ stored: "pending" });
  }

  const parsed = cooperateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({ stored: "pending" });
}
