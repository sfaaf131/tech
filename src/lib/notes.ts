export type Note = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  body: string[];
};

export const notes: Note[] = [
  {
    slug: "el-dominio-no-es-una-agencia",
    title: "El dominio no es una agencia",
    date: "2026-08-14",
    summary: "Kursox es la agencia. Kondax es otra cosa, o no es nada.",
    body: [
      "Si este sitio se lee como la landing de una consultora, está mal. Kursox ya existe para ese trabajo.",
      "kondax.tech es corto y suena a producto. Mientras no haya un producto con un verbo, el dominio es este lab: firma de lo que construyo y puerta para quien quiera entrar.",
      "No voy a rellenar con un catálogo para que el dominio “se vea ocupado”.",
    ],
  },
  {
    slug: "como-escribirme",
    title: "Cómo escribirme",
    date: "2026-08-14",
    summary: "Una nota precisa vale más que una intro larga.",
    body: [
      "Usa /cooperar o team@kondax.tech. Di quién eres en una línea, qué viste aquí, y qué propones.",
      "Sirve: “vi el experimento 001, puedo ayudar con X, esto es lo que ya hice”.",
      "No sirve: “me encantaría conectar” ni un pitch de servicios.",
      "Estoy en Santiago. Si hay que verse, se coordina después. Primero el texto.",
    ],
  },
  {
    slug: "que-quedo-afuera",
    title: "Qué quedó afuera",
    date: "2026-08-14",
    summary: "Una lista corta para no volver a inflar el sitio.",
    body: [
      "No hay chat con un modelo. No hay presupuesto automático. No hay listado de verticales.",
      "No hay clientes inventados, ni métricas, ni equipo de diez personas.",
      "Si más adelante hay un producto, el lab lo anota. Hasta entonces, esto es el producto: el taller a la vista.",
    ],
  },
];

export function noteBySlug(slug: string) {
  return notes.find((item) => item.slug === slug);
}
