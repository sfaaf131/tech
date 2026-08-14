import Link from "next/link";
import { ExperimentRow } from "@/components/lab/experiment-row";
import { NoteRow } from "@/components/lab/note-row";
import { experiments } from "@/lib/lab";
import { notes } from "@/lib/notes";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <main id="contenido" className="page">
      <div className="shell">
        <p className="kicker">{site.tagline}</p>
        <h1 className="display">
          Lo que construyo,
          <br />
          a la vista.
        </h1>
        <p className="lede">
          Taller de {site.author} en {site.city}. No es una agencia. Si un experimento te sirve,
          entra. Si tienes una nota precisa, déjala.
        </p>
        <div className="actions">
          <Link className="button" href="/cooperar">
            Cooperar
          </Link>
          <Link className="button ghost" href="/lab">
            Ver el lab
          </Link>
        </div>

        <section className="section" aria-labelledby="exp-heading">
          <div className="section-head">
            <h2 id="exp-heading">Experimentos</h2>
            <Link href="/lab">Índice</Link>
          </div>
          <div>
            {experiments.map((item) => (
              <ExperimentRow key={item.slug} item={item} />
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="notes-heading">
          <div className="section-head">
            <h2 id="notes-heading">Notas</h2>
            <Link href="/notas">Todas</Link>
          </div>
          <div>
            {notes.map((item) => (
              <NoteRow key={item.slug} item={item} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
