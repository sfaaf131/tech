import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { experimentBySlug, experiments, isOpenExperimentSlug, statusLabel } from "@/lib/lab";
import { notes } from "@/lib/notes";
import { formatDate } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return experiments.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = experimentBySlug(slug);
  if (!item) return { title: "Experimento", robots: { index: false, follow: false } };
  return {
    title: `${item.title} — Experimentos`,
    description: item.question,
    alternates: { canonical: `/experimentos/${item.slug}` },
    openGraph: { url: `/experimentos/${item.slug}` },
  };
}

function statusBanner(status: "abierto" | "pausa" | "cerrado", open: string) {
  if (status === "abierto") {
    return (
      <p>
        <strong>Qué se puede hacer.</strong> {open}
      </p>
    );
  }
  if (status === "pausa") {
    return <p>En pausa. No se entra por ahora.</p>;
  }
  return <p>Cerrado. Queda el registro.</p>;
}

export default async function ExperimentPage({ params }: Props) {
  const { slug } = await params;
  const item = experimentBySlug(slug);
  if (!item) notFound();

  const related = notes.filter((note) => note.related === item.slug);

  return (
    <main id="contenido" className="page" tabIndex={-1}>
      <div className="shell prose">
        <p className="kicker">
          <span className="status-mark" data-state={item.status} aria-hidden="true" />
          {statusLabel(item.status)}
          {item.status === "abierto" ? ` · abierto ${formatDate(item.opened)}` : ` · ${formatDate(item.opened)}`}
        </p>
        <h1 className="display">{item.title}</h1>
        <p className="lede">{item.question}</p>
        <div className="section">
          {item.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="banner section">{statusBanner(item.status, item.open)}</div>
        {related.length > 0 ? (
          <div className="section">
            <p className="kicker">Notas ligadas</p>
            <ul className="list">
              {related.map((note) => (
                <li key={note.slug}>
                  <Link href={`/notas/${note.slug}`}>{note.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="actions">
          {isOpenExperimentSlug(item.slug) ? (
            <Link className="button" href={`/cooperar?intento=entrar&experimento=${item.slug}`}>
              Entrar a este experimento
            </Link>
          ) : null}
          <Link className="button ghost" href="/experimentos">
            Todos los experimentos
          </Link>
        </div>
      </div>
    </main>
  );
}
