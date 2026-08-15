import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { experimentBySlug } from "@/lib/lab";
import { noteBySlug, notes } from "@/lib/notes";
import { formatDate } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return notes.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = noteBySlug(slug);
  if (!item) return { title: "Nota", robots: { index: false, follow: false } };
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: `/notas/${item.slug}` },
    openGraph: {
      url: `/notas/${item.slug}`,
      type: "article",
      publishedTime: item.date,
    },
  };
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const item = noteBySlug(slug);
  if (!item) notFound();
  const related = item.related ? experimentBySlug(item.related) : undefined;

  return (
    <main id="contenido" className="page" tabIndex={-1}>
      <div className="shell prose">
        <p className="kicker">
          nota · <time dateTime={item.date}>{formatDate(item.date)}</time>
        </p>
        <h1 className="display">{item.title}</h1>
        <div className="section">
          {item.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {related ? (
          <p className="muted">
            Va con: <Link href={`/experimentos/${related.slug}`}>{related.title}</Link>
          </p>
        ) : null}
        <div className="actions">
          <Link className="button" href="/cooperar?intento=nota">
            Dejar una nota
          </Link>
          <Link className="button ghost" href="/notas">
            Todas las notas
          </Link>
        </div>
      </div>
    </main>
  );
}
