import type { Metadata } from "next";
import Link from "next/link";
import { NoteRow } from "@/components/lab/note-row";
import { notes, notesSorted } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notas",
  description: "Observaciones precisas. Sin hilo, sin newsletter.",
  alternates: { canonical: "/notas" },
  openGraph: { url: "/notas" },
};

export default function NotesPage() {
  const dated = notesSorted();

  return (
    <main id="contenido" className="page" tabIndex={-1}>
      <div className="shell">
        <div className="prose">
          <p className="kicker">kondax.tech</p>
          <h1 className="display">Notas</h1>
          <p className="lede muted">Un recorte: un hecho, una decisión, un no. Sin hilo y sin newsletter.</p>
        </div>
        <div className="section">
          {notes.length === 0 ? (
            <p className="muted">
              No hay notas publicadas.
              <br />
              Si viste un error, puedes dejar una.
            </p>
          ) : (
            dated.map((item) => <NoteRow key={item.slug} item={item} />)
          )}
        </div>
        <div className="actions">
          <Link className="button ghost" href="/cooperar?intento=nota">
            Dejar una nota
          </Link>
        </div>
      </div>
    </main>
  );
}
