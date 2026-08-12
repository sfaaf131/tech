const projects = [
  {
    name: "Ruta Norte",
    type: "Co-creación",
    status: "Incubación",
    stack: "Agentes + web",
  },
  {
    name: "Open Ledger",
    type: "Fábrica",
    status: "Sprint 4",
    stack: "Open Banking",
  },
  {
    name: "Celda AML",
    type: "Enterprise",
    status: "Discovery",
    stack: "KYC / AML",
  },
];

export default function ProyectosPage() {
  return (
    <div>
      <h1 className="font-display text-4xl">Proyectos</h1>
      <p className="mt-3 text-mist">
        Iniciativas incubadas, sprints de fábrica y sistemas regulados conviven aquí.
      </p>
      <div className="mt-8 divide-y divide-line border-y border-line">
        {projects.map((project) => (
          <article key={project.name} className="grid gap-2 py-5 md:grid-cols-4">
            <p className="font-display text-xl">{project.name}</p>
            <p className="text-sm text-mist">{project.type}</p>
            <p className="text-sm">{project.status}</p>
            <p className="text-sm text-copper">{project.stack}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
