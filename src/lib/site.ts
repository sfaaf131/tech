export const site = {
  name: "Kondax",
  host: "kondax.tech",
  url: "https://kondax.tech",
  tagline: "Lab personal cooperativo",
  description:
    "Taller público de Agustín Saez C. en Santiago. Experimentos, notas y una puerta abierta para cooperar.",
  email: "team@kondax.tech",
  author: "Agustín Saez C.",
  city: "Santiago, Chile",
} as const;

export const nav = [
  { href: "/lab", label: "Lab" },
  { href: "/notas", label: "Notas" },
  { href: "/cooperar", label: "Cooperar" },
] as const;

export const bannedPublicCopy = [
  "célula",
  "celula",
  "sweat equity",
  "venture studio",
  "factoría",
  "factoria",
  "incubadora",
  "cotizador",
  "passport",
  "cemprendedor",
  "trio",
] as const;
