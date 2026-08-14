export const experimentStatuses = ["abierto", "pausa", "cerrado"] as const;

export type ExperimentStatus = (typeof experimentStatuses)[number];

export type Experiment = {
  slug: string;
  title: string;
  status: ExperimentStatus;
  opened: string;
  question: string;
  summary: string;
  body: string[];
  open: string;
  openToJoin: boolean;
};

export const experiments: Experiment[] = [
  {
    slug: "este-sitio",
    title: "Este sitio",
    status: "abierto",
    opened: "2026-08-14",
    question:
      "¿Un taller a la vista sirve más que una página en blanco o una landing de factory?",
    summary: "kondax.tech deja de estar vacío. Pasa a ser la firma de lo que construyo, con puerta.",
    body: [
      "El sitio anterior era una factory. Se eliminó. El dominio quedó en blanco a propósito: rellenar con un catálogo o un chat no aprovecha el nombre.",
      "Este experimento es el propio kondax.tech: un taller personal, cooperativo, sin catálogo. Si en un mes nadie usa la puerta, se vuelve a evaluar. No se rellena con trabajo inventado.",
    ],
    open: "Leer, marcar un error, o proponer una pieza concreta: copy, diseño, o un experimento nuevo con objeto.",
    openToJoin: true,
  },
  {
    slug: "la-puerta",
    title: "La puerta",
    status: "abierto",
    opened: "2026-08-14",
    question:
      "¿Alguien puede entrar con un objeto preciso, sin que esto se vuelva un embudo de ventas?",
    summary: "El formulario de cooperar. Tres intentos, ninguno es “agendemos”.",
    body: [
      "Cooperar aquí no es postular a un equipo ni pedir una cotización. Es entrar a un experimento, dejar una nota, o proponer trabajo conjunto con un objeto.",
      "Si la puerta se usa para networking vacío, se estrecha. Si no se usa, el taller sigue siendo mío y público, no un diario.",
    ],
    open: "Usarla. Si falla —validación, tono, fricción— deja una nota con el caso.",
    openToJoin: true,
  },
];

export function experimentBySlug(slug: string) {
  return experiments.find((item) => item.slug === slug);
}

export function openExperiments() {
  return experiments.filter((item) => item.status === "abierto" && item.openToJoin);
}

export function statusLabel(status: ExperimentStatus) {
  if (status === "abierto") return "en curso";
  if (status === "pausa") return "en pausa";
  return "cerrado";
}

export function experimentsSorted() {
  const rank = { abierto: 0, pausa: 1, cerrado: 2 } as const;
  return [...experiments].sort((a, b) => {
    const byStatus = rank[a.status] - rank[b.status];
    if (byStatus !== 0) return byStatus;
    return b.opened.localeCompare(a.opened);
  });
}
