import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Consola",
};

export default async function AppHomePage() {
  const session = await auth();
  if (!session?.user) redirect("/passport");
  const role = session.user.role ?? "fundador";

  const cards =
    role === "programador"
      ? [
          ["Validación técnica", "GitHub / GitLab confirmados. Puedes unirte a células y al marketplace."],
          ["Células abiertas", "2 células buscan un asiento de ingeniería esta semana."],
          ["Horas", "La fábrica registra tiempo contra proyecto, no contra tickets sueltos."],
        ]
      : role === "inversor"
        ? [
            ["Deal-flow", "3 proyectos co-creados con sala de equity abierta."],
            ["Diligencia", "Passport comercial activo. Logs de acceso disponibles."],
            ["Participación", "Sweat equity y rondas se ven en el mismo cap table."],
          ]
        : role === "corporativo"
          ? [
              ["ROI", "Usa la calculadora pública y escala a un retainer Sovereign."],
              ["Cumplimiento", "KYC/AML, RegTech y evidencias viven en Auditoría."],
              ["Células", "Una célula dedicada puede residir en tu VPC."],
            ]
          : [
              ["Incubadora", "Tu agente ya puede estructurar el negocio y el pitch."],
              ["Socios", "El marketplace solo muestra identidades validadas."],
              ["Co-creación", "Si Kondax construye contigo, el equity queda registrado."],
            ];

  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
        Consola privada
      </p>
      <h1 className="font-display mt-3 text-4xl">Hola, {session.user.name}.</h1>
      <p className="mt-3 max-w-2xl text-mist">
        Estás dentro de Kondax OS. Los módulos públicos (cotizador y ROI) alimentan
        esta consola; Passport define qué puedes ver.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cards.map(([title, text]) => (
          <article key={title} className="cell p-6">
            <h2 className="font-display text-2xl">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-mist">{text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
