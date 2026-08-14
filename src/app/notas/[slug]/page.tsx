import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { noteBySlug, notes } from "@/lib/notes";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return notes.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = noteBySlug(slug);
  if (!item) return { title: "Nota" };
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: `/notas/${item.slug}` },
  };
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const item = noteBySlug(slug);
  if (!item) notFound();

  return (
    <main id="contenido" className="page">
      <div className="shell prose">
        <p className="kicker">
          nota · <time dateTime={item.date}>{item.date}</time>
        </p>
        <h1 className="display">{item.title}</h1>
        <p className="lede">{item.summary}</p>
        <div className="section">
          {item.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="actions">
          <Link className="button ghost" href="/notas">
            Todas las notas
          </Link>
        </div>
      </div>
    </main>
  );
}
