import type { Metadata } from "next";
import { QuoteCalculator } from "@/components/quote/quote-calculator";
import { PageHero, Section } from "@/components/ui/page";

export const metadata: Metadata = {
  title: "Cotizador",
  description:
    "Estima horas, banda de inversión y composición de una célula Kondax. Comparte el enlace y sella la cotización.",
};

export default function CotizadorPage() {
  return (
    <>
      <PageHero
        kicker="Herramienta pública"
        title="Cotizador inteligente."
        description="Elige audiencia, servicios, alcance y plazo. Kondax estima horas, banda de inversión, composición de la célula y, si aplica, una participación de sweat equity. El enlace se puede compartir y el resultado se puede sellar."
      />
      <Section>
        <QuoteCalculator />
      </Section>
    </>
  );
}
