import {
  audienceFactor,
  audienceRateUsd,
  scopes,
  services,
  timelines,
  type AudienceId,
  type ScopeId,
  type ServiceId,
  type TimelineId,
} from "@/lib/catalog";

export type QuoteInput = {
  audience: AudienceId;
  serviceIds: ServiceId[];
  scope: ScopeId;
  timeline: TimelineId;
  equity: boolean;
};

export type CellSeat = {
  role: string;
  count: number;
};

export type QuoteResult = {
  hours: number;
  rateUsd: number;
  lowUsd: number;
  highUsd: number;
  weeks: number;
  cell: CellSeat[];
  notes: string[];
  equityShare: number | null;
  saasHint: "launch" | "studio" | "cell" | "sovereign";
};

const serviceById = Object.fromEntries(services.map((item) => [item.id, item]));

export function estimateQuote(input: QuoteInput): QuoteResult {
  const selected = input.serviceIds
    .map((id) => serviceById[id])
    .filter(Boolean);

  const baseHours = selected.reduce((sum, item) => sum + item.hours, 0);
  const scope = scopes.find((item) => item.id === input.scope) ?? scopes[1];
  const timeline =
    timelines.find((item) => item.id === input.timeline) ?? timelines[2];

  const overlap = selected.length > 1 ? 1 - Math.min(0.22, (selected.length - 1) * 0.06) : 1;
  const hours = Math.round(
    baseHours *
      scope.factor *
      audienceFactor[input.audience] *
      timeline.factor *
      overlap,
  );

  const rateUsd = audienceRateUsd[input.audience];
  const mid = hours * rateUsd;
  const lowUsd = Math.round(mid * 0.88);
  const highUsd = Math.round(mid * 1.18);

  const cell: CellSeat[] = [{ role: "Tech lead", count: 1 }];
  const engineers = hours > 900 ? 4 : hours > 500 ? 3 : hours > 220 ? 2 : 1;
  cell.push({ role: "Ingeniería", count: engineers });
  if (hours > 480) cell.push({ role: "QA", count: 1 });
  if (selected.some((item) => item.group === "automation")) {
    cell.push({ role: "ML / agentes", count: 1 });
  }
  if (selected.some((item) => item.group === "banking") || input.audience === "banca") {
    cell.push({ role: "Seguridad y cumplimiento", count: 1 });
  }
  if (input.audience === "emprendedor") {
    cell.push({ role: "Operador de incubación", count: 1 });
  }

  const notes: string[] = [];
  if (timeline.weeks < scope.weeksHint) {
    notes.push(
      "El plazo comprime el calendario: sube el factor de paralelismo y la tarifa efectiva de la célula.",
    );
  }
  if (input.audience === "banca") {
    notes.push(
      "Banca incluye controles de evidencia, ambientes segregados y preparación SOC 2 / ISO 27001.",
    );
  }
  if (selected.some((item) => item.id === "agents")) {
    notes.push(
      "Los agentes autónomos se diseñan con supervisión humana, bitácora de herramientas y límites de acción.",
    );
  }

  let equityShare: number | null = null;
  if (input.equity) {
    equityShare =
      input.audience === "emprendedor"
        ? Math.min(0.22, 0.08 + hours / 12000)
        : Math.min(0.12, 0.04 + hours / 18000);
    notes.push(
      "Sweat equity aplica a proyectos co-creados: Kondax aporta célula y producto a cambio de participación.",
    );
  }

  const saasHint =
    input.audience === "banca" || input.audience === "enterprise"
      ? "sovereign"
      : input.audience === "pyme"
        ? "cell"
        : hours > 400
          ? "studio"
          : "launch";

  return {
    hours,
    rateUsd,
    lowUsd,
    highUsd,
    weeks: timeline.weeks,
    cell,
    notes,
    equityShare,
    saasHint,
  };
}
