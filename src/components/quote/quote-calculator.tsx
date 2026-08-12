"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  audiences,
  saasPlans,
  scopes,
  serviceGroups,
  services,
  timelines,
  type AudienceId,
  type ScopeId,
  type ServiceId,
  type TimelineId,
} from "@/lib/catalog";
import { usd, usdAsClp } from "@/lib/format";
import { estimateQuote } from "@/lib/quote";
import { parseQuoteParams, serializeQuoteParams } from "@/lib/quote-params";

export function QuoteCalculator() {
  return (
    <Suspense fallback={<p className="text-mist">Cargando cotizador…</p>}>
      <QuoteCalculatorInner />
    </Suspense>
  );
}

function QuoteCalculatorInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initial = parseQuoteParams(searchParams);

  const [audience, setAudience] = useState<AudienceId>(initial.audience ?? "emprendedor");
  const [serviceIds, setServiceIds] = useState<ServiceId[]>(initial.serviceIds ?? ["web", "agents"]);
  const [scope, setScope] = useState<ScopeId>(initial.scope ?? "mvp");
  const [timeline, setTimeline] = useState<TimelineId>(initial.timeline ?? "8");
  const [equity, setEquity] = useState(initial.equity ?? true);
  const [seal, setSeal] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const input = useMemo(
    () => ({ audience, serviceIds, scope, timeline, equity }),
    [audience, serviceIds, scope, timeline, equity],
  );

  const result = useMemo(() => estimateQuote(input), [input]);
  const plan = saasPlans.find((item) => item.id === result.saasHint);

  useEffect(() => {
    const query = serializeQuoteParams(input);
    router.replace(`${pathname}?${query}`, { scroll: false });
  }, [input, pathname, router]);

  function toggle(id: ServiceId) {
    setServiceIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    setSeal(null);
  }

  async function persist() {
    setBusy(true);
    try {
      const response = await fetch("/api/cotizar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...input, result }),
      });
      const data = (await response.json()) as { hash?: string };
      setSeal(data.hash ?? null);
    } finally {
      setBusy(false);
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const contactHref = `/contacto?origen=cotizador${seal ? `&sello=${seal}` : ""}`;

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
          <div className="mt-4 space-y-5">
            {serviceGroups.map((group) => (
              <div key={group.id}>
                <p className="mb-2 text-xs text-mist">{group.label}</p>
                <div className="flex flex-wrap gap-2">
                  {services
                    .filter((item) => item.group === group.id)
                    .map((item) => {
                      const active = serviceIds.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={active}
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
              </div>
            ))}
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

      <aside className="cell h-fit p-6 lg:sticky lg:top-24 md:p-8">
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
            <div className="mt-8 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={persist}
                disabled={busy}
                className="rounded-full bg-signal px-5 py-2.5 text-sm font-medium text-signal-ink disabled:opacity-60"
              >
                {busy ? "Sellando…" : "Sellar cotización"}
              </button>
              <button
                type="button"
                onClick={copyLink}
                className="rounded-full border border-line px-5 py-2.5 text-sm"
              >
                {copied ? "Enlace copiado" : "Copiar enlace"}
              </button>
            </div>
            {seal ? (
              <p className="mt-4 break-all font-mono text-[11px] text-copper">
                Sello SHA-256 {seal}
              </p>
            ) : null}
            <Link href={contactHref} className="mt-6 inline-flex text-sm text-signal">
              Enviar esta estimación a Kondax →
            </Link>
          </>
        )}
      </aside>
    </div>
  );
}
