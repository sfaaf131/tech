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
    .string({ error: "Cuéntanos un poco más" })
    .trim()
    .min(12, "Cuéntanos un poco más")
    .max(4000),
});

export const applySchema = z.object({
  name: z.string({ error: "Escribe tu nombre" }).trim().min(2, "Escribe tu nombre").max(120),
  email: z.email({ error: "Correo inválido" }),
  company: z.string({ error: "Escribe el proyecto" }).trim().min(2, "Escribe el proyecto").max(160),
  idea: z
    .string({ error: "Describe la idea" })
    .trim()
    .min(24, "Describe la idea con un poco más de detalle")
    .max(4000),
  market: z
    .string()
    .trim()
    .max(400)
    .optional()
    .transform((value) => (value ? value : undefined)),
  traction: z
    .string()
    .trim()
    .max(800)
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ApplyInput = z.infer<typeof applySchema>;
