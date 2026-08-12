"use client";

import { Suspense, useMemo, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { clp, months } from "@/lib/format";
import { estimateRoi, type RoiInput } from "@/lib/roi";
import { parseRoiPreset, roiPresets } from "@/lib/roi-presets";

export function RoiCalculator() {
  return (
    <Suspense fallback={<p className="text-mist">Cargando calculadora…</p>}>
      <RoiCalculatorInner />
    </Suspense>
  );
}

function RoiCalculatorInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialKey = parseRoiPreset(searchParams);
  const [preset, setPreset] = useState(initialKey);
  const [values, setValues] = useState<RoiInput>(roiPresets[initialKey]);
  const [seal, setSeal] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const result = useMemo(() => estimateRoi(values), [values]);
  const max = Math.max(result.currentAnnualClp, result.kondaxYear1Clp, 1);

  function applyPreset(key: string) {
    const next = roiPresets[key];
    if (!next) return;
    setPreset(key);
    setValues(next);
    setSeal(null);
    router.replace(`/roi?preset=${key}`, { scroll: false });
  }

  function patch<K extends keyof RoiInput>(key: K, value: RoiInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setSeal(null);
  }

  async function persist() {
    setBusy(true);
    try {
      const response = await fetch("/api/roi", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as { seal?: string };
      setSeal(data.seal ?? null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(roiPresets).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
              className={`rounded-full border px-4 py-2 text-sm ${
                preset === key ? "border-signal bg-signal text-signal-ink" : "border-line"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <form className="grid gap-5 sm:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
          <Field label="FTE involucrados" value={String(values.fte)}>
            <input
              type="number"
              min={1}
              className="field"
              value={values.fte}
              onChange={(event) => patch("fte", Number(event.target.value))}
            />
          </Field>
          <Field label="Costo laboral anual por FTE (CLP)" value={clp(values.salaryClp)}>
            <input
              type="number"
              className="field"
              value={values.salaryClp}
              onChange={(event) => patch("salaryClp", Number(event.target.value))}
            />
          </Field>
          <Field label="% automatizable" value={`${Math.round(values.automationPct * 100)}%`}>
            <input
              type="range"
              min={0.05}
              max={0.8}
              step={0.01}
              value={values.automationPct}
              onChange={(event) => patch("automationPct", Number(event.target.value))}
            />
          </Field>
          <Field label="Volumen mensual de casos" value={values.monthlyVolume.toLocaleString("es-CL")}>
            <input
              type="number"
              className="field"
              value={values.monthlyVolume}
              onChange={(event) => patch("monthlyVolume", Number(event.target.value))}
            />
          </Field>
          <Field label="Tasa de error" value={`${(values.errorRate * 100).toFixed(1)}%`}>
            <input
              type="range"
              min={0.001}
              max={0.08}
              step={0.001}
              value={values.errorRate}
              onChange={(event) => patch("errorRate", Number(event.target.value))}
            />
          </Field>
          <Field label="Costo por error (CLP)" value={clp(values.costPerErrorClp)}>
            <input
              type="number"
              className="field"
              value={values.costPerErrorClp}
              onChange={(event) => patch("costPerErrorClp", Number(event.target.value))}
            />
          </Field>
          <Field label="Costo anual de compliance (CLP)" value={clp(values.complianceClp)}>
            <input
              type="number"
              className="field"
              value={values.complianceClp}
              onChange={(event) => patch("complianceClp", Number(event.target.value))}
            />
          </Field>
          <Field label="Implementación Kondax (USD)" value={values.implementationUsd.toLocaleString("en-US")}>
            <input
              type="number"
              className="field"
              value={values.implementationUsd}
              onChange={(event) => patch("implementationUsd", Number(event.target.value))}
            />
          </Field>
          <Field label="SaaS / retainer anual (CLP)" value={clp(values.annualSaasClp)} className="sm:col-span-2">
            <input
              type="number"
              className="field"
              value={values.annualSaasClp}
              onChange={(event) => patch("annualSaasClp", Number(event.target.value))}
            />
          </Field>
        </form>
      </div>

      <aside className="cell h-fit p-6 lg:sticky lg:top-24 md:p-8">
        <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
          Retorno corporativo
        </p>
        <p className="font-display mt-4 text-4xl">{clp(result.year1SavingsClp)}</p>
        <p className="mt-2 text-sm text-mist">Ahorro neto año 1</p>
        <div className="mt-6 space-y-3">
          <Bar label="Costo actual" value={result.currentAnnualClp} max={max} />
          <Bar label="Inversión Kondax" value={result.kondaxYear1Clp} max={max} tone="signal" />
        </div>
        <dl className="mt-8 space-y-3 text-sm">
          <Row label="Laboral" value={clp(result.laborClp)} />
          <Row label="Errores" value={clp(result.errorClp)} />
          <Row label="Masa automatizable" value={clp(result.automatableClp)} />
          <Row label="Payback" value={months(result.paybackMonths)} />
          <Row label="Ahorro a 3 años" value={clp(result.year3SavingsClp)} />
          <Row label="ROI 3 años" value={`${(result.roi3y * 100).toFixed(0)}%`} />
        </dl>
        <button
          type="button"
          onClick={persist}
          disabled={busy}
          className="mt-8 rounded-full bg-signal px-5 py-2.5 text-sm font-medium text-signal-ink disabled:opacity-60"
        >
          {busy ? "Sellando…" : "Sellar ROI"}
        </button>
        {seal ? (
          <p className="mt-4 break-all font-mono text-[11px] text-copper">Sello SHA-256 {seal}</p>
        ) : null}
        <Link
          href={`/contacto?origen=roi${seal ? `&sello=${seal}` : ""}`}
          className="mt-6 inline-flex text-sm text-signal"
        >
          Conversar este ROI con Kondax →
        </Link>
        <p className="mt-6 text-xs leading-5 text-mist">
          Modelo ilustrativo: captura el 72% de la masa laboral automatizable, 62% del
          costo de error y 38% del costo de compliance. No es una oferta vinculante.
        </p>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  children,
  className,
}: {
  label: string;
  value: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="flex items-center justify-between gap-3 text-sm">
        <span className="text-mist">{label}</span>
        <span className="font-mono text-[11px] text-copper">{value}</span>
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-line pt-3">
      <dt className="text-mist">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Bar({
  label,
  value,
  max,
  tone = "paper",
}: {
  label: string;
  value: number;
  max: number;
  tone?: "paper" | "signal";
}) {
  const width = Math.min(100, Math.max(4, (value / max) * 100));
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-mist">
        <span>{label}</span>
        <span>{clp(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink-3">
        <div
          className={tone === "signal" ? "h-full bg-signal" : "h-full bg-paper/70"}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
