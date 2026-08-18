import { experiments } from "./lab";
import { cooperateIntents, type CooperateIntent } from "./schemas";
import { site } from "./site";

export const honeypotName = "company_website";

export const cooperateFieldOrder = ["intent", "experiment", "name", "email", "message", "link"] as const;

export const cooperateFieldIds: Record<(typeof cooperateFieldOrder)[number], string> = {
  intent: "coop-intent-entrar",
  experiment: "coop-experiment",
  name: "coop-name",
  email: "coop-email",
  message: "coop-message",
  link: "coop-link",
};

export const cooperateCopy = {
  pageLead: `Este formulario no guarda el envío. Si hay algo que hacer, escríbeme a ${site.email}.`,
  successTitle: "Quedó pendiente.",
  successDetail: `Este formulario no guarda. Copia el texto y mándalo a ${site.email}. Si hay encaje, respondo. Si no, no invento una reunión.`,
  emailHint: "No hay lista ni newsletter. El envío no llega solo.",
};

export function asIntent(value: string | null | undefined): CooperateIntent | "" {
  return cooperateIntents.includes(value as CooperateIntent) ? (value as CooperateIntent) : "";
}

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function presetFromSearch(search: {
  intento?: string | string[];
  intent?: string | string[];
  experimento?: string | string[];
  exp?: string | string[];
}) {
  const experiment = first(search.experimento) || first(search.exp);
  const presetExperiment = experiments.some((item) => item.slug === experiment) ? experiment : "";
  const presetIntent: CooperateIntent | "" =
    asIntent(first(search.intento) || first(search.intent)) || (presetExperiment ? "entrar" : "");
  return { presetExperiment, presetIntent };
}
