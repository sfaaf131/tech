import type { Metadata } from "next";
import { ButtonLink, PageHero, Section, Kicker } from "@/components/ui/page";

export const metadata: Metadata = {
  title: "Seguridad",
};

const controls = [
  {
    title: "Tránsito",
    text: "TLS 1.3 en todos los endpoints públicos. HSTS, redirección HTTPS y ciphers modernos en el edge.",
  },
  {
    title: "Reposo",
    text: "AES-256 para secretos y datos sensibles. Variables de entorno fuera del repositorio. Separación de ambientes.",
  },
  {
    title: "Identidad",
    text: "Kondax Passport con OAuth 2.0. GitHub/GitLab para ingeniería. LinkedIn para fundadores, inversores y corporativos.",
  },
  {
    title: "Evidencia",
    text: "Logs inmutables con hash encadenado (SHA-256). Cada cotización y acceso puede sellarse y verificarse.",
  },
  {
    title: "Aplicación",
    text: "Next.js, Node y Python para agentes, PostgreSQL como sistema de registro. Grok 4.6 con límites, bitácora y supervisión humana.",
  },
  {
    title: "Certificación",
    text: "Diseño preparado para SOC 2 e ISO 27001: control de acceso, registro, cifrado, retención y responsabilidad.",
  },
];

export default function SeguridadPage() {
  return (
    <>
      <PageHero
        kicker="Estándar enterprise"
        title="Seguridad de banca, desde el primer commit."
        description="Kondax no agrega cumplimiento al final. Las células de enterprise y banca nacen con cifrado, identidad federada y una pista de auditoría que se puede mostrar a un regulador."
        actions={
          <>
            <ButtonLink href="/enterprise">Ver línea enterprise</ButtonLink>
            <ButtonLink href="/agentes" tone="ghost">
              Agente de cumplimiento
            </ButtonLink>
          </>
        }
      />
      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          {controls.map((item) => (
            <article key={item.title} className="cell p-6">
              <h2 className="font-display text-2xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-mist">{item.text}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section className="pt-0">
        <Kicker>Arquitectura</Kicker>
        <div className="mt-6 overflow-x-auto text-sm">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead className="font-mono text-[11px] tracking-[0.16em] text-copper uppercase">
              <tr>
                <th className="border-b border-line py-3 pr-4">Capa</th>
                <th className="border-b border-line py-3">Elección</th>
              </tr>
            </thead>
            <tbody className="text-mist">
              {[
                ["Web pública y app", "Next.js (App Router)"],
                ["APIs y agentes", "Node.js y Python"],
                ["Datos", "PostgreSQL"],
                ["Identidad", "OAuth 2.0 · Kondax Passport"],
                ["Modelos", "Grok 4.6 (xAI)"],
                ["Observabilidad", "Logs encadenados + sellos SHA-256"],
              ].map(([layer, choice]) => (
                <tr key={layer}>
                  <td className="border-b border-line py-3 pr-4 text-paper">{layer}</td>
                  <td className="border-b border-line py-3">{choice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
