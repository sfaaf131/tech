import type { Metadata } from "next";
import { RoiCalculator } from "@/components/roi/roi-calculator";
import { PageHero, Section } from "@/components/ui/page";

export const metadata: Metadata = {
  title: "ROI corporativo",
};

export default function RoiPage() {
  return (
    <>
      <PageHero
        kicker="Herramienta pública"
        title="Calculadora de ROI corporativo."
        description="Para pymes, corporaciones y banca. Cruza costo laboral, errores operativos y compliance con una implementación Kondax. El resultado es payback, ahorro a 3 años y ROI."
      />
      <Section>
        <RoiCalculator />
      </Section>
    </>
  );
}
