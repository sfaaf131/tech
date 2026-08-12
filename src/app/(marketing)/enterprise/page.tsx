import type { Metadata } from "next";
import { ButtonLink, PageHero, Section, Kicker } from "@/components/ui/page";
import { services } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Enterprise y banca",
};

const pillars = [
  {
    title: "Flujos corporativos",
    items: ["BPM", "Process mining", "RPA con orquestación", "Integración con el core"],
  },
  {
    title: "Riesgo e inteligencia",
    items: ["Scoring con ML", "Fraude y monitoreo", "Explicabilidad", "Gobierno de modelos"],
  },
  {
    title: "Identidad y regulación",
    items: ["KYC / AML", "RegTech y evidencias", "Open Banking", "Pistas de auditoría inmutables"],
  },
];

export default function EnterprisePage() {
  const banking = services.filter((item) => item.group === "banking" || item.group === "enterprise");

  return (
    <>
      <PageHero
        kicker="Pymes · corporaciones · banca"
        title="Consultoría tecnológica de alto nivel, con controles de origen."
        description="La segunda audiencia de Kondax no necesita una incubadora: necesita células que entiendan procesos, dinero y regulación. Diseñamos, integramos y operamos sistemas que pueden auditarse."
        actions={
          <>
            <ButtonLink href="/roi">Calculadora de ROI</ButtonLink>
            <ButtonLink href="/seguridad" tone="ghost">
              Seguridad y cumplimiento
            </ButtonLink>
          </>
        }
      />
      <Section>
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="cell p-6">
              <h2 className="font-display text-2xl">{pillar.title}</h2>
              <ul className="mt-5 space-y-2 text-sm text-mist">
                {pillar.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>
      <Section className="pt-0">
        <Kicker>Capacidades críticas</Kicker>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {banking.map((item) => (
            <article key={item.id} className="border-t border-line pt-5">
              <h3 className="font-display text-xl">{item.name}</h3>
              <p className="mt-2 text-sm leading-6 text-mist">{item.blurb}</p>
            </article>
          ))}
        </div>
      </Section>
      <section className="band border-y border-line">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Kicker>Por qué banca</Kicker>
          <h2 className="font-display mt-4 max-w-3xl text-3xl md:text-5xl">
            El software que mueve dinero no se improvisa en un sprint de marketing.
          </h2>
          <p className="mt-6 max-w-2xl leading-7 text-mist">
            Kondax prepara cifrado en tránsito (TLS 1.3), cifrado en reposo (AES-256),
            logs encadenados y un camino a SOC 2 e ISO 27001. Las células de banca
            incluyen el asiento de seguridad y cumplimiento desde el día uno.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/cotizador">Cotizar un sistema regulado</ButtonLink>
            <ButtonLink href="/passport" tone="ghost">
              Kondax Passport
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
