import { Status } from "@/components/ui/primitives";
import type { DemoProject } from "@/lib/portfolio";

const columns = [
  { id: "hecho" as const, label: "Hecho" },
  { id: "en curso" as const, label: "En curso" },
  { id: "siguiente" as const, label: "Siguiente" },
];

export function SprintBoard({
  project,
  compact = false,
}: {
  project: DemoProject;
  compact?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-ink-2 shadow-[0_20px_60px_rgba(17,17,17,0.08)]">
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <p className="text-sm font-medium">{project.name}</p>
          <p className="text-xs text-mist">{project.status}</p>
        </div>
        <Status tone="live">{project.kind === "startup" ? "Socio" : "Cliente B2B"}</Status>
      </header>
      <div className="grid gap-3 p-3 sm:grid-cols-3">
        {columns.map((column) => {
          const items = project.sprints.filter((sprint) => sprint.status === column.id);
          const shown = compact ? items.slice(0, 1) : items;
          return (
            <div key={column.id} className="min-w-0">
              <p className="px-1 pb-2 text-xs font-medium text-mist">
                {column.label}
                <span className="ml-1 text-copper">{items.length}</span>
              </p>
              <div className="space-y-2">
                {shown.map((sprint) => (
                  <article key={sprint.name} className="rounded-xl border border-line bg-ink px-3 py-3">
                    <p className="text-sm font-medium leading-5">{sprint.name}</p>
                    <p className="mt-1 text-xs leading-5 text-mist">{sprint.deliverable}</p>
                    {sprint.hours ? (
                      <p className="mt-2 text-[11px] text-copper">{sprint.hours} h</p>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
