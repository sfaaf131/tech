import type { Metadata } from "next";
import { ButtonLink, PageHero, Section, Kicker } from "@/components/ui/page";
import { saasPlans } from "@/lib/catalog";
import { clp } from "@/lib/format";

export const metadata: Metadata = {
  title: "Modelo",
};

export default function ModeloPage() {
  return (
    <>
      <PageHero
        kicker="Visión comercial"
        title="SaaS, fábrica y equity, bajo Kondax.tech."
        description="La fusión estratégica es deliberada: incubar y automatizar con IA, y ejecutar con células. El ingreso no depende de un solo gancho. Cada vía alimenta a las otras."
      />
      <Section>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Suscripciones", "La incubadora, los agentes Grok 4.6 y el Passport son el motor recurrente. Launch y Studio cubren independientes; Cell cubre pymes con roadmap."],
            ["Horas de fábrica", "Cuando hay que construir, la célula factura. La tarifa sube con criticidad: banca no paga la misma hora que un MVP."],
            ["Sweat equity", "Proyectos co-creados. Kondax pone producto y célula; el cap table registra la participación. No es un descuento: es sociedad."],
          ].map(([title, text]) => (
            <article key={title} className="cell p-6">
              <h2 className="font-display text-2xl">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-mist">{text}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section className="pt-0">
        <Kicker>Planes</Kicker>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {saasPlans.map((plan) => (
            <article key={plan.id} className="cell p-8">
              <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
                {plan.audience}
              </p>
              <h2 className="font-display mt-3 text-3xl">{plan.name}</h2>
              <p className="mt-2 text-2xl">
                {plan.priceClp ? clp(plan.priceClp) : "A medida"}
                <span className="text-sm text-mist"> / {plan.cadence}</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm text-mist">
                {plan.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/cotizador">Simular un engagement mixto</ButtonLink>
          <ButtonLink href="/agentes" tone="ghost">
            Probar agentes
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
