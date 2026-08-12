import { NextResponse } from "next/server";
import { z } from "zod";
import { sealEvent } from "@/lib/audit";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email(),
  audience: z.enum(["emprendedor", "pyme", "enterprise", "banca"]),
  message: z.string().trim().min(8).max(4000),
  origen: z.string().max(40).optional(),
  sello: z.string().max(128).optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const event = sealEvent("lead.received", parsed.data);
  return NextResponse.json({ id: event.id, hash: event.hash, at: event.at });
}
