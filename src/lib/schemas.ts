import { z } from "zod";
import { experiments } from "./lab";

export const cooperateIntents = ["entrar", "nota", "juntos", "otro"] as const;

export type CooperateIntent = (typeof cooperateIntents)[number];

const experimentSlugs = experiments.map((item) => item.slug) as [string, ...string[]];

export const cooperateSchema = z
  .object({
    name: z.string({ error: "Escribe tu nombre" }).trim().min(2, "Escribe tu nombre").max(120),
    email: z.email({ error: "Correo inválido" }),
    intent: z.enum(cooperateIntents, { error: "Elige para qué escribes" }),
    experiment: z
      .string()
      .optional()
      .transform((value) => {
        const trimmed = value?.trim() ?? "";
        return trimmed.length > 0 ? trimmed : undefined;
      })
      .pipe(z.enum(experimentSlugs).optional()),
    message: z
      .string({ error: "Escribe una nota precisa" })
      .trim()
      .min(24, "Escribe una nota precisa: un hecho, un contexto, una pregunta")
      .max(4000),
  })
  .superRefine((value, ctx) => {
    if (value.intent === "entrar" && !value.experiment) {
      ctx.addIssue({
        code: "custom",
        path: ["experiment"],
        message: "Elige el experimento al que quieres entrar",
      });
    }
  });

export type CooperateInput = z.infer<typeof cooperateSchema>;

export function parseJsonObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function isHoneypot(body: Record<string, unknown>): boolean {
  const trap = body.company_website;
  return typeof trap === "string" && trap.trim().length > 0;
}

export const intentLabels: Record<CooperateIntent, string> = {
  entrar: "Entrar a un experimento",
  nota: "Dejar una nota",
  juntos: "Proponer trabajo conjunto",
  otro: "Otra cosa, precisa",
};
