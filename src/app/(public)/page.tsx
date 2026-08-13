import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, Kicker, Section } from "@/components/ui/primitives";
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

const services = [
  {
    title: "Agentes de IA",
    text: "Automatización de atención, análisis documental y procesamiento inteligente de datos, con supervisión humana.",
  },
  {
    title: "RPA y process mining",
    text: "Eliminación de tareas manuales repetitivas sobre sistemas existentes, sin reescribir el core de un día para otro.",
  },
  {
    title: "Web y móvil",
    text: "Productos transaccionales, portales y apps con arquitectura lista para crecer.",
  },
  {
    title: "Nube y operación",
    text: "Diseño, despliegue y operación de sistemas. Células que se quedan con el contexto.",
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="grid-bg grain relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <Kicker>Factoría de software · IA · Venture studio</Kicker>
          <h1 className="rise font-display mt-6 max-w-5xl text-4xl leading-[1.05] font-semibold tracking-tight md:text-6xl">
            Ingeniería de Software e Inteligencia Artificial para Empresas.
            <span className="mt-3 block text-signal">Co-inversión Técnica para Startups.</span>
          </h1>
          <p className="rise-2 mt-6 max-w-2xl text-lg leading-8 text-mist">
            Desarrollamos tecnología avanzada para modernizar tu negocio e invertimos nuestro
            equipo técnico en los proyectos del futuro.
          </p>
          <div className="rise-3 mt-8 flex flex-wrap gap-3">
            <Button href="/enterprise">Ver Soluciones Corporativas</Button>
            <Button href="/startups" tone="ghost">
              Postular mi Startup
            </Button>
          </div>
        </div>
      </section>

      <Section>
        <Kicker>Dos líneas. Un sistema.</Kicker>
        <h2 className="font-display mt-4 max-w-3xl text-3xl font-semibold md:text-5xl">
          Corporativos y fundadores no compiten por la misma célula. Se alimentan.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Link href="/enterprise" className="cell block p-8">
            <p className="font-mono text-[11px] tracking-[0.18em] text-signal uppercase">B2B · Pymes</p>
            <h3 className="font-display mt-3 text-2xl">Potencia tu operación con células de software e IA ágiles.</h3>
            <p className="mt-3 text-sm leading-6 text-mist">
              Implementación rápida, agentes personalizados y automatización de procesos.
              Agilidad, menor costo operativo y sistemas que se pueden auditar.
            </p>
          </Link>
          <Link href="/startups" className="cell block p-8">
            <p className="font-mono text-[11px] tracking-[0.18em] text-signal uppercase">Fundadores</p>
            <h3 className="font-display mt-3 text-2xl">
              Construimos tu producto digital a cambio de capital social (Sweat Equity).
            </h3>
            <p className="mt-3 text-sm leading-6 text-mist">
              El fundador aporta industria. Kondax aporta equipo senior, producto y arquitectura
              de IA. Los intereses quedan alineados a largo plazo.
            </p>
          </Link>
        </div>
      </Section>

      <section className="band border-y border-line">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Kicker>Servicios</Kicker>
          <h2 className="font-display mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
            Lo que una célula Kondax sabe hacer.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <Card key={service.title}>
                <h3 className="font-display text-2xl">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-mist">{service.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Section>
        <Kicker>Modelo</Kicker>
        <h2 className="font-display mt-4 max-w-3xl text-3xl font-semibold md:text-4xl">
          Caja con empresas. Patrimonio con startups.
        </h2>
        <p className="mt-5 max-w-2xl leading-7 text-mist">
          La ingeniería B2B —por hora, sprint o proyecto— cubre nómina e infraestructura.
          En paralelo, Kondax acumula participación en las compañías que co-crea. Una
          factoría que se paga sola y un venture studio que construye con las mismas manos.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/enterprise">Hablar con Enterprise</Button>
          <Button href="/startups" tone="ghost">
            Ver el proceso venture
          </Button>
        </div>
      </Section>
    </>
  );
}
