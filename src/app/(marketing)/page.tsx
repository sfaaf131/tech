import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Kicker, Section } from "@/components/ui/page";
import { audiences, saasPlans, serviceGroups, services } from "@/lib/catalog";
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

const fusion = [
  {
    side: "Incubación + IA",
    source: "Inspirado en CEmprendedor",
    points: [
      "De una idea en lenguaje natural a un negocio estructurado.",
      "Estrategia, mercado, finanzas y operaciones en un mismo agente.",
      "Marketplace de socios para no emprender en solitario.",
    ],
  },
  {
    side: "Ejecución técnica",
    source: "Inspirado en Trio.dev",
    points: [
      "Células ágiles que se quedan con el problema, no tickets sueltos.",
      "Ingeniería senior con seguridad y cumplimiento de origen.",
      "Fábrica medible: horas, evidencias y continuidad de contexto.",
    ],
  },
];

const revenue = [
  {
    code: "01",
    name: "Suscripción SaaS",
    text: "Acceso a incubadora, agentes, marketplace y Passport. Recurrencia para emprendedores y equipos.",
  },
  {
    code: "02",
    name: "Fábrica por hora",
    text: "Células de ingeniería con tarifa clara. Producto, automatización y sistemas enterprise.",
  },
  {
    code: "03",
    name: "Sweat equity",
    text: "Co-creación: Kondax pone célula y producto a cambio de participación en el proyecto.",
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
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[1.2fr_0.8fr] md:py-28">
          <div>
            <Kicker>Kondax.tech · LatAm</Kicker>
            <h1 className="rise font-display mt-6 text-5xl leading-[0.95] font-semibold tracking-tight md:text-7xl">
              Incubamos con IA.
              <span className="mt-2 block text-signal">Ejecutamos con células.</span>
            </h1>
            <p className="rise-2 mt-6 max-w-xl text-lg leading-8 text-mist">
              {site.description}
            </p>
            <div className="rise-3 mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/incubadora">Soy emprendedor</ButtonLink>
              <ButtonLink href="/enterprise" tone="ghost">
                Soy empresa o banca
              </ButtonLink>
            </div>
          </div>
          <div className="rise-2 grid grid-cols-2 gap-3 self-end">
            {[
              ["SaaS", "Incubadora y agentes"],
              ["Fábrica", "Células ágiles"],
              ["Equity", "Proyectos co-creados"],
              ["Banca", "Riesgo, KYC, AML"],
            ].map(([title, text]) => (
              <article key={title} className="cell p-5">
                <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
                  {title}
                </p>
                <p className="mt-3 text-sm leading-6 text-paper">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Section>
        <Kicker>Audiencias</Kicker>
        <h2 className="font-display mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
          Dos líneas. Un sistema.
        </h2>
        <p className="mt-4 max-w-2xl text-mist">
          Independientes entran por incubadora y marketplace. Pymes, corporaciones y
          banca entran por consultoría y células de alto nivel. El Passport decide el
          nivel de acceso.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {audiences.map((item) => (
            <Link key={item.id} href={item.href} className="cell block p-6">
              <p className="font-mono text-[11px] tracking-[0.18em] text-signal uppercase">
                {item.id}
              </p>
              <h3 className="font-display mt-3 text-2xl">{item.label}</h3>
              <p className="mt-3 text-sm leading-6 text-mist">{item.summary}</p>
            </Link>
          ))}
        </div>
      </Section>

      <section className="bg-paper text-ink">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2">
          {fusion.map((column) => (
            <div key={column.side}>
              <p className="font-mono text-[11px] tracking-[0.22em] text-copper uppercase">
                {column.source}
              </p>
              <h2 className="font-display mt-4 text-3xl font-semibold md:text-4xl">
                {column.side}
              </h2>
              <ul className="mt-6 space-y-3 text-sm leading-6 text-ink/75">
                {column.points.map((point) => (
                  <li key={point} className="border-t border-ink/10 pt-3">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Section>
        <Kicker>Monetización</Kicker>
        <h2 className="font-display mt-4 text-3xl font-semibold md:text-5xl">
          Tres vías. Una marca.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {revenue.map((item) => (
            <article key={item.code} className="cell p-6">
              <p className="font-mono text-signal">{item.code}</p>
              <h3 className="font-display mt-4 text-2xl">{item.name}</h3>
              <p className="mt-3 text-sm leading-6 text-mist">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <ButtonLink href="/modelo" tone="ghost">
            Ver modelo completo
          </ButtonLink>
        </div>
      </Section>

      <Section className="pt-0">
        <Kicker>Fábrica</Kicker>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display max-w-xl text-3xl font-semibold md:text-4xl">
            Matriz de servicios, de producto a regulación.
          </h2>
          <ButtonLink href="/servicios" tone="ghost">
            Ver portafolio
          </ButtonLink>
        </div>
        <div className="mt-10 space-y-8">
          {serviceGroups.map((group) => (
            <div key={group.id}>
              <p className="font-mono text-[11px] tracking-[0.18em] text-mist uppercase">
                {group.label}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {services
                  .filter((service) => service.group === group.id)
                  .map((service) => (
                    <span
                      key={service.id}
                      className="rounded-full border border-line px-3 py-1.5 text-sm"
                    >
                      {service.name}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <section className="border-y border-line bg-ink-2">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-3">
          {saasPlans.slice(0, 3).map((plan) => (
            <article key={plan.id}>
              <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
                {plan.name}
              </p>
              <p className="font-display mt-3 text-3xl">
                {plan.priceClp
                  ? plan.priceClp.toLocaleString("es-CL")
                  : "A medida"}
                <span className="ml-1 text-base text-mist">/{plan.cadence}</span>
              </p>
              <p className="mt-2 text-sm text-mist">{plan.audience}</p>
            </article>
          ))}
        </div>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="cell p-8">
            <Kicker>Cotizador inteligente</Kicker>
            <h2 className="font-display mt-4 text-3xl">Arma la célula y el precio.</h2>
            <p className="mt-3 text-sm leading-6 text-mist">
              Audiencia, servicios, alcance y plazo. El cotizador estima horas, banda
              de inversión y composición de la célula.
            </p>
            <div className="mt-6">
              <ButtonLink href="/cotizador">Cotizar un proyecto</ButtonLink>
            </div>
          </article>
          <article className="cell p-8">
            <Kicker>ROI corporativo</Kicker>
            <h2 className="font-display mt-4 text-3xl">Mide el retorno antes del sprint.</h2>
            <p className="mt-3 text-sm leading-6 text-mist">
              FTE, errores, compliance e implementación. Payback y ahorro a 3 años
              para pymes, corporaciones y banca.
            </p>
            <div className="mt-6">
              <ButtonLink href="/roi" tone="ghost">
                Calcular ROI
              </ButtonLink>
            </div>
          </article>
        </div>
      </Section>
    </>
  );
}
