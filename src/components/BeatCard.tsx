import Link from "next/link";

export type BeatCardData = {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  key: string;
  priceCents: number;
  priceCurrency: string;
  producerName: string;
};

function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat("es", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function BeatCard({ beat }: { beat: BeatCardData }) {
  return (
    <Link href={`/beat/${beat.id}`} className="beat-card">
      <h3>{beat.title}</h3>
      <div className="beat-meta">
        {beat.producerName} · {beat.bpm} BPM · {beat.key}
      </div>
      <div className="beat-price">
        {formatPrice(beat.priceCents, beat.priceCurrency)}
      </div>
    </Link>
  );
}
