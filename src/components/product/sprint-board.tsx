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
    <div className="rounded-2xl border border-line bg-ink-2 shadow-[0_20px_60px_rgba(17,17,17,0.08)]">
      <header className="flex items-center justify-between gap-3 border-b border-line px-3 py-3 sm:px-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{project.name}</p>
          <p className="text-xs text-mist">{project.status}</p>
        </div>
        <Status tone="live">{project.kind === "startup" ? "Socio" : "Cliente B2B"}</Status>
      </header>
      {project.cell || project.equity || project.hoursMonth ? (
        <div className="flex items-center justify-between gap-3 border-b border-line bg-ink px-3 py-2 text-[11px] leading-4 text-mist sm:px-4">
          <span className="truncate">{project.cell ?? project.equity}</span>
          {project.hoursMonth ? (
            <span className="shrink-0 tabular-nums">{project.hoursMonth} h / mes</span>
          ) : null}
        </div>
      ) : null}
      <div className="grid grid-cols-3 gap-1.5 p-2 sm:gap-3 sm:p-3">
        {columns.map((column) => {
          const items = project.sprints.filter((sprint) => sprint.status === column.id);
          const shown = compact ? items.slice(0, 1) : items;
          return (
            <div key={column.id} className="min-w-0">
              <p className="px-1 pb-1.5 text-[10px] font-medium text-mist sm:pb-2 sm:text-xs">
                {column.label}
                <span className="ml-1 text-mist">{items.length}</span>
              </p>
              <div
                className={
                  compact
                    ? "min-h-[8.25rem] space-y-2 rounded-xl bg-ink-3 p-1.5 sm:min-h-[9.5rem] sm:p-2"
                    : "space-y-2 rounded-xl bg-ink-3 p-1.5 sm:p-2"
                }
              >
                {shown.map((sprint) => (
                  <article
                    key={sprint.name}
                    className="rounded-lg border border-line bg-ink-2 px-2 py-2 sm:rounded-xl sm:px-3 sm:py-3"
                  >
                    <p className="text-[11px] font-medium leading-4 sm:text-sm sm:leading-5">
                      {sprint.name}
                    </p>
                    <p
                      className={
                        compact
                          ? "mt-1 line-clamp-2 text-[10px] leading-4 text-mist sm:text-xs sm:leading-5"
                          : "mt-1 text-xs leading-5 text-mist"
                      }
                    >
                      {sprint.deliverable}
                    </p>
                    {sprint.hours ? (
                      <p className="mt-2 text-[10px] tabular-nums text-mist sm:text-[11px]">
                        {sprint.hours} h
                      </p>
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
