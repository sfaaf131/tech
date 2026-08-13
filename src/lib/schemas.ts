import { z } from "zod";
import { needIds } from "./services";

export const contactSchema = z.object({
  name: z.string({ error: "Escribe tu nombre" }).trim().min(2, "Escribe tu nombre").max(120),
  email: z.email({ error: "Correo inválido" }),
  company: z.string({ error: "Escribe la empresa" }).trim().min(2, "Escribe la empresa").max(160),
  role: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => (value ? value : undefined)),
  need: z.enum(needIds, { error: "Elige una necesidad" }),
  message: z
    .string({ error: "Cuéntanos el proceso, el volumen y el sistema" })
    .trim()
    .min(24, "Cuéntanos el proceso, el volumen y el sistema")
    .max(4000),
});

export const applySchema = z.object({
  name: z.string({ error: "Escribe tu nombre" }).trim().min(2, "Escribe tu nombre").max(120),
  email: z.email({ error: "Correo inválido" }),
  company: z.string({ error: "Escribe el proyecto" }).trim().min(2, "Escribe el proyecto").max(160),
  idea: z
    .string({ error: "Describe el hito de software, no solo la visión" })
    .trim()
    .min(24, "Describe el hito de software, no solo la visión")
    .max(4000),
  market: z
    .string({ error: "Indica la industria que conoces" })
    .trim()
    .min(12, "Indica la industria que conoces")
    .max(400),
  traction: z
    .string({ error: "Indica tracción o acceso al canal" })
    .trim()
    .min(12, "Indica tracción o acceso al canal")
    .max(800),
  partner: z.literal("on", { error: "Confirma que Kondax entra como socio" }),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ApplyInput = z.infer<typeof applySchema>;

export function parseJsonObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function isHoneypot(body: Record<string, unknown>): boolean {
  const trap = body.company_website;
  return typeof trap === "string" && trap.trim().length > 0;
}
