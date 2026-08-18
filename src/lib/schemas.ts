import { z } from "zod";
import { experiments, isOpenExperimentSlug } from "./lab";

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

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const cooperateSchema = z
  .object({
    name: z
      .string({ error: "Pon un nombre real, corto." })
      .trim()
      .min(2, "Pon un nombre real, corto.")
      .max(80, "Pon un nombre real, corto."),
    email: z.email({ error: "Ese correo no se puede usar." }),
    intent: z.enum(cooperateIntents, { error: "Elige una de las tres opciones." }),
    experiment: z
      .string()
      .optional()
      .transform((value) => {
        const trimmed = value?.trim() ?? "";
        return trimmed.length > 0 ? trimmed : undefined;
      })
      .pipe(z.enum(experimentSlugs, { error: "Ese experimento no está publicado." }).optional()),
    message: z
      .string({ error: "Muy corto. Di qué harías, qué viste, o qué corrección traes." })
      .trim()
      .min(40, "Muy corto. Di qué harías, qué viste, o qué corrección traes.")
      .max(1200, "La nota es muy larga. Córtala."),
    link: z
      .string()
      .trim()
      .max(240, "Ese enlace es muy largo.")
      .optional()
      .transform((value) => (value ? value : undefined))
      .refine((value) => !value || isHttpUrl(value), { error: "Eso no parece un enlace." }),
  })
  .superRefine((value, ctx) => {
    if (value.intent === "entrar" && !value.experiment) {
      ctx.addIssue({
        code: "custom",
        path: ["experiment"],
        message: "Si quieres entrar, elige un experimento publicado.",
      });
    }
    if (value.intent === "entrar" && value.experiment && !isOpenExperimentSlug(value.experiment)) {
      ctx.addIssue({
        code: "custom",
        path: ["experiment"],
        message: "Ese experimento no está abierto.",
      });
    }
    if (isEmptyGreeting(value.message)) {
      ctx.addIssue({
        code: "custom",
        path: ["message"],
        message: "Eso es un saludo. Di qué harías o qué corrección traes.",
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
  if (!Object.hasOwn(body, "t")) return true;
  const raw = body.t;
  if (typeof raw !== "string" && typeof raw !== "number") return true;
  if (typeof raw === "string" && raw.trim() === "") return true;
  const started = Number(typeof raw === "string" ? raw.trim() : raw);
  if (!Number.isFinite(started) || started <= 0) return true;
  if (started > now) return true;
  return now - started < 3000;
}

export const intentLabels: Record<CooperateIntent, string> = {
  entrar: "Entrar a un experimento",
  nota: "Dejar una nota",
  proponer: "Proponer trabajo conjunto",
};

export const experimentHints: Record<CooperateIntent | "", string> = {
  "": "Obligatorio solo si vas a entrar.",
  entrar: "Elige uno de los que están abiertos.",
  nota: "Si la nota es sobre un experimento, márcalo. Si no, déjalo vacío.",
  proponer: "Si se apoya en uno publicado, márcalo. Si es nuevo, déjalo vacío.",
};

export const messageHints: Record<CooperateIntent | "", string> = {
  "": "Qué experimento, qué harías, o qué corrección traes. Mínimo un párrafo corto (~40 caracteres).",
  entrar: "A cuál, qué harías, y hasta dónde. Un párrafo. Mínimo ~40 caracteres.",
  nota: "Qué está mal o qué falta. Página y caso, si puedes. Mínimo ~40 caracteres.",
  proponer: "Qué haríamos, con qué material, y qué no es. Mínimo ~40 caracteres.",
};
