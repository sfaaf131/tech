import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre").max(120),
  email: z.string().trim().email("Correo inválido").max(160),
  company: z.string().trim().min(2, "Escribe la empresa").max(160),
  role: z.string().trim().max(80).optional(),
  need: z.enum(["agentes", "rpa", "celulas", "otro"], { message: "Elige una necesidad" }),
  message: z.string().trim().min(12, "Cuéntanos un poco más").max(4000),
});

export const applySchema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre").max(120),
  email: z.string().trim().email("Correo inválido").max(160),
  company: z.string().trim().min(2, "Escribe el proyecto").max(160),
  idea: z.string().trim().min(24, "Describe la idea con un poco más de detalle").max(4000),
  market: z.string().trim().max(400).optional(),
  traction: z.string().trim().max(800).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ApplyInput = z.infer<typeof applySchema>;
