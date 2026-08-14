import Link from "next/link";
import { ExperimentRow } from "@/components/lab/experiment-row";
import { NoteRow } from "@/components/lab/note-row";
import { experimentsSorted } from "@/lib/lab";
import { notes } from "@/lib/notes";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <main id="contenido" className="page" tabIndex={-1}>
      <div className="shell">
        <p className="kicker">{site.host}</p>
        <h1 className="display">Taller público. Puerta abierta.</h1>
        <p className="lede">
          Soy {site.author}. Esto es lo que estoy construyendo, a la vista. No es una agencia. No es
          un diario cerrado. Si algo te sirve, entra.
        </p>
        <div className="actions">
          <Link className="button" href="/cooperar">
            Cooperar
          </Link>
          <Link className="button ghost" href="/experimentos">
            Ver experimentos
          </Link>
        </div>

        <section className="section" aria-labelledby="banco-heading">
          <div className="section-head">
            <div>
              <h2 id="banco-heading">En el banco</h2>
              <p>Poco, y real.</p>
            </div>
            <Link href="/experimentos">Índice</Link>
          </div>
          <div>
            {experimentsSorted().map((item) => (
              <ExperimentRow key={item.slug} item={item} />
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="notas-heading">
          <div className="section-head">
            <div>
              <h2 id="notas-heading">Notas</h2>
              <p>Una observación por vez.</p>
            </div>
            <Link href="/notas">Todas</Link>
          </div>
          <div>
            {notes.map((item) => (
              <NoteRow key={item.slug} item={item} />
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="puerta-heading">
          <h2 id="puerta-heading" className="display" style={{ fontSize: "var(--t-h2)" }}>
            Si quieres entrar
          </h2>
          <p className="lede" style={{ fontSize: "var(--t-body)" }}>
            Tres formas, ninguna es un pitch:
          </p>
          <ol className="list">
            <li>Entrar a un experimento que ya está abierto.</li>
            <li>Dejar una nota precisa — un hecho, un error, un recorte.</li>
            <li>Proponer trabajo conjunto, con un objeto concreto.</li>
          </ol>
          <div className="actions">
            <Link className="button" href="/cooperar">
              Cooperar
            </Link>
          </div>
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
