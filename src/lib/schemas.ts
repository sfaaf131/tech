import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  company: z.string().trim().min(2).max(160),
  role: z.string().trim().max(80).optional(),
  need: z.enum(["agentes", "rpa", "celulas", "otro"]),
  message: z.string().trim().min(12).max(4000),
});

export const applySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  company: z.string().trim().min(2).max(160),
  idea: z.string().trim().min(24).max(4000),
  market: z.string().trim().max(400).optional(),
  traction: z.string().trim().max(800).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ApplyInput = z.infer<typeof applySchema>;
