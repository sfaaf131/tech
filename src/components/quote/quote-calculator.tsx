"use client";

import { useMemo, useState } from "react";
import {
  audiences,
  saasPlans,
  scopes,
  services,
  timelines,
  type AudienceId,
  type ScopeId,
  type ServiceId,
  type TimelineId,
} from "@/lib/catalog";
import { usd, usdAsClp } from "@/lib/format";
import { estimateQuote } from "@/lib/quote";

export function QuoteCalculator() {
  const [audience, setAudience] = useState<AudienceId>("emprendedor");
  const [serviceIds, setServiceIds] = useState<ServiceId[]>(["web", "agents"]);
  const [scope, setScope] = useState<ScopeId>("mvp");
  const [timeline, setTimeline] = useState<TimelineId>("8");
  const [equity, setEquity] = useState(true);
  const [seal, setSeal] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const result = useMemo(
    () =>
      estimateQuote({
        audience,
        serviceIds,
        scope,
        timeline,
        equity,
      }),
    [audience, serviceIds, scope, timeline, equity],
  );

  const plan = saasPlans.find((item) => item.id === result.saasHint);

  function toggle(id: ServiceId) {
    setServiceIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    setSeal(null);
  }

  async function persist() {
    setBusy(true);
    try {
      const response = await fetch("/api/cotizar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ audience, serviceIds, scope, timeline, equity, result }),
      });
      const data = (await response.json()) as { hash?: string };
      setSeal(data.hash ?? null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <form className="space-y-8" onSubmit={(event) => event.preventDefault()}>
        <fieldset>
          <legend className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
            Audiencia
          </legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {audiences.map((item) => (
              <label
                key={item.id}
                className={`cell cursor-pointer p-4 text-sm ${audience === item.id ? "border-signal" : ""}`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name="audience"
                  checked={audience === item.id}
                  onChange={() => {
                    setAudience(item.id);
                    setSeal(null);
                  }}
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
            Servicios
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {services.map((item) => {
              const active = serviceIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm ${
                    active ? "border-signal bg-signal text-signal-ink" : "border-line"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-6 sm:grid-cols-2">
          <fieldset>
            <legend className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
              Alcance
            </legend>
            <div className="mt-3 space-y-2">
              {scopes.map((item) => (
                <label key={item.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="scope"
                    checked={scope === item.id}
                    onChange={() => {
                      setScope(item.id);
                      setSeal(null);
                    }}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
              Plazo
            </legend>
            <div className="mt-3 space-y-2">
              {timelines.map((item) => (
                <label key={item.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="timeline"
                    checked={timeline === item.id}
                    onChange={() => {
                      setTimeline(item.id);
                      setSeal(null);
                    }}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={equity}
            onChange={(event) => {
              setEquity(event.target.checked);
              setSeal(null);
            }}
          />
          Explorar vía sweat equity (co-creación)
        </label>
      </form>

      <aside className="cell p-6 md:p-8">
        {serviceIds.length === 0 ? (
          <p className="text-mist">Elige al menos un servicio para estimar la célula.</p>
        ) : (
          <>
            <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
              Estimación Kondax
            </p>
            <p className="font-display mt-4 text-4xl">{result.hours.toLocaleString("es-CL")} h</p>
            <p className="mt-2 text-sm text-mist">
              Banda {usd(result.lowUsd)} – {usd(result.highUsd)} · {usdAsClp(result.lowUsd)} –{" "}
              {usdAsClp(result.highUsd)}
            </p>
            <p className="mt-1 text-sm text-mist">
              Tarifa de referencia {usd(result.rateUsd)}/h · {result.weeks} semanas
            </p>
            <div className="mt-6">
              <p className="font-mono text-[11px] tracking-[0.18em] text-mist uppercase">
                Célula
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {result.cell.map((seat) => (
                  <li key={seat.role}>
                    {seat.count} × {seat.role}
                  </li>
                ))}
              </ul>
            </div>
            {plan ? (
              <p className="mt-6 text-sm text-mist">
                Plan SaaS sugerido: <span className="text-paper">{plan.name}</span>
              </p>
            ) : null}
            {result.equityShare ? (
              <p className="mt-2 text-sm text-signal">
                Participación indicativa {(result.equityShare * 100).toFixed(1)}%
              </p>
            ) : null}
            <ul className="mt-6 space-y-2 text-sm text-mist">
              {result.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={persist}
              disabled={busy}
              className="mt-8 rounded-full bg-signal px-5 py-2.5 text-sm font-medium text-signal-ink disabled:opacity-60"
            >
              {busy ? "Sellando…" : "Sellar cotización"}
            </button>
            {seal ? (
              <p className="mt-4 break-all font-mono text-[11px] text-copper">
                Sello SHA-256 {seal}
              </p>
            ) : null}
          </>
        )}
      </aside>
    </div>
  );
}
