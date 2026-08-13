import type { Metadata } from "next";
import { ApplyForm } from "@/components/forms/apply-form";
import { Button, Card, Kicker, Section } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Venture Building",
  description:
    "Kondax como socio tecnológico: equipo senior de software, producto e IA a cambio de sweat equity.",
};

const steps = [
  {
    n: "01",
    title: "Postulación",
    text: "Presentas el proyecto, la validación comercial y el perfil del fundador. Industria primero; el pitch deck después.",
  },
  {
    n: "02",
    title: "Evaluación",
    text: "Kondax analiza viabilidad técnica y encaje estratégico. No todas las ideas entran. Preferimos fundadores que conocen el mercado.",
  },
  {
    n: "03",
    title: "Acuerdo de sweat equity",
    text: "Contrato con el porcentaje de participación atado a hitos de software. No es un descuento de horas: es sociedad.",
  },
  {
    n: "04",
    title: "Construcción y despliegue",
    text: "La misma factoría construye el MVP o la plataforma. Si el producto es operación —flujo, agentes, RPA— entra el mismo método que usamos en B2B. El fundador ve avance en el portal de socio.",
  },
];

const criteria = [
  "Fundador con conocimiento real de industria, no solo una tesis de mercado.",
  "Problema caro, frecuente y que software o IA puede mover.",
  "Camino comercial creíble: clientes, cartas de intención o acceso al canal.",
  "Alcance que una célula senior puede ejecutar en hitos, no un rediseño infinito.",
  "Disposición a ceder participación a cambio de ejecución técnica de verdad.",
];

export default function StartupsPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <Kicker>Startups · Fundadores · Sweat equity</Kicker>
          <h1 className="mt-5 max-w-4xl text-4xl leading-[1.08] font-semibold tracking-tight md:text-6xl">
            Socio tecnológico. No un equipo fantasma ni un PDF de consultoría.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-mist">
            Kondax pone desarrollo, diseño de producto y arquitectura de IA a cambio de
            participación accionaria. Los intereses quedan alineados.
          </p>
          <div className="mt-8">
            <Button href="#postular">Postular mi startup</Button>
          </div>
        </div>
      </section>

      <Section>
        <Kicker>Co-inversión</Kicker>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Cuatro pasos. Un cap table.</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {steps.map((step) => (
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

      <section className="border-y border-line bg-ink-2">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Kicker>Criterios de selección</Kicker>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            No incubamos por volumen. Elegimos dónde poner la célula.
          </h2>
          <ul className="mt-8 max-w-3xl divide-y divide-line border-y border-line">
            {criteria.map((item) => (
              <li key={item} className="py-4 text-sm leading-7 text-mist">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section id="postular">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Kicker>Postulación</Kicker>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Cuéntanos la idea.</h2>
            <p className="mt-4 text-sm leading-7 text-mist">
              Si hay encaje, proponemos hitos y un porcentaje. Si no, lo decimos pronto. El
              portal de socio se abre cuando hay acuerdo.
            </p>
          </div>
          <Card>
            <ApplyForm />
          </Card>
        </div>
      </Section>
    </>
  );
}
