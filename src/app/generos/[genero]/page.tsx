import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GENRES, genreValueFromSlug } from "@/lib/genres";
import { BeatCard } from "@/components/BeatCard";

// Se lee de la base de datos en cada visita; no pre-renderizar en build.
export const dynamic = "force-dynamic";

export default async function GenrePage({
  params,
}: {
  params: Promise<{ genero: string }>;
}) {
  const { genero } = await params;
  const genreValue = genreValueFromSlug(genero);

  if (!genreValue) {
    notFound();
  }

  const beats = await prisma.beat.findMany({
    where: { genre: genreValue as never },
    orderBy: { createdAt: "desc" },
    include: { producer: { include: { user: true } } },
  });

  return (
    <>
      <div className="genre-filters">
        <Link href="/" className="genre-chip">
          Todos
        </Link>
        {GENRES.map((g) => (
          <Link
            key={g.slug}
            href={`/generos/${g.slug}`}
            className={`genre-chip ${g.slug === genero ? "active" : ""}`}
          >
            {g.label}
          </Link>
        ))}
      </div>

      <div className="beat-grid">
        {beats.map((beat) => (
          <BeatCard
            key={beat.id}
            beat={{
              id: beat.id,
              title: beat.title,
              genre: beat.genre,
              bpm: beat.bpm,
              key: beat.key,
              priceCents: beat.priceCents,
              priceCurrency: beat.priceCurrency,
              producerName: beat.producer.user.name,
            }}
          />
        ))}
        {beats.length === 0 && (
          <p style={{ color: "var(--text-muted)", padding: "2rem" }}>
            Todavía no hay beats en este género.
          </p>
        )}
      </div>
    </>
  );
}
