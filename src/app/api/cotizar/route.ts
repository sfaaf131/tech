import { NextResponse } from "next/server";
import { z } from "zod";
import { sealEvent } from "@/lib/audit";

const schema = z.object({
  audience: z.enum(["emprendedor", "pyme", "enterprise", "banca"]),
  serviceIds: z.array(z.string()).min(1),
  scope: z.enum(["mvp", "producto", "plataforma"]),
  timeline: z.enum(["4", "8", "12", "24"]),
  equity: z.boolean(),
  result: z.unknown(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const event = sealEvent("quote.sealed", parsed.data);
  return NextResponse.json({
    id: event.id,
    hash: event.hash,
    prevHash: event.prevHash,
    at: event.at,
  });
}
