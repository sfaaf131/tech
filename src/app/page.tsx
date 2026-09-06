import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GENRES } from "@/lib/genres";
import { BeatCard } from "@/components/BeatCard";

// El catálogo se lee de la base de datos en cada visita, así que no debe
// pre-renderizarse durante el build (no hay base de datos disponible ahí).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const beats = await prisma.beat.findMany({
    orderBy: { createdAt: "desc" },
    take: 24,
    include: { producer: { include: { user: true } } },
  });

  return (
    <>
      <div className="genre-filters">
        <span className="genre-chip active">Todos</span>
        {GENRES.map((g) => (
          <Link key={g.slug} href={`/generos/${g.slug}`} className="genre-chip">
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
            Todavía no hay beats publicados. ¡Sé el primer productor en subir uno!
          </p>
        )}
      </div>
    </>
  );
}
