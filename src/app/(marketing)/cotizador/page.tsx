import type { Metadata } from "next";
import { QuoteCalculator } from "@/components/quote/quote-calculator";
import { PageHero, Section } from "@/components/ui/page";

export const metadata: Metadata = {
  title: "Cotizador",
};

export default function CotizadorPage() {
  return (
    <>
      <PageHero
        kicker="Herramienta pública"
        title="Cotizador inteligente."
        description="Elige audiencia, servicios, alcance y plazo. Kondax estima horas, banda de inversión, composición de la célula y, si aplica, una participación de sweat equity. Puedes sellar el resultado con un hash de auditoría."
      />
      <Section>
        <QuoteCalculator />
      </Section>
    </>
  );
}
