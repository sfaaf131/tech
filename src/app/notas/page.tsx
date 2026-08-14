import type { Metadata } from "next";
import { NoteRow } from "@/components/lab/note-row";
import { notes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notas",
  description: "Observaciones precisas. Sin hilo, sin newsletter.",
  alternates: { canonical: "/notas" },
};

export default function NotesPage() {
  return (
    <main id="contenido" className="page" tabIndex={-1}>
      <div className="shell">
        <div className="prose">
          <p className="kicker">bitácora</p>
          <h1 className="display">Notas</h1>
          <p className="lede muted">
            Una nota es un recorte útil: un hecho, una decisión, un no. No es un artículo. No pide
            follow.
          </p>
        </div>
        <div className="section">
          {notes.length === 0 ? (
            <p className="muted">Todavía no hay notas publicadas.</p>
          ) : (
            notes.map((item) => <NoteRow key={item.slug} item={item} />)
          )}
        </div>
      </div>
    </main>
  );
}
