import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { Button, Card, Kicker, Section } from "@/components/ui/primitives";
import { commercialTerms, deliverySteps, services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Empresas",
  description:
    "Process mining, RPA, agentes de IA, analítica e integración. Células de ingeniería para pymes y corporativos.",
};

const proof = [
  { kicker: "Portal", line: "Horas, sprints y entregables a la vista del cliente." },
  { kicker: "Célula", line: "Lead + la ingeniería que el flujo pide. Sin headcount inflado." },
  { kicker: "Sprint", line: "Dos a cuatro semanas, un done, un entregable." },
  { kicker: "Auditoría", line: "Cada lead y cada hito se sella (hash). El trabajo deja rastro." },
];

export default function EnterprisePage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <Kicker>B2B · Pymes · Corporativos</Kicker>
          <h1 className="mt-5 max-w-4xl text-4xl leading-[1.08] font-semibold tracking-tight md:text-6xl">
            Primero el proceso. Después el software.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-mist">
            Kondax entra en operación real: dónde se pierde tiempo, qué se decide a mano y qué
            sistemas no se hablan. El entregable no es un piloto aislado. Es flujo, automatización
            e inteligencia, sostenidos por una célula. El avance no se informa por mail: está en el
            portal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#contacto">Pedir alcance</Button>
            <Button href="#servicios" tone="ghost">
              Ver el catálogo
            </Button>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {proof.map((item) => (
            <Card key={item.kicker} className="p-5">
              <Kicker>{item.kicker}</Kicker>
              <p className="mt-3 text-sm leading-6 text-mist">{item.line}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="metodo" band>
        <Kicker>Orden de trabajo</Kicker>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
          El mismo orden en cada operación.
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {deliverySteps.map((step) => (
            <article key={step.n} className="grid grid-cols-[auto_1fr] gap-4">
              <p className="text-sm font-medium text-copper">{step.n}</p>
              <div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-mist">{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="servicios">
        <Kicker>Servicios</Kicker>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
          El catálogo, en el orden del flujo.
        </h2>
        <p className="mt-4 max-w-2xl text-mist">
          No hace falta contratarlas todas. Lo habitual es empezar por mapear el proceso y
          automatizar un cuello de botella.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {services.map((item) => (
            <Card key={item.id}>
              <p className="text-sm font-medium text-copper">{item.n}</p>
              <h2 className="mt-3 text-xl font-semibold">{item.name}</h2>
              <p className="mt-1 text-xs font-medium tracking-[0.12em] text-copper uppercase">
                {item.tag}
              </p>
              <p className="mt-3 text-sm leading-6 text-mist">{item.blurb}</p>
              <ul className="mt-5 space-y-2">
                {item.outcomes.map((outcome) => (
                  <li key={outcome} className="text-sm leading-6 text-paper">
                    {outcome}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section band>
        <Kicker>Comercial</Kicker>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Cómo se contrata</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {commercialTerms.map((item) => (
            <Card key={item.title}>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-mist">{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="contacto">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Kicker>Primer alcance</Kicker>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              El proceso, el volumen y el sistema. Con eso alcanza.
            </h2>
            <p className="mt-4 text-sm leading-7 text-mist">
              No hace falta RFP ni deck. En la primera respuesta va: alcance del primer sprint (2 a
              4 semanas), quién entra en la célula y una banda de inversión. Precio cerrado solo si
              el flujo ya está mapeado.
            </p>
            <ul className="mt-6 space-y-2 text-sm leading-6 text-mist">
              <li>Hora, sprint o proyecto — lo definimos con el flujo, no al revés.</li>
              <li>El trabajo se ve en el portal: horas, entregable y sello de auditoría del lead.</li>
              <li>Si el dolor es producto de founder con equity, el camino es Fundadores, no este formulario.</li>
            </ul>
          </div>
          <Card>
            <ContactForm />
          </Card>
        </div>
      </Section>
    </>
  );
}
