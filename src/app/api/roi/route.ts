import { NextResponse } from "next/server";
import { z } from "zod";
import { estimateRoi } from "@/lib/roi";
import { sealEvent } from "@/lib/audit";

const schema = z.object({
  fte: z.number().positive(),
  salaryClp: z.number().nonnegative(),
  automationPct: z.number().min(0).max(1),
  monthlyVolume: z.number().nonnegative(),
  errorRate: z.number().min(0).max(1),
  costPerErrorClp: z.number().nonnegative(),
  complianceClp: z.number().nonnegative(),
  implementationUsd: z.number().nonnegative(),
  annualSaasClp: z.number().nonnegative(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const result = estimateRoi(parsed.data);
  const event = sealEvent("roi.computed", { input: parsed.data, result });
  return NextResponse.json({ result, seal: event.hash });
}
