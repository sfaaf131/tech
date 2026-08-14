export const experimentStatuses = ["abierto", "pausa", "cerrado"] as const;

export type ExperimentStatus = (typeof experimentStatuses)[number];

export type Experiment = {
  slug: string;
  number: string;
  title: string;
  status: ExperimentStatus;
  opened: string;
  summary: string;
  body: string[];
  ask: string;
};

export const experiments: Experiment[] = [
  {
    slug: "este-sitio",
    number: "001",
    title: "Este sitio",
    status: "abierto",
    opened: "2026-08-14",
    summary: "El lab mismo. Una bitácora pública de lo que se está construyendo.",
    body: [
      "kondax.tech estuvo en blanco a propósito. Antes era un brochure. Eso se borró.",
      "Este experimento es el reemplazo: un taller a la vista. Pocas rutas, copy honesta, una puerta para entrar.",
      "No hay catálogo de servicios. No hay pitch. Si el sitio se siente como agencia, falló.",
    ],
    ask: "Si algo del lab te sirve, usa Cooperar y di qué parte y por qué.",
  },
  {
    slug: "puerta-abierta",
    number: "002",
    title: "Puerta abierta",
    status: "abierto",
    opened: "2026-08-14",
    summary: "Un formulario preciso. Sin reunión por defecto.",
    body: [
      "Cooperar aquí no es pedir una demo. Es dejar una nota que se pueda responder.",
      "Tres intenciones: entrar a un experimento, dejar una observación, o proponer trabajo conjunto.",
      "Si el mensaje es vago, no hay respuesta. Si es concreto, sí.",
    ],
    ask: "Escribe con un hecho, un contexto y una pregunta. Nada de “hablemos”.",
  },
  {
    slug: "borrar-la-factory",
    number: "000",
    title: "Borrar la factory",
    status: "cerrado",
    opened: "2026-08-14",
    summary: "El dominio era un brochure. Se vació. Queda cerrado a propósito.",
    body: [
      "Había una factory, un catálogo y un discurso de socio técnico. No era un producto. Ocupaba el nombre.",
      "Se eliminó. El holding en blanco era mejor que fingir una empresa que no existía en esa forma.",
      "Este registro queda para no revivir eso con otro nombre.",
    ],
    ask: "No hay que entrar aquí. Si te interesa lo que viene, mira 001 y 002.",
  },
];

export function experimentBySlug(slug: string) {
  return experiments.find((item) => item.slug === slug);
}

export function openExperiments() {
  return experiments.filter((item) => item.status === "abierto");
}

export function statusLabel(status: ExperimentStatus) {
  if (status === "abierto") return "abierto";
  if (status === "pausa") return "en pausa";
  return "cerrado";
}
