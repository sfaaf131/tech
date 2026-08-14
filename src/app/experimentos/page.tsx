import type { Metadata } from "next";
import Link from "next/link";
import { ExperimentRow } from "@/components/lab/experiment-row";
import { experimentsSorted } from "@/lib/lab";

export const metadata: Metadata = {
  title: "Experimentos",
  description: "Lo que está en el banco. Poco, y a la vista.",
  alternates: { canonical: "/experimentos" },
};

export default function ExperimentsPage() {
  const items = experimentsSorted();

  return (
    <main id="contenido" className="page" tabIndex={-1}>
      <div className="shell">
        <div className="prose">
          <p className="kicker">taller</p>
          <h1 className="display">Experimentos</h1>
          <p className="lede muted">
            Un experimento es una pregunta en construcción, no un producto vendido. Si no hay más
            ítems, no se rellena.
          </p>
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
          <Link className="button ghost" href="/cooperar?intento=proponer">
            Proponer trabajo conjunto
          </Link>
        </div>
      </div>
    </main>
  );
}
