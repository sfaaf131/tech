import type { Metadata } from "next";
import { ExperimentRow } from "@/components/lab/experiment-row";
import { experiments } from "@/lib/lab";

export const metadata: Metadata = {
  title: "Lab",
  description: "Índice de experimentos del lab personal cooperativo.",
  alternates: { canonical: "/lab" },
};

export default function LabPage() {
  return (
    <main id="contenido" className="page">
      <div className="shell prose">
        <p className="kicker">índice</p>
        <h1 className="display">Lab</h1>
        <p className="lede muted">
          Un experimento es una cosa en curso, con estado. No es un servicio. No es un case study.
        </p>
      </div>
      <div className="shell section">
        {experiments.map((item) => (
          <ExperimentRow key={item.slug} item={item} />
        ))}
      </div>
    </main>
  );
}
