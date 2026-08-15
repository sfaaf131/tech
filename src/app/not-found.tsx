import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "No está",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="contenido" className="page" tabIndex={-1}>
      <div className="shell prose">
        <p className="kicker">404</p>
        <h1 className="display">No está.</h1>
        <p className="lede muted">Esa URL no existe en este taller.</p>
        <div className="actions">
          <Link className="button" href="/">
            Al taller
          </Link>
          <Link className="button ghost" href="/experimentos">
            Experimentos
          </Link>
          <Link className="button ghost" href="/notas">
            Notas
          </Link>
        </div>
      </div>
    </main>
  );
}
