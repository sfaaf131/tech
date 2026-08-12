import type { Metadata } from "next";
import { ButtonLink, PageHero, Section, Kicker } from "@/components/ui/page";
import { saasPlans } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Incubadora",
};

const steps = [
  {
    n: "01",
    title: "Describe la idea",
    text: "En lenguaje natural: a quién ayudas, en qué mercado y qué quieres construir.",
  },
  {
    n: "02",
    title: "El agente estructura el negocio",
    text: "El agente Grok 4.6 estructura propuesta de valor, mercado, producto, precios, ventas, finanzas y operaciones.",
  },
  {
    n: "03",
    title: "Encuentra socios",
    text: "El marketplace conecta fundadores, programadores validados e inversores.",
  },
  {
    n: "04",
    title: "Ejecuta con una célula",
    text: "Cuando el plan deja de ser un documento, la fábrica lo convierte en producto.",
  },
];

export default function IncubadoraPage() {
  return (
    <>
      <PageHero
        kicker="Línea emprendedores"
        title="Incubadora y marketplace de socios."
        description="Para independientes que no quieren un PDF de consultoría ni un equipo fantasma. Kondax combina un cofundador de IA con una red de personas validadas por Passport y, cuando corresponde, una célula que construye."
        actions={
          <>
            <ButtonLink href="/agentes">Hablar con Grok 4.6</ButtonLink>
            <ButtonLink href="/passport" tone="ghost">
              Entrar con Passport
            </ButtonLink>
          </>
        }
      />
      <Section>
        <Kicker>El viaje</Kicker>
        <h2 className="font-display mt-4 text-3xl md:text-5xl">De la idea al sistema.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {steps.map((step) => (
            <article key={step.n} className="cell p-6">
              <p className="font-mono text-signal">{step.n}</p>
              <h3 className="font-display mt-4 text-2xl">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-mist">{step.text}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section className="pt-0">
        <Kicker>Marketplace</Kicker>
        <div className="mt-4 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">
              Socios con identidad, no perfiles anónimos.
            </h2>
            <p className="mt-4 text-mist leading-7">
              Los programadores entran con GitHub o GitLab. Fundadores e inversores
              entran con LinkedIn. El matching ocurre después de esa validación, no
              antes. Así el marketplace no se convierte en un tablón de rumores.
            </p>
          </div>
          <div className="cell p-6 text-sm leading-7 text-mist">
            <p>Roles que se cruzan:</p>
            <ul className="mt-3 space-y-2 text-paper">
              <li>Fundador × programador para un MVP con equity.</li>
              <li>Fundador × inversor para una ronda pre-semilla.</li>
              <li>Programador × célula Kondax para un sprint pagado.</li>
            </ul>
          </div>
        </div>
      </Section>
      <section className="band border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-2">
          {saasPlans
            .filter((plan) => plan.id === "launch" || plan.id === "studio")
            .map((plan) => (
              <article key={plan.id} className="cell p-8">
                <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
                  {plan.name}
                </p>
                <p className="font-display mt-3 text-4xl">
                  ${plan.priceClp?.toLocaleString("es-CL")}
                  <span className="text-base text-mist"> / {plan.cadence}</span>
                </p>
                <ul className="mt-6 space-y-2 text-sm text-mist">
                  {plan.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
        </div>
      </section>
    </>
  );
}
