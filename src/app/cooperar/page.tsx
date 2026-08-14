import type { Metadata } from "next";
import { Suspense } from "react";
import { CooperateForm } from "@/components/forms/cooperate-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cooperar",
  description: "Deja una nota precisa para entrar a un experimento o proponer trabajo conjunto.",
  alternates: { canonical: "/cooperar" },
};

export default function CooperatePage() {
  return (
    <main id="contenido" className="page">
      <div className="shell">
        <div className="prose">
          <p className="kicker">puerta</p>
          <h1 className="display">Cooperar</h1>
          <p className="lede">
            No es un formulario de ventas. Es una nota que se pueda responder. Si prefieres correo:{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
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
