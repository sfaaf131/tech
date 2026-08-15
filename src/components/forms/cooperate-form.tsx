"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { experiments } from "@/lib/lab";
import {
  cooperateIntents,
  experimentHints,
  intentLabels,
  messageHints,
  type CooperateIntent,
} from "@/lib/schemas";

type FieldErrors = Record<string, string[] | undefined>;

function asIntent(value: string | null): CooperateIntent | "" {
  return cooperateIntents.includes(value as CooperateIntent) ? (value as CooperateIntent) : "";
}

const fieldFocus: Record<string, string> = {
  intent: "coop-intent-entrar",
  experiment: "coop-experiment",
  name: "coop-name",
  email: "coop-email",
  message: "coop-message",
  link: "coop-link",
};

export function CooperateForm() {
  const search = useSearchParams();
  const startedAt = useRef("");
  useEffect(() => {
    startedAt.current = String(Date.now());
  }, []);
  const presetExperiment = experiments.some(
    (item) => item.slug === (search.get("experimento") ?? search.get("exp")),
  )
    ? (search.get("experimento") ?? search.get("exp") ?? "")
    : "";
  const presetIntent = asIntent(search.get("intento") ?? search.get("intent")) || (presetExperiment ? "entrar" : "");

  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "error">("idle");
  const [detail, setDetail] = useState<string | null>(null);
  const [fields, setFields] = useState<FieldErrors>({});
  const [intent, setIntent] = useState<CooperateIntent | "">(presetIntent);

  function focusFirst(next: FieldErrors) {
    const order = ["intent", "experiment", "name", "email", "message", "link"];
    const first = order.find((key) => next[key]?.[0]);
    if (!first) return;
    document.getElementById(fieldFocus[first])?.focus();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("busy");
    setDetail(null);
    setFields({});

    try {
      const response = await fetch("/api/cooperar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, t: startedAt.current }),
      });
      const payload = (await response.json().catch(() => null)) as {
        stored?: string;
        error?: { fieldErrors?: FieldErrors } | string;
      } | null;

      if (!response.ok) {
        setStatus("error");
        if (response.status === 429) {
          setDetail(
            typeof payload?.error === "string" ? payload.error : "Demasiados envíos. Espera un rato.",
          );
          return;
        }
        if (payload?.error && typeof payload.error === "object") {
          const next = payload.error.fieldErrors ?? {};
          setFields(next);
          setDetail("Revisa los campos marcados.");
          queueMicrotask(() => focusFirst(next));
          return;
        }
        setDetail("No salió. El mensaje sigue en el cuadro: puedes reintentar. O escríbeme a team@kondax.tech.");
        return;
      }

      setStatus("ok");
      setDetail("Llegó. Si hay encaje, escribo a este correo. Si no, no invento una reunión.");
    } catch {
      setStatus("error");
      setDetail("No salió. El mensaje sigue en el cuadro: puedes reintentar.");
    }
  }

  if (status === "ok") {
    return (
      <div className="banner" role="status">
        <h2 className="row-title">Llegó.</h2>
        <p className="lede ok">{detail}</p>
        <div className="actions">
          <Link className="button ghost" href="/">
            Volver al taller
          </Link>
          <button className="button ghost" type="button" onClick={() => setStatus("idle")}>
            Dejar otra
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-busy={status === "busy"}>
      <div className="hp" aria-hidden="true">
        <label htmlFor="company_website">Sitio web</label>
        <input id="company_website" type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>
      {detail ? (
        <p className="alert" role="alert">
          {detail}
        </p>
      ) : null}

      <fieldset
        className="field"
        aria-invalid={Boolean(fields.intent)}
        aria-required="true"
        aria-describedby={fields.intent ? "coop-intent-error" : "coop-intent-hint"}
      >
        <legend className="field-label">Qué quieres hacer</legend>
        <div className="radios">
          {cooperateIntents.map((item) => (
            <label className="radio" key={item}>
              <input
                id={`coop-intent-${item}`}
                type="radio"
                name="intent"
                value={item}
                checked={intent === item}
                onChange={() => setIntent(item)}
                required
              />
              {intentLabels[item]}
            </label>
          ))}
        </div>
        {fields.intent ? (
          <p id="coop-intent-error" className="alert">
            {fields.intent[0]}
          </p>
        ) : (
          <p id="coop-intent-hint" className="hint">
            Elige una.
          </p>
        )}
      </fieldset>

      <label className="field" htmlFor="coop-experiment">
        <span className="field-label">Experimento</span>
        <select
          id="coop-experiment"
          name="experiment"
          defaultValue={presetExperiment}
          required={intent === "entrar"}
          aria-required={intent === "entrar"}
          aria-invalid={Boolean(fields.experiment)}
          aria-describedby={fields.experiment ? "coop-experiment-error" : "coop-experiment-hint"}
        >
          <option value="">Ninguno</option>
          {experiments.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.title}
            </option>
          ))}
        </select>
        {fields.experiment ? (
          <p id="coop-experiment-error" className="alert">
            {fields.experiment[0]}
          </p>
        ) : (
          <p id="coop-experiment-hint" className="hint">
            {experimentHints[intent]}
          </p>
        )}
      </label>

      <label className="field" htmlFor="coop-name">
        <span className="field-label">Nombre</span>
        <input
          id="coop-name"
          name="name"
          required
          autoComplete="name"
          aria-invalid={Boolean(fields.name)}
          aria-describedby={fields.name ? "coop-name-error" : "coop-name-hint"}
        />
        {fields.name ? (
          <p id="coop-name-error" className="alert">
            {fields.name[0]}
          </p>
        ) : (
          <p id="coop-name-hint" className="hint">
            Cómo te llamo en la respuesta.
          </p>
        )}
      </label>

      <label className="field" htmlFor="coop-email">
        <span className="field-label">Correo</span>
        <input
          id="coop-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={Boolean(fields.email)}
          aria-describedby={fields.email ? "coop-email-error" : "coop-email-hint"}
        />
        {fields.email ? (
          <p id="coop-email-error" className="alert">
            {fields.email[0]}
          </p>
        ) : (
          <p id="coop-email-hint" className="hint">
            Ahí escribo. No hay lista ni newsletter.
          </p>
        )}
      </label>

      <label className="field" htmlFor="coop-message">
        <span className="field-label">Qué traes</span>
        <textarea
          id="coop-message"
          name="message"
          required
          placeholder={messageHints[intent]}
          aria-invalid={Boolean(fields.message)}
          aria-describedby={fields.message ? "coop-message-error" : "coop-message-hint"}
        />
        {fields.message ? (
          <p id="coop-message-error" className="alert">
            {fields.message[0]}
          </p>
        ) : (
          <p id="coop-message-hint" className="hint">
            {messageHints[intent]}
          </p>
        )}
      </label>

      <label className="field" htmlFor="coop-link">
        <span className="field-label">
          Un enlace <span className="muted">(opcional)</span>
        </span>
        <input
          id="coop-link"
          name="link"
          type="url"
          inputMode="url"
          autoComplete="url"
          aria-invalid={Boolean(fields.link)}
          aria-describedby={fields.link ? "coop-link-error" : "coop-link-hint"}
        />
        {fields.link ? (
          <p id="coop-link-error" className="alert">
            {fields.link[0]}
          </p>
        ) : (
          <p id="coop-link-hint" className="hint">
            Un repo, un texto, o el caso. Si no hay, déjalo vacío.
          </p>
        )}
      </label>

      <div className="form-submit">
        <button className="button" type="submit" disabled={status === "busy"}>
          {status === "busy" ? "Enviando…" : "Enviar"}
        </button>
        <p className="hint">No hay autorespuesta. Si no hay encaje, no contesto para rellenar.</p>
      </div>
    </form>
  );
}
