"use client";

import { useMemo, useState, type ReactNode } from "react";
import { clp, months } from "@/lib/format";
import { estimateRoi } from "@/lib/roi";

export function RoiCalculator() {
  const [fte, setFte] = useState(8);
  const [salaryClp, setSalaryClp] = useState(1_800_000 * 12);
  const [automationPct, setAutomationPct] = useState(0.35);
  const [monthlyVolume, setMonthlyVolume] = useState(12000);
  const [errorRate, setErrorRate] = useState(0.018);
  const [costPerErrorClp, setCostPerErrorClp] = useState(22000);
  const [complianceClp, setComplianceClp] = useState(48_000_000);
  const [implementationUsd, setImplementationUsd] = useState(85000);
  const [annualSaasClp, setAnnualSaasClp] = useState(189000 * 12);

  const result = useMemo(
    () =>
      estimateRoi({
        fte,
        salaryClp,
        automationPct,
        monthlyVolume,
        errorRate,
        costPerErrorClp,
        complianceClp,
        implementationUsd,
        annualSaasClp,
      }),
    [
      fte,
      salaryClp,
      automationPct,
      monthlyVolume,
      errorRate,
      costPerErrorClp,
      complianceClp,
      implementationUsd,
      annualSaasClp,
    ],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <form className="grid gap-5 sm:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
        <Field label="FTE involucrados" value={String(fte)}>
          <input
            type="number"
            min={1}
            className="field"
            value={fte}
            onChange={(event) => setFte(Number(event.target.value))}
          />
        </Field>
        <Field label="Costo laboral anual por FTE (CLP)" value={clp(salaryClp)}>
          <input
            type="number"
            className="field"
            value={salaryClp}
            onChange={(event) => setSalaryClp(Number(event.target.value))}
          />
        </Field>
        <Field
          label="% automatizable"
          value={`${Math.round(automationPct * 100)}%`}
        >
          <input
            type="range"
            min={0.05}
            max={0.8}
            step={0.01}
            value={automationPct}
            onChange={(event) => setAutomationPct(Number(event.target.value))}
          />
        </Field>
        <Field label="Volumen mensual de casos" value={monthlyVolume.toLocaleString("es-CL")}>
          <input
            type="number"
            className="field"
            value={monthlyVolume}
            onChange={(event) => setMonthlyVolume(Number(event.target.value))}
          />
        </Field>
        <Field label="Tasa de error" value={`${(errorRate * 100).toFixed(1)}%`}>
          <input
            type="range"
            min={0.001}
            max={0.08}
            step={0.001}
            value={errorRate}
            onChange={(event) => setErrorRate(Number(event.target.value))}
          />
        </Field>
        <Field label="Costo por error (CLP)" value={clp(costPerErrorClp)}>
          <input
            type="number"
            className="field"
            value={costPerErrorClp}
            onChange={(event) => setCostPerErrorClp(Number(event.target.value))}
          />
        </Field>
        <Field label="Costo anual de compliance (CLP)" value={clp(complianceClp)}>
          <input
            type="number"
            className="field"
            value={complianceClp}
            onChange={(event) => setComplianceClp(Number(event.target.value))}
          />
        </Field>
        <Field label="Implementación Kondax (USD)" value={implementationUsd.toLocaleString("en-US")}>
          <input
            type="number"
            className="field"
            value={implementationUsd}
            onChange={(event) => setImplementationUsd(Number(event.target.value))}
          />
        </Field>
        <Field label="SaaS / retainer anual (CLP)" value={clp(annualSaasClp)} className="sm:col-span-2">
          <input
            type="number"
            className="field"
            value={annualSaasClp}
            onChange={(event) => setAnnualSaasClp(Number(event.target.value))}
          />
        </Field>
      </form>

      <aside className="cell p-6 md:p-8">
        <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
          Retorno corporativo
        </p>
        <p className="font-display mt-4 text-4xl">{clp(result.year1SavingsClp)}</p>
        <p className="mt-2 text-sm text-mist">Ahorro neto año 1</p>
        <dl className="mt-8 space-y-3 text-sm">
          <Row label="Costo actual anual" value={clp(result.currentAnnualClp)} />
          <Row label="Laboral" value={clp(result.laborClp)} />
          <Row label="Errores" value={clp(result.errorClp)} />
          <Row label="Masa automatizable" value={clp(result.automatableClp)} />
          <Row label="Inversión Kondax año 1" value={clp(result.kondaxYear1Clp)} />
          <Row label="Payback" value={months(result.paybackMonths)} />
          <Row label="Ahorro a 3 años" value={clp(result.year3SavingsClp)} />
          <Row label="ROI 3 años" value={`${(result.roi3y * 100).toFixed(0)}%`} />
        </dl>
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
