import type { Metadata } from "next";
import { CooperateForm } from "@/components/forms/cooperate-form";
import { cooperateCopy, presetFromSearch } from "@/lib/cooperate";

export const metadata: Metadata = {
  title: "Cooperar",
  description: "Entra a un experimento, deja una nota, o propone trabajo conjunto.",
  alternates: { canonical: "/cooperar" },
  openGraph: { url: "/cooperar" },
};

type Props = {
  searchParams: Promise<{
    intento?: string | string[];
    intent?: string | string[];
    experimento?: string | string[];
    exp?: string | string[];
  }>;
};

export default async function CooperatePage({ searchParams }: Props) {
  const preset = presetFromSearch(await searchParams);

  return (
    <main id="contenido" className="page" tabIndex={-1}>
      <div className="shell">
        <div className="prose">
          <p className="kicker">kondax.tech</p>
          <h1 className="display">Cooperar</h1>
          <p className="lede">
            Escribe algo concreto. “Hola, conectemos” no sirve. Si no hay encaje, no invento uno.
          </p>
          <p className="section-lead">{cooperateCopy.pageLead}</p>
        </div>
        <div className="section">
          <CooperateForm
            presetIntent={preset.presetIntent}
            presetExperiment={preset.presetExperiment}
          />
        </div>
      </div>
    </main>
  );
}
