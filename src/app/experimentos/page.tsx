import type { Metadata } from "next";
import Link from "next/link";
import { ExperimentRow } from "@/components/lab/experiment-row";
import { experimentsSorted } from "@/lib/lab";

export const metadata: Metadata = {
  title: "Experimentos",
  description: "Lo que está publicado. Poco, y a la vista.",
  alternates: { canonical: "/experimentos" },
  openGraph: { url: "/experimentos" },
};

export default function ExperimentsPage() {
  const items = experimentsSorted();

  return (
    <main id="contenido" className="page" tabIndex={-1}>
      <div className="shell">
        <div className="prose">
          <p className="kicker">kondax.tech</p>
          <h1 className="display">Experimentos</h1>
          <p className="lede muted">Una pregunta en construcción. Las que hay están abajo.</p>
        </div>
        <div className="section">
          {items.length === 0 ? (
            <p className="muted">
              No hay experimentos publicados.
              <br />
              Eso no es un error. Es el estado.
            </p>
          ) : (
            items.map((item) => <ExperimentRow key={item.slug} item={item} />)
          )}
        </div>
        <div className="actions">
          <Link className="button" href="/cooperar?intento=entrar">
            Entrar a uno abierto
          </Link>
          <Link className="button ghost" href="/cooperar?intento=nota">
            Dejar una nota
          </Link>
        </div>
      </div>
    </main>
  );
}
