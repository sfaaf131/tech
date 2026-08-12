import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Kicker, Section } from "@/components/ui/page";
import { audiences, saasPlans, serviceGroups, services } from "@/lib/catalog";
import { clp } from "@/lib/format";
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

const faq = [
  {
    q: "¿Qué es una célula Kondax?",
    a: "Un equipo estable de ingeniería — lead, desarrollo y, si hace falta, QA, ML o cumplimiento — que se queda con el dominio. No rotamos contratistas por ticket.",
  },
  {
    q: "¿SaaS, horas o equity?",
    a: "La incubadora y el Passport son suscripción. Construir producto se factura por hora. Si Kondax co-crea, entra al cap table. Las tres vías pueden convivir en el mismo proyecto.",
  },
  {
    q: "¿Sirve para banca?",
    a: "Sí. BPM, process mining, motores de riesgo, KYC/AML, RegTech y Open Banking. Las células de banca nacen con evidencia, cifrado y un asiento de cumplimiento.",
  },
  {
    q: "¿Con qué modelo corren los agentes?",
    a: "Grok 4.6. Hay tres: Cofundador (incubación), Célula (alcance de ingeniería) y Cumplimiento (KYC/AML, RegTech, Open Banking). Supervisión humana y bitácora en cada turno.",
  },
  {
    q: "¿Cómo entro?",
    a: "Programadores con GitHub o GitLab. Fundadores, inversores y corporativos con LinkedIn. Passport no es un login decorativo: es la validación que abre marketplace, equity y consola.",
  },
];

const steps = [
  ["01", "Agente", "Grok 4.6 estructura el negocio, el alcance técnico o el control regulatorio."],
  ["02", "Número", "El cotizador arma la célula. El ROI muestra payback. Ambos se pueden sellar."],
  ["03", "Célula", "Ingeniería que se queda con el contexto. Co-creación cuando hay sociedad."],
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }),
        }}
      />
      <section className="grid-bg grain relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[1.15fr_0.85fr] md:py-28">
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
              <ButtonLink href="/agentes">Hablar con Grok 4.6</ButtonLink>
              <ButtonLink href="/enterprise" tone="ghost">
                Soy empresa o banca
              </ButtonLink>
            </div>
            <p className="mt-8 font-mono text-[11px] tracking-[0.16em] text-copper uppercase">
              TLS 1.3 · AES-256 · OAuth 2.0 · Logs inmutables
            </p>
          </div>
          <div className="rise-2 grid grid-cols-2 gap-3 self-end">
            {[
              ["/agentes", "Agentes", "Grok 4.6"],
              ["/fabrica", "Fábrica", "Células ágiles"],
              ["/modelo", "Equity", "Proyectos co-creados"],
              ["/enterprise", "Banca", "Riesgo, KYC, AML"],
            ].map(([href, title, text]) => (
              <Link key={title} href={href} className="cell block p-5">
                <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
                  {title}
                </p>
                <p className="mt-3 text-sm leading-6 text-paper">{text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Section>
        <Kicker>Cómo opera</Kicker>
        <h2 className="font-display mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
          Identidad, número, ejecución.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map(([n, title, text]) => (
            <article key={n} className="cell p-6">
              <p className="font-mono text-signal">{n}</p>
              <h3 className="font-display mt-4 text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-mist">{text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
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

      <section className="band border-y border-line">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-copper uppercase">
              Incubación
            </p>
            <h2 className="font-display mt-4 text-3xl font-semibold md:text-4xl">
              Un cofundador de IA, no un PDF.
            </h2>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-mist">
              <li className="border-t border-line pt-3">
                De una idea en lenguaje natural a un negocio estructurado.
              </li>
              <li className="border-t border-line pt-3">
                Estrategia, mercado, finanzas y operaciones en un mismo agente Grok 4.6.
              </li>
              <li className="border-t border-line pt-3">
                Marketplace de socios con identidad validada.
              </li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-copper uppercase">
              Fábrica
            </p>
            <h2 className="font-display mt-4 text-3xl font-semibold md:text-4xl">
              Células que se quedan con el contexto.
            </h2>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-mist">
              <li className="border-t border-line pt-3">
                Ingeniería senior con seguridad y cumplimiento de origen.
              </li>
              <li className="border-t border-line pt-3">
                Horas medibles, evidencias y continuidad de dominio.
              </li>
              <li className="border-t border-line pt-3">
                De un MVP a sistemas que mueven dinero.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Section>
        <Kicker>Monetización</Kicker>
        <h2 className="font-display mt-4 text-3xl font-semibold md:text-5xl">
          Tres vías. Una marca.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["01", "Suscripción SaaS", "Incubadora, agentes Grok 4.6, marketplace y Passport."],
            ["02", "Fábrica por hora", "Células de ingeniería con tarifa clara. Producto, automatización y sistemas enterprise."],
            ["03", "Sweat equity", "Co-creación: Kondax pone célula y producto a cambio de participación."],
          ].map(([code, name, text]) => (
            <article key={code} className="cell p-6">
              <p className="font-mono text-signal">{code}</p>
              <h3 className="font-display mt-4 text-2xl">{name}</h3>
              <p className="mt-3 text-sm leading-6 text-mist">{text}</p>
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
                    <Link
                      key={service.id}
                      href="/cotizador"
                      className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-signal"
                    >
                      {service.name}
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <section className="band border-y border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:grid-cols-2 md:grid-cols-4">
          {saasPlans.map((plan) => (
            <article key={plan.id}>
              <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
                {plan.name}
              </p>
              <p className="font-display mt-3 text-3xl">
                {plan.priceClp ? clp(plan.priceClp) : "A medida"}
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
            <Kicker>Agentes Grok 4.6</Kicker>
            <h2 className="font-display mt-4 text-3xl">Estructura antes de construir.</h2>
            <p className="mt-3 text-sm leading-6 text-mist">
              Cofundador, célula y cumplimiento. Describe la idea o el proceso; el
              agente responde con un plan que una célula puede ejecutar.
            </p>
            <div className="mt-6">
              <ButtonLink href="/agentes">Abrir agentes</ButtonLink>
            </div>
          </article>
          <article className="cell p-8">
            <Kicker>Cotizador y ROI</Kicker>
            <h2 className="font-display mt-4 text-3xl">Arma el número.</h2>
            <p className="mt-3 text-sm leading-6 text-mist">
              Horas, banda de inversión y payback corporativo. El enlace se comparte;
              el resultado se sella.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/cotizador" tone="ghost">
                Cotizar
              </ButtonLink>
              <ButtonLink href="/roi" tone="ghost">
                ROI
              </ButtonLink>
            </div>
          </article>
        </div>
      </Section>

      <Section className="pt-0">
        <Kicker>Preguntas</Kicker>
        <h2 className="font-display mt-4 text-3xl md:text-4xl">Antes de entrar.</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {faq.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="cursor-pointer font-display text-xl">
                {item.q}
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-mist">{item.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-10">
          <ButtonLink href="/contacto">Hablar con Kondax</ButtonLink>
        </div>
      </Section>
    </>
  );
}
