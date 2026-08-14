import type { Metadata } from "next";
import { NoteRow } from "@/components/lab/note-row";
import { notes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notas",
  description: "Notas del lab: dominio, cómo escribir, qué quedó afuera.",
  alternates: { canonical: "/notas" },
};

export default function NotesPage() {
  return (
    <main id="contenido" className="page">
      <div className="shell prose">
        <p className="kicker">bitácora</p>
        <h1 className="display">Notas</h1>
        <p className="lede muted">
          Una nota es una observación cerrada. No se itera como un experimento. Se deja y se puede
          contradecir después.
        </p>
      </div>
      <div className="shell section">
        {notes.map((item) => (
          <NoteRow key={item.slug} item={item} />
        ))}
      </div>
    </main>
  );
}
