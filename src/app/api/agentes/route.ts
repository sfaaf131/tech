import { NextResponse } from "next/server";
import { z } from "zod";
import { agentById, grokModel } from "@/lib/agents";
import { sealEvent } from "@/lib/audit";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  agent: z.enum(["cofundador", "celula", "cumplimiento"]),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .min(1)
    .max(16),
});

const hits = new Map<string, { count: number; reset: number }>();

function limited(ip: string) {
  const now = Date.now();
  const current = hits.get(ip);
  if (!current || current.reset < now) {
    hits.set(ip, { count: 1, reset: now + 10 * 60 * 1000 });
    return false;
  }
  current.count += 1;
  return current.count > 24;
}

export async function GET() {
  return NextResponse.json({
    model: grokModel,
    ready: Boolean(process.env.XAI_API_KEY),
  });
}

export async function POST(request: Request) {
  const key = process.env.XAI_API_KEY;
  if (!key) {
    return NextResponse.json(
      {
        error: "missing_key",
        message: "Falta XAI_API_KEY. Configúrala en Vercel para hablar con Grok 4.6.",
      },
      { status: 503 },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const agent = agentById(parsed.data.agent);
  sealEvent("agent.turn", { agent: agent.id });

  const upstream = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: grokModel,
      stream: true,
      temperature: 0.5,
      max_tokens: 1800,
      messages: [
        { role: "system", content: agent.prompt },
        ...parsed.data.messages,
      ],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text();
    return NextResponse.json(
      { error: "upstream", detail: detail.slice(0, 400) },
      { status: 502 },
    );
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
