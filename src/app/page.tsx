import Link from "next/link";
import { ExperimentRow } from "@/components/lab/experiment-row";
import { NoteRow } from "@/components/lab/note-row";
import { experimentsSorted } from "@/lib/lab";
import { notes } from "@/lib/notes";
import { site } from "@/lib/site";

export default function HomePage() {
  const published = experimentsSorted();

  return (
    <main id="contenido" className="page" tabIndex={-1}>
      <div className="shell">
        <p className="kicker">{site.host}</p>
        <h1 className="display">Taller público. Puerta abierta.</h1>
        <p className="lede">
          Soy {site.author} — construyo a la vista, desde Santiago. Si te sirve, léelo. Si quieres
          sumarte, cooperar.
        </p>
        <div className="actions">
          <Link className="button ghost" href="/experimentos">
            Ver experimentos
          </Link>
          <Link className="button" href="/cooperar">
            Cooperar
          </Link>
        </div>

        <section className="section" aria-labelledby="experimentos-heading">
          <div className="section-head">
            <div>
              <h2 id="experimentos-heading">Experimentos</h2>
              <p>Los que están publicados.</p>
            </div>
            <Link href="/experimentos">Todos</Link>
          </div>
          {published.length === 0 ? (
            <p className="muted">No hay experimentos publicados.</p>
          ) : (
            published.map((item) => <ExperimentRow key={item.slug} item={item} heading="h3" />)
          )}
        </section>

        <section className="section" aria-labelledby="notas-heading">
          <div className="section-head">
            <div>
              <h2 id="notas-heading">Notas</h2>
              <p>Recortes fechados. Sin hilo.</p>
            </div>
            <Link href="/notas">Todas</Link>
          </div>
          {notes.length === 0 ? (
            <p className="muted">No hay notas publicadas.</p>
          ) : (
            notes.map((item) => <NoteRow key={item.slug} item={item} heading="h3" />)
          )}
        </section>

        <section className="section" aria-labelledby="entrar-heading">
          <h2 id="entrar-heading" className="section-title">
            Cómo entrar
          </h2>
          <p className="lede">Tres caminos. Ninguno pide reunión.</p>
          <ol className="list">
            <li>
              <Link href="/cooperar?intento=entrar">Entrar a un experimento que ya está abierto.</Link>
            </li>
            <li>
              <Link href="/cooperar?intento=nota">
                Dejar una nota precisa — un hecho, un error, un recorte.
              </Link>
            </li>
            <li>
              <Link href="/cooperar?intento=proponer">
                Proponer trabajo conjunto, con un caso concreto.
              </Link>
            </li>
          </ol>
        </section>

        <p className="who">
          {site.author} · {site.city}
          <br />
          Kursox es una agencia aparte. Este dominio no es su landing.
        </p>
      </div>
    </main>
  );
}
