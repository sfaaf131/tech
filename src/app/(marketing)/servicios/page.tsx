import type { Metadata } from "next";
import { ButtonLink, PageHero, Section, Kicker } from "@/components/ui/page";
import { serviceGroups, services } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Servicios",
};

export default function ServiciosPage() {
  return (
    <>
      <PageHero
        kicker="Matriz de la fábrica"
        title="El portafolio completo, en un solo sistema."
        description="Producto digital, automatización, tecnologías emergentes y el bloque enterprise/bancario. Cada ítem entra al cotizador con horas base, y la célula se arma según el mix."
        actions={<ButtonLink href="/cotizador">Cotizar servicios</ButtonLink>}
      />
      {serviceGroups.map((group) => (
        <Section key={group.id} className="pt-12 first:pt-20">
          <Kicker>{group.label}</Kicker>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {services
              .filter((service) => service.group === group.id)
              .map((service) => (
                <article key={service.id} className="cell p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-display text-2xl">{service.name}</h2>
                    <p className="font-mono text-[11px] text-copper whitespace-nowrap">
                      {service.hours}h base
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-mist">{service.blurb}</p>
                </article>
              ))}
          </div>
        </Section>
      ))}
    </>
  );
}
