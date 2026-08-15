export type Note = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  body: string[];
  related?: string;
};

export const notes: Note[] = [
  {
    slug: "se-borro-la-factory",
    title: "Se borró la factory",
    date: "2026-08-14",
    summary: "El sitio anterior se eliminó. No hay portfolio que rescatar de esa capa.",
    related: "este-sitio",
    body: [
      "El sitio anterior vendía un catálogo que no era un producto, y gastaba el dominio.",
      "Se eliminó. Kondax no es un estudio de venture. Es un nombre de producto usado, por ahora, como taller.",
    ],
  },
  {
    slug: "kursox-no-es-esto",
    title: "Kursox no es esto",
    date: "2026-08-14",
    summary: "Kursox es una agencia aparte. Este dominio no es su landing.",
    body: [
      "Kursox existe. Es una agencia, y es otra cosa.",
      "kondax.tech no es su landing, no lista sus servicios, no pide cotización. Si llegaste por Kursox, esto igual no es un brochure con otro nombre.",
    ],
  },
  {
    slug: "en-blanco-a-proposito",
    title: "En blanco a propósito",
    date: "2026-08-14",
    summary: "El dominio estuvo en blanco para no rellenar. Esta es la primera publicación después.",
    related: "este-sitio",
    body: [
      "Antes de este taller el dominio mostraba solo “kondax.tech”. No era un WIP de marketing. Era la decisión de no rellenar.",
      "Este taller es la primera cosa publicada después de eso. Sigue aplicando la misma regla: si no hay caso, no hay ítem.",
    ],
  },
];

export function noteBySlug(slug: string) {
  return notes.find((item) => item.slug === slug);
}
