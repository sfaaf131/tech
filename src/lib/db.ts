import { PrismaClient } from "@prisma/client";
import type { ApplyInput, ContactInput } from "@/lib/schemas";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function client() {
  if (!process.env.DATABASE_URL) return null;
  try {
    globalForPrisma.prisma ??= new PrismaClient();
    return globalForPrisma.prisma;
  } catch {
    return null;
  }
}

export async function saveLead(input: ContactInput, seal: string) {
  const db = client();
  if (!db) return { stored: "pending" as const };
  try {
    await db.lead.create({ data: { ...input, role: input.role ?? null, seal } });
    return { stored: "postgres" as const };
  } catch {
    return { stored: "pending" as const };
  }
}

export async function saveApplication(input: ApplyInput, seal: string) {
  const db = client();
  if (!db) return { stored: "pending" as const };
  try {
    await db.application.create({
      data: {
        name: input.name,
        email: input.email,
        company: input.company,
        idea: input.idea,
        market: input.market,
        traction: input.traction,
        seal,
      },
    });
    return { stored: "postgres" as const };
  } catch {
    return { stored: "pending" as const };
  }
}
