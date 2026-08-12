import type { Metadata } from "next";
import { RoiCalculator } from "@/components/roi/roi-calculator";
import { PageHero, Section } from "@/components/ui/page";

export const metadata: Metadata = {
  title: "ROI corporativo",
  description:
    "Calcula payback y ahorro a 3 años con presets para pyme, corporación y banca.",
};

export default function RoiPage() {
  return (
    <>
      <PageHero
        kicker="Herramienta pública"
        title="Calculadora de ROI corporativo."
        description="Para pymes, corporaciones y banca. Cruza costo laboral, errores operativos y compliance con una implementación Kondax. Elige un preset, sella el resultado y conversa el número."
      />
      <Section>
        <RoiCalculator />
      </Section>
    </>
  );
}
