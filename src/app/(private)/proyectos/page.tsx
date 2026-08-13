import type { Metadata } from "next";
import { auth } from "@/auth";
import { projectsFor } from "@/lib/portfolio";
import { SprintBoard } from "@/components/product/sprint-board";
import { Kicker } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Proyectos",
  robots: { index: false, follow: false },
};

export default async function ProyectosPage() {
  const session = await auth();
  const portal = session?.user.portal ?? "b2b";
  const projects = projectsFor(portal);

  return (
    <div>
      <Kicker>Entregables</Kicker>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {portal === "startup" ? "Hitos técnicos" : "Sprints y proyectos"}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-mist">
        {portal === "startup"
          ? "Cada hito del acuerdo desbloquea participación. Aquí ves qué ya está en producción y qué sigue."
          : "La célula reporta por sprint. Horas, entregable y estado, en un tablero."}
      </p>
      <div className="mt-8 space-y-8">
        {projects.map((project) => (
          <SprintBoard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
