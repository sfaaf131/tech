import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "No está",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="contenido" className="page">
      <div className="shell prose">
        <p className="kicker">404</p>
        <h1 className="display">Eso no está en el lab.</h1>
        <p className="lede muted">La ruta no existe. El índice sí.</p>
        <div className="actions">
          <Link className="button" href="/">
            Inicio
          </Link>
          <Link className="button ghost" href="/lab">
            Lab
          </Link>
        </div>
      </div>
    </main>
  );
}
