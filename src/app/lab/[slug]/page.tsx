import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { experimentBySlug, experiments, statusLabel } from "@/lib/lab";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return experiments.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = experimentBySlug(slug);
  if (!item) return { title: "Experimento" };
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: `/lab/${item.slug}` },
  };
}

export default async function ExperimentPage({ params }: Props) {
  const { slug } = await params;
  const item = experimentBySlug(slug);
  if (!item) notFound();

  return (
    <main id="contenido" className="page">
      <div className="shell prose">
        <p className="kicker">
          {item.number} · {statusLabel(item.status)} · {item.opened}
        </p>
        <h1 className="display">{item.title}</h1>
        <p className="lede">{item.summary}</p>
        <div className="section">
          {item.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="banner section">
          <p>{item.ask}</p>
        </div>
        <div className="actions">
          <Link className="button" href={`/cooperar?exp=${item.slug}`}>
            Entrar o dejar nota
          </Link>
          <Link className="button ghost" href="/lab">
            Volver al índice
          </Link>
        </div>
      </div>
    </main>
  );
}
