// Lista de géneros disponibles, debe coincidir con el enum Genre de prisma/schema.prisma

export const GENRES = [
  { value: "INDIE", label: "Indie", slug: "indie" },
  { value: "HIPHOP", label: "Hip-Hop", slug: "hiphop" },
  { value: "TRAP", label: "Trap", slug: "trap" },
  { value: "POP", label: "Pop", slug: "pop" },
  { value: "LOFI", label: "Lo-fi", slug: "lofi" },
  { value: "REGGAETON", label: "Reggaetón", slug: "reggaeton" },
  { value: "RNB", label: "R&B", slug: "rnb" },
  { value: "ELECTRONICA", label: "Electrónica", slug: "electronica" },
  { value: "ROCK", label: "Rock", slug: "rock" },
  { value: "OTRO", label: "Otro", slug: "otro" },
] as const;

export type GenreSlug = (typeof GENRES)[number]["slug"];

export function genreLabelFromSlug(slug: string): string {
  return GENRES.find((g) => g.slug === slug)?.label ?? slug;
}

export function genreValueFromSlug(slug: string): string | undefined {
  return GENRES.find((g) => g.slug === slug)?.value;
}
