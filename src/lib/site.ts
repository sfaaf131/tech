export const site = {
  name: "Kondax",
  domain: "kondax.tech",
  url: "https://kondax.tech",
  email: "team@kondax.tech",
  tagline: "Incubamos con IA. Ejecutamos con células de ingeniería.",
  description:
    "Kondax.tech une incubación y automatización con IA con ejecución técnica mediante células ágiles. SaaS para emprendedores, fábrica de software para empresas y banca, y co-creación con sweat equity.",
} as const;

export const nav = [
  { href: "/incubadora", label: "Incubadora" },
  { href: "/fabrica", label: "Fábrica" },
  { href: "/enterprise", label: "Enterprise" },
  { href: "/servicios", label: "Servicios" },
] as const;

export const toolNav = [
  { href: "/cotizador", label: "Cotizar" },
  { href: "/roi", label: "ROI" },
] as const;

export const footerNav = {
  Plataforma: [
    { href: "/incubadora", label: "Incubadora y marketplace" },
    { href: "/fabrica", label: "Fábrica de software" },
    { href: "/enterprise", label: "Pymes, corporaciones y banca" },
    { href: "/modelo", label: "Modelo y monetización" },
  ],
  Producto: [
    { href: "/servicios", label: "Matriz de servicios" },
    { href: "/cotizador", label: "Cotizador inteligente" },
    { href: "/roi", label: "Calculadora de ROI" },
    { href: "/passport", label: "Kondax Passport" },
  ],
  Confianza: [
    { href: "/seguridad", label: "Seguridad y cumplimiento" },
    { href: "/contacto", label: "Contacto" },
    { href: "/app", label: "Aplicación privada" },
  ],
} as const;

export const usdToClp = 950;
