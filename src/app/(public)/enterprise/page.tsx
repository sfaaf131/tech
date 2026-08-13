import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { Button, Card, Kicker, Section } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Factoría Enterprise",
  description:
    "Células de ingeniería, agentes de IA y RPA para pymes y corporativos. Consultoría técnica y propuesta comercial.",
};

const solutions = [
  {
    title: "Agentes de IA personalizados",
    text: "Automatización de atención, análisis documental y procesamiento inteligente de datos. Se diseñan sobre tu proceso, no sobre un demo genérico.",
  },
  {
    title: "RPA y process mining",
    text: "Sacamos trabajo repetitivo de sistemas que ya existen. Primero el mapa del proceso; después el bot, la orquestación y el control.",
  },
  {
    title: "Células ágiles dedicadas",
    text: "Equipos senior — frontend, backend, IA, QA — listos para integrarse. No rotamos contratistas por ticket. La célula se queda con el dominio.",
  },
];

export default function EnterprisePage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <Kicker>B2B · Pymes · Corporativos</Kicker>
          <h1 className="mt-5 max-w-4xl text-4xl leading-[1.08] font-semibold tracking-tight md:text-6xl">
            Software e IA con velocidad de ejecución y retorno medible.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-mist">
            Células de alto rendimiento para modernizar operación: agentes, automatización y
            producto. Se factura por hora, sprint o proyecto.
          </p>
          <div className="mt-8">
            <Button href="#contacto">Agendar consultoría técnica</Button>
          </div>
        </div>
      </section>

      <Section>
        <Kicker>Soluciones</Kicker>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {solutions.map((item) => (
            <Card key={item.title}>
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-mist">{item.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <section className="border-y border-line bg-ink-2">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Kicker>Cómo opera la célula</Kicker>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {[
              ["01", "Descubrimiento", "Proceso, sistemas, riesgos y criterio de done. Sin eso no hay sprint."],
              ["02", "Ejecución", "Lead, ingeniería e IA o QA según el trabajo. Horas visibles. Entregables por semana."],
              ["03", "Evidencia", "El cliente ve avance en el portal: sprints, artefactos y horas. No un status deck."],
            ].map(([n, title, text]) => (
              <article key={n}>
                <p className="text-sm font-medium text-copper">{n}</p>
                <h3 className="mt-3 text-2xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-mist">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Section id="contacto">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Kicker>Contacto comercial</Kicker>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Sesión de consultoría o propuesta.
            </h2>
            <p className="mt-4 text-sm leading-7 text-mist">
              Cuéntanos el proceso, el sistema actual y el resultado. Respondemos con alcance,
              composición de célula y una banda de inversión.
            </p>
          </div>
          <Card>
            <ContactForm />
          </Card>
        </div>
      </Section>
    </>
  );
}
