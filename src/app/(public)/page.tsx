import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, Kicker, Section } from "@/components/ui/primitives";
import { SprintBoard } from "@/components/product/sprint-board";
import { demoProjects } from "@/lib/portfolio";
import { deliverySteps, services } from "@/lib/services";
import { site } from "@/lib/site";

const faq = [
  {
    q: "¿Qué pasa cuando pido alcance?",
    a: "Llenas proceso, volumen y sistema. Respondemos al correo con alcance del primer sprint, composición de célula y una banda de inversión. No hay calendario embebido ni RFP.",
  },
  {
    q: "¿Por dónde empiezan?",
    a: "Por el flujo. Mapeamos el proceso, medimos cuellos de botella y recién ahí proponemos RPA, un agente o una célula. Un bot sin mapa solo acelera el desorden.",
  },
  {
    q: "¿Cobran por hora, por sprint o por proyecto?",
    a: "En Empresas, las tres. El sprint (2 a 4 semanas) es el modo habitual del primer mapa o el primer bot. La banda sube con criticidad. En Fundadores no hay factura de horas: hay participación atada a hitos.",
  },
  {
    q: "¿Qué ven en el portal?",
    a: "El cliente B2B ve sprints, horas y entregables. El socio ve hitos de software y el acuerdo de equity. Cada lead queda sellado (hash de auditoría). No es un status por WhatsApp.",
  },
  {
    q: "¿Qué entra en una célula?",
    a: "Un lead y la ingeniería que el trabajo pide. Si hay automatización, suma IA. Si hay dinero o cumplimiento, suma QA. Sin headcount permanente inflado.",
  },
  {
    q: "¿Cómo se define el equity?",
    a: "En contrato, por hitos de software. No es un descuento de tarifa. Kondax pone el equipo; el fundador pone industria y el cap table registra la sociedad. Sin industria ni tracción no hay evaluación.",
  },
];

export const metadata: Metadata = {
  title: { absolute: `${site.name}.tech — ${site.tagline}` },
  description: site.description,
  alternates: { canonical: site.url },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Kondax.tech",
      url: site.url,
      email: site.email,
      description: site.description,
      areaServed: "CL",
      knowsAbout: services.map((service) => service.name),
    },
    {
      "@type": "WebSite",
      name: "Kondax.tech",
      url: site.url,
      inLanguage: "es-CL",
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function HomePage() {
  const preview = demoProjects[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-12 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:py-24">
          <div>
            <Kicker>Santiago · Factoría de software · IA · Venture studio</Kicker>
            <h1 className="mt-5 text-4xl leading-[1.08] font-semibold tracking-tight md:text-5xl lg:text-[3.35rem]">
              Células de software para tu operación. Socio técnico para fundadores.
              <span className="mt-3 block text-mist">
                Empresas pagan por hora, sprint o proyecto. Fundadores ceden participación atada a
                hitos.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-mist">
              Mapeamos el flujo, automatizamos lo repetible, ponemos IA donde hay decisión e
              instalamos la célula. Elige tu línea: operación B2B o co-construcción con equity.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/enterprise#contacto">Pedir alcance</Button>
              <Button href="/startups#postular" tone="ghost">
                Postular como fundador
              </Button>
            </div>
          </div>
          <div>
            <SprintBoard project={preview} compact />
            <p className="mt-3 text-sm text-mist">
              Así se ve el portal: sprints, horas y entregable. Ejemplo de tablero, no un caso
              publicado.
            </p>
          </div>
        </div>
      </section>

      <Section band>
        <Kicker>Dos líneas</Kicker>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
          Corporativos y fundadores no compiten por la misma célula.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Card href="/enterprise">
            <Kicker>B2B · Pymes</Kicker>
            <h3 className="mt-3 text-2xl font-semibold">Pymes y corporativos: célula a la operación.</h3>
            <p className="mt-3 text-sm leading-6 text-mist">
              Hora, sprint o proyecto. Horas y entregables en el portal. Empieza por el flujo que
              hoy se hace a mano.
            </p>
            <p className="mt-5 text-sm font-medium">Pedir alcance →</p>
          </Card>
          <Card href="/startups">
            <Kicker>Fundadores</Kicker>
            <h3 className="mt-3 text-2xl font-semibold">
              Fundadores: la fábrica a cambio de participación.
            </h3>
            <p className="mt-3 text-sm leading-6 text-mist">
              Sin factura de horas. Contrato con equity atado a hitos de software. Industria tuya;
              célula nuestra.
            </p>
            <p className="mt-5 text-sm font-medium">Ver criterios y postular →</p>
          </Card>
        </div>
      </Section>

      <Section id="metodo">
        <Kicker>Método</Kicker>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
          Empezamos por el flujo, no por la herramienta.
        </h2>
        <p className="mt-3 max-w-xl text-mist">
          El orden de trabajo es siempre el mismo: entender, automatizar, decidir, sostener.
        </p>
        <p className="mt-2 max-w-xl text-sm text-mist">
          El cliente ve el mismo orden en el portal: mapa, bot, agente, célula.
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
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

      <Section id="servicios" band>
        <Kicker>Servicios</Kicker>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
          Siete capas, en el orden del flujo.
        </h2>
        <p className="mt-3 max-w-2xl text-mist">
          No se contrata el catálogo entero. Lo habitual es un mapa y un cuello de botella. Detalle
          y entregables están en Empresas.
        </p>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {services.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[2.25rem_1fr] gap-x-3 gap-y-1 py-4 md:grid-cols-[7rem_1fr] md:items-baseline md:py-6"
            >
              <p className="text-sm font-medium text-copper">{item.n}</p>
              <div>
                <h3 className="text-base font-semibold md:text-lg">{item.name}</h3>
                <p className="mt-1 text-[11px] font-medium tracking-[0.12em] text-mist uppercase md:text-xs">
                  {item.tag}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm">
          <Link href="/enterprise#servicios" className="font-medium text-paper hover:underline">
            Ver detalle corporativo →
          </Link>
        </p>
      </Section>

      <Section>
        <Kicker>Preguntas</Kicker>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight">Antes de pedir alcance.</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {faq.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 rounded-md text-lg font-medium">
                {item.q}
                <span
                  className="grid size-7 shrink-0 place-items-center rounded-md border border-line text-base leading-none text-paper transition group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-3xl pr-12 text-sm leading-7 text-mist">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
