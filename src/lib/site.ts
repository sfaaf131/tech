export const site = {
  name: "Kondax",
  host: "kondax.tech",
  url: "https://kondax.tech",
  robotsIndex: true,
  tagline: "Taller público. Puerta abierta.",
  description:
    "Taller público de Agustín Saez C. en Santiago. Experimentos, notas, y una forma de cooperar.",
  email: "team@kondax.tech",
  author: "Agustín Saez C.",
  city: "Santiago, Chile",
} as const;

export const nav = [
  { href: "/experimentos", label: "Experimentos" },
  { href: "/notas", label: "Notas" },
  { href: "/cooperar", label: "Cooperar" },
] as const;

export const bannedOfferCopy = [
  "sweat equity",
  "venture studio",
  "cotizador",
  "cemprendedor",
] as const;

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "America/Santiago",
  }).format(new Date(`${iso}T12:00:00Z`));
}
