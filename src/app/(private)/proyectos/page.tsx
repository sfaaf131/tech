import type { Metadata } from "next";
import { auth } from "@/auth";
import { projectsFor } from "@/lib/portfolio";
import { Card, Kicker } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Proyectos",
  robots: { index: false, follow: false },
};

const tone = {
  hecho: "text-signal",
  "en curso": "text-paper",
  siguiente: "text-mist",
} as const;

export default async function ProyectosPage() {
  const session = await auth();
  const portal = session?.user.portal ?? "b2b";
  const projects = projectsFor(portal);

  return (
    <div>
      <Kicker>Entregables</Kicker>
      <h1 className="font-display mt-3 text-3xl md:text-4xl">
        {portal === "startup" ? "Hitos técnicos" : "Sprints y proyectos"}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-mist">
        {portal === "startup"
          ? "Cada hito del acuerdo desbloquea participación. Aquí ves qué ya está en producción y qué sigue."
          : "La célula reporta por sprint. Horas, entregable y estado, sin diluir el dominio."}
      </p>

      <div className="mt-10 space-y-8">
        {projects.map((project) => (
          <Card key={project.id}>
            <p className="font-mono text-[11px] tracking-[0.16em] text-copper uppercase">
              {project.status}
            </p>
            <h2 className="font-display mt-2 text-2xl">{project.name}</h2>
            <p className="mt-2 text-sm leading-6 text-mist">{project.summary}</p>
            <ol className="mt-6 divide-y divide-line border-y border-line">
              {project.sprints.map((sprint) => (
                <li key={sprint.name} className="grid gap-2 py-4 md:grid-cols-[220px_1fr_auto]">
                  <p className="font-medium">{sprint.name}</p>
                  <p className="text-sm text-mist">{sprint.deliverable}</p>
                  <p className={`text-sm ${tone[sprint.status]}`}>
                    {sprint.status}
                    {sprint.hours ? ` · ${sprint.hours} h` : ""}
                  </p>
                </li>
              ))}
            </ol>
          </Card>
        ))}
      </div>
    </div>
  );
}
