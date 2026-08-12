import type { Metadata } from "next";
import { ButtonLink, PageHero, Section, Kicker } from "@/components/ui/page";

export const metadata: Metadata = {
  title: "Fábrica",
};

const seats = [
  { role: "Tech lead", duty: "Arquitectura, ritmo y calidad de la célula." },
  { role: "Ingeniería", duty: "Producto, APIs, datos e integraciones." },
  { role: "QA", duty: "Regresión, seguridad funcional y evidencia de release." },
  { role: "ML / agentes", duty: "Automatización, evaluación y supervisión." },
  { role: "Cumplimiento", duty: "Controles, logs y requisitos de banca." },
];

export default function FabricaPage() {
  return (
    <>
      <PageHero
        kicker="Células ágiles de ingeniería"
        title="Una fábrica que se queda con el contexto."
        description="Kondax no rota contratistas. Arma células que planifican, entregan y acumulan conocimiento del dominio — con tarifas por hora transparentes y, cuando el proyecto se co-crea, una vía de sweat equity."
        actions={
          <>
            <ButtonLink href="/cotizador">Armar una célula</ButtonLink>
            <ButtonLink href="/agentes" tone="ghost">
              Agente Célula
            </ButtonLink>
          </>
        }
      />
      <Section>
        <Kicker>Cómo opera</Kicker>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Descubrimiento", "El agente Célula (Grok 4.6) arma alcance, riesgos, stack y criterio de done. El cotizador es el primer artefacto."],
            ["Célula", "Lead, ingeniería y especialidades según el trabajo: IA, mobile, riesgo, identidad."],
            ["Evidencia", "Horas, commits, despliegues y sello de auditoría. El cliente ve el rastro."],
          ].map(([title, text]) => (
            <article key={title} className="cell p-6">
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-mist">{text}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section className="pt-0">
        <Kicker>Asientos de la célula</Kicker>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {seats.map((seat) => (
            <div key={seat.role} className="grid gap-2 py-5 md:grid-cols-[220px_1fr]">
              <p className="font-display text-xl">{seat.role}</p>
              <p className="text-mist">{seat.duty}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section className="pt-0">
        <div className="cell p-8 md:p-12">
          <Kicker>Tarifa de fábrica</Kicker>
          <h2 className="font-display mt-4 text-3xl md:text-4xl">
            De USD 55 a USD 125 por hora, según audiencia y criticidad.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-mist">
            Emprendedores pagan una banda de estudio. Banca paga la banda de
            cumplimiento: ambientes segregados, revisiones y evidencias. El cotizador
            aplica la banda correcta y estima horas con solapamiento realista entre
            servicios.
          </p>
          <div className="mt-8">
            <ButtonLink href="/cotizador">Calcular horas y banda</ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
