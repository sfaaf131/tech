import type { Metadata } from "next";
import Link from "next/link";
import { Button, Kicker, Section } from "@/components/ui/primitives";
import { SprintBoard } from "@/components/product/sprint-board";
import { demoProjects } from "@/lib/portfolio";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Inicio",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kondax.tech",
  url: site.url,
  description: site.description,
  email: site.email,
};

const steps = [
  {
    n: "01",
    title: "Entender el proceso",
    text: "Mapeamos operación, sistemas y criterio de done. Sin eso no hay sprint ni equity.",
  },
  {
    n: "02",
    title: "Armar la célula",
    text: "Lead, ingeniería, IA o QA según el trabajo. Un equipo que se queda con el dominio.",
  },
  {
    n: "03",
    title: "Construir a la vista",
    text: "El portal muestra sprints, horas e hitos. El cliente o el socio ve el producto, no un status deck.",
  },
  {
    n: "04",
    title: "Operar o co-crear",
    text: "B2B se factura por hora, sprint o proyecto. Startups firman sweat equity atado a entregables.",
  },
];

const services = [
  ["Agentes de IA", "Atención, análisis documental y procesamiento de datos, con supervisión humana."],
  ["RPA y process mining", "Tareas repetitivas sobre sistemas que ya existen, sin reescribir el core."],
  ["Web y móvil", "Productos transaccionales, portales y apps listos para crecer."],
  ["Nube y operación", "Arquitectura, despliegue y una célula que no desaparece al entregar."],
];

const faq = [
  {
    q: "¿Cobran por hora o por proyecto?",
    a: "En Enterprise, las tres: hora, sprint o proyecto cerrado. La banda sube con criticidad. En Venture no hay factura de horas: hay participación atada a hitos.",
  },
  {
    q: "¿Qué entra en una célula?",
    a: "Un lead y la ingeniería que el trabajo pide. Si hay automatización, suma IA. Si hay banca o dinero, suma QA y cumplimiento.",
  },
  {
    q: "¿Cómo se define el equity?",
    a: "En contrato, por hitos de software. No es un descuento de tarifa. Kondax pone el equipo; el fundador pone industria y el cap table registra la sociedad.",
  },
];

export default function HomePage() {
  const preview = demoProjects[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24">
          <div>
            <Kicker>Factoría de software · IA · Venture studio</Kicker>
            <h1 className="mt-5 text-4xl leading-[1.08] font-semibold tracking-tight md:text-5xl lg:text-[3.35rem]">
              Ingeniería de software e inteligencia artificial para empresas.
              <span className="mt-3 block text-mist">Co-inversión técnica para startups.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-mist">
              Desarrollamos tecnología avanzada para modernizar tu negocio e invertimos nuestro
              equipo técnico en los proyectos del futuro.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/enterprise">Ver soluciones corporativas</Button>
              <Button href="/startups" tone="ghost">
                Postular mi startup
              </Button>
            </div>
          </div>
          <SprintBoard project={preview} compact />
        </div>
      </section>

      <Section>
        <Kicker>Dos líneas</Kicker>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
          Corporativos y fundadores no compiten por la misma célula.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Link href="/enterprise" className="cell block p-8">
            <Kicker>B2B · Pymes</Kicker>
            <h3 className="mt-3 text-2xl font-semibold">
              Potencia tu operación con células de software e IA ágiles.
            </h3>
            <p className="mt-3 text-sm leading-6 text-mist">
              Agentes, RPA y producto con horas visibles. Agilidad, menor costo operativo y
              sistemas que se pueden auditar.
            </p>
          </Link>
          <Link href="/startups" className="cell block p-8">
            <Kicker>Fundadores</Kicker>
            <h3 className="mt-3 text-2xl font-semibold">
              Construimos tu producto a cambio de capital social.
            </h3>
            <p className="mt-3 text-sm leading-6 text-mist">
              El fundador aporta industria. Kondax aporta equipo senior, producto y arquitectura
              de IA. Los intereses quedan alineados.
            </p>
          </Link>
        </div>
      </Section>

      <section className="border-y border-line bg-ink-2">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-24">
          <Kicker>Cómo opera</Kicker>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            Cuatro cosas, un sistema.
          </h2>
          <p className="mt-3 max-w-xl text-mist">Así se ve una semana de trabajo en Kondax.</p>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
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
        </div>
      </section>

      <Section>
        <Kicker>Capacidades</Kicker>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
          Lo que una célula Kondax sabe hacer.
        </h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {services.map(([title, text]) => (
            <div key={title} className="grid gap-2 py-6 md:grid-cols-[280px_1fr]">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-6 text-mist">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="border-y border-line bg-ink-2">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-24">
          <Kicker>Modelo</Kicker>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            Caja con empresas. Patrimonio con startups.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-mist">
            La ingeniería B2B cubre nómina e infraestructura. En paralelo, Kondax acumula
            participación en las compañías que co-crea. Una factoría que se paga sola y un
            venture studio que construye con las mismas manos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/enterprise">Hablar con Enterprise</Button>
            <Button href="/startups" tone="ghost">
              Ver el proceso venture
            </Button>
          </div>
        </div>
      </section>

      <Section>
        <Kicker>Preguntas</Kicker>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight">Antes de escribirnos.</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {faq.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="cursor-pointer text-lg font-medium">{item.q}</summary>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-mist">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
