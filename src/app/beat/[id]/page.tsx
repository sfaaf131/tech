import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BuyButton } from "@/components/BuyButton";
import { ContactProducerButton } from "@/components/ContactProducerButton";

function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat("es", { style: "currency", currency }).format(
    cents / 100
  );
}

export default async function BeatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const beat = await prisma.beat.findUnique({
    where: { id },
    include: { producer: { include: { user: true } }, stems: true },
  });

  if (!beat) {
    notFound();
  }

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>{beat.title}</h1>
      <p style={{ color: "var(--text-muted)" }}>
        Por {beat.producer.user.name} · {beat.genre} · {beat.bpm} BPM ·{" "}
        {beat.key}
      </p>

      <audio controls src={beat.previewFileUrl} style={{ width: "100%", margin: "1rem 0" }}>
        Tu navegador no soporta audio HTML5.
      </audio>
      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
        Preview de {beat.previewDurationSeconds}s con marca de agua. El archivo
        completo se desbloquea tras la compra.
      </p>

      <div style={{ marginTop: "1.5rem" }}>
        <h3>Stems incluidos</h3>
        {beat.stems.length > 0 ? (
          <ul>
            {beat.stems.map((stem) => (
              <li key={stem.id}>{stem.label}</li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "var(--text-muted)" }}>
            Este beat no incluye stems por separado.
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "2rem",
          padding: "1rem",
          border: "1px solid var(--border)",
          borderRadius: 12,
        }}
      >
        <span className="beat-price" style={{ fontSize: "1.5rem" }}>
          {formatPrice(beat.priceCents, beat.priceCurrency)}
        </span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <ContactProducerButton producerUserId={beat.producer.user.id} />
          <BuyButton beatId={beat.id} />
        </div>
      </div>
    </div>
  );
}
