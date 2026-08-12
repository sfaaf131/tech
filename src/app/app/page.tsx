import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Consola",
};

export default async function AppHomePage() {
  const session = await auth();
  if (!session?.user) redirect("/passport");
  const role = session.user.role ?? "fundador";
  const validation = session.user.validation ?? "pending";

  const cards =
    role === "programador"
      ? [
          ["Validación técnica", "GitHub / GitLab. Puedes unirte a células y al marketplace."],
          ["Células abiertas", "Atlas y Nimbus buscan un asiento de ingeniería."],
          ["Horas", "El tiempo se registra contra proyecto, no contra tickets sueltos."],
        ]
      : role === "inversor"
        ? [
            ["Deal-flow", "Ruta Norte y Nimbus Pay tienen sala de equity abierta."],
            ["Diligencia", "Passport comercial activo. Logs de acceso en Auditoría."],
            ["Participación", "Sweat equity y rondas conviven en el mismo cap table."],
          ]
        : role === "corporativo"
          ? [
              ["ROI", "Usa la calculadora pública y escala a un retainer Sovereign."],
              ["Cumplimiento", "KYC/AML, RegTech y evidencias viven en Auditoría."],
              ["Células", "Bastión puede residir en tu VPC."],
            ]
          : [
              ["Incubadora", "Estructura el negocio y el pitch con el agente."],
              ["Socios", "El marketplace solo muestra identidades validadas."],
              ["Co-creación", "Si Kondax construye contigo, el equity queda registrado."],
            ];

  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
        Consola privada · {validation}
      </p>
      <h1 className="font-display mt-3 text-4xl">Hola, {session.user.name}.</h1>
      <p className="mt-3 max-w-2xl text-mist">
        Kondax OS. El cotizador y el ROI públicos alimentan esta consola; Passport
        define qué puedes ver.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          ["3", "Proyectos"],
          ["3", "Células"],
          [role, "Rol activo"],
        ].map(([value, label]) => (
          <article key={label} className="cell p-5">
            <p className="font-display text-2xl capitalize">{value}</p>
            <p className="mt-1 text-sm text-mist">{label}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cards.map(([title, text]) => (
          <article key={title} className="cell p-6">
            <h2 className="font-display text-2xl">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-mist">{text}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/cotizador" className="text-signal">
          Abrir cotizador →
        </Link>
        <Link href="/roi" className="text-signal">
          Abrir ROI →
        </Link>
        <Link href="/app/auditoria" className="text-signal">
          Ver cadena de auditoría →
        </Link>
      </div>
    </div>
  );
}
