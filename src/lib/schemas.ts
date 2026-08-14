import { z } from "zod";
import { experiments } from "./lab";

export const cooperateIntents = ["entrar", "nota", "proponer"] as const;

export type CooperateIntent = (typeof cooperateIntents)[number];

const experimentSlugs = experiments.map((item) => item.slug) as [string, ...string[]];

const greetings = [
  "hola",
  "hello",
  "hi",
  "conectemos",
  "colaboremos",
  "hagamos algo",
  "busco socio",
  "oportunidad",
  "synergy",
  "crezcamos juntos",
];

export function normalizeNote(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isEmptyGreeting(message: string) {
  const normalized = normalizeNote(message);
  if (!normalized) return true;
  const words = normalized.split(" ");
  if (words.length >= 12) return false;
  return greetings.some((item) => normalized === item || normalized.startsWith(`${item} `));
}

export const cooperateSchema = z
  .object({
    name: z.string({ error: "Pon un nombre real, corto." }).trim().min(2, "Pon un nombre real, corto.").max(80),
    email: z.email({ error: "Ese correo no se puede usar." }),
    intent: z.enum(cooperateIntents, { error: "Elige una de las tres opciones." }),
    experiment: z
      .string()
      .optional()
      .transform((value) => {
        const trimmed = value?.trim() ?? "";
        return trimmed.length > 0 ? trimmed : undefined;
      })
      .pipe(z.enum(experimentSlugs).optional()),
    message: z
      .string({ error: "Falta objeto. Escribe qué harías o qué corrección traes." })
      .trim()
      .min(40, "Falta objeto. Escribe qué harías o qué corrección traes.")
      .max(1200, "La nota es muy larga. Córtala."),
    link: z
      .string()
      .trim()
      .max(240)
      .optional()
      .transform((value) => (value ? value : undefined)),
  })
  .superRefine((value, ctx) => {
    if (value.intent === "entrar" && !value.experiment) {
      ctx.addIssue({
        code: "custom",
        path: ["experiment"],
        message: "Si quieres entrar, elige un experimento publicado.",
      });
    }
    if (isEmptyGreeting(value.message)) {
      ctx.addIssue({
        code: "custom",
        path: ["message"],
        message: "Eso es un saludo. Falta el objeto.",
      });
    }
  });

export type CooperateInput = z.infer<typeof cooperateSchema>;

export function parseJsonObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function isHoneypot(body: Record<string, unknown>): boolean {
  return ["company_website", "sitio_web", "website", "empresa"].some((key) => {
    const trap = body[key];
    return typeof trap === "string" && trap.trim().length > 0;
  });
}

export function isTooFast(body: Record<string, unknown>, now = Date.now()) {
  const raw = body.t;
  if (typeof raw !== "string" && typeof raw !== "number") return false;
  const started = Number(raw);
  if (!Number.isFinite(started)) return false;
  return now - started < 3000;
}

export const intentLabels: Record<CooperateIntent, string> = {
  entrar: "Entrar a un experimento",
  nota: "Dejar una nota precisa",
  proponer: "Proponer trabajo conjunto",
};
