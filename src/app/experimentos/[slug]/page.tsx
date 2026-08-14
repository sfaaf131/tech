import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { experimentBySlug, experiments, statusLabel } from "@/lib/lab";
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
  if (!item) return { title: "Experimento" };
  return {
    title: `${item.title} — Experimentos`,
    description: item.question,
    alternates: { canonical: `/experimentos/${item.slug}` },
  };
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
          {statusLabel(item.status)} · actualizado {formatDate(item.opened)}
        </p>
        <h1 className="display">{item.title}</h1>
        <p className="lede">{item.question}</p>
        <div className="section">
          {item.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {item.status === "abierto" ? (
          <div className="banner section">
            <p>
              <strong>Qué está abierto.</strong> {item.open}
            </p>
          </div>
        ) : (
          <div className="banner section">
            <p>Cerrado. Queda el registro.</p>
          </div>
        )}
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
          {item.openToJoin ? (
            <Link className="button" href={`/cooperar?intento=entrar&experimento=${item.slug}`}>
              Entrar a este experimento
            </Link>
          ) : null}
          <Link className="button ghost" href="/experimentos">
            Volver al índice
          </Link>
        </div>
      </div>
    </main>
  );
}
