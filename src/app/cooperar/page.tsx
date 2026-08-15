import type { Metadata } from "next";
import { Suspense } from "react";
import { CooperateForm } from "@/components/forms/cooperate-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cooperar",
  description: "Entra a un experimento, deja una nota, o propone trabajo conjunto.",
  alternates: { canonical: "/cooperar" },
  openGraph: { url: "/cooperar" },
};

export default function CooperatePage() {
  return (
    <main id="contenido" className="page" tabIndex={-1}>
      <div className="shell">
        <div className="prose">
          <p className="kicker">kondax.tech</p>
          <h1 className="display">Cooperar</h1>
          <p className="lede">
            Escribe algo concreto. “Hola, conectemos” no sirve. Si no hay encaje, no invento uno.
          </p>
          <p className="section-lead">
            Llega a {site.email}. Respondo si hay algo que hacer juntos.
          </p>
        </div>
        <div className="section">
          <Suspense fallback={<p className="muted">Cargando el formulario…</p>}>
            <CooperateForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
