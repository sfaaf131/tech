"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { experiments, openExperiments } from "@/lib/lab";
import {
  asIntent,
  cooperateCopy,
  cooperateFieldIds,
  cooperateFieldOrder,
  honeypotName,
} from "@/lib/cooperate";
import {
  cooperateIntents,
  experimentHints,
  intentLabels,
  messageHints,
  type CooperateIntent,
} from "@/lib/schemas";
import { site } from "@/lib/site";

type FieldErrors = Record<string, string[] | undefined>;

type SentDraft = {
  name: string;
  email: string;
  intent: string;
  experiment: string;
  message: string;
  link: string;
};

function fieldString(data: Record<string, FormDataEntryValue>, key: string) {
  const value = data[key];
  return typeof value === "string" ? value : "";
}

function draftFromData(data: Record<string, FormDataEntryValue>): SentDraft {
  const intentValue = asIntent(fieldString(data, "intent"));
  const experimentSlug = fieldString(data, "experiment");
  const experimentTitle =
    experiments.find((item) => item.slug === experimentSlug)?.title ?? experimentSlug;
  return {
    name: fieldString(data, "name"),
    email: fieldString(data, "email"),
    intent: intentValue ? intentLabels[intentValue] : fieldString(data, "intent"),
    experiment: experimentTitle,
    message: fieldString(data, "message"),
    link: fieldString(data, "link"),
  };
}

function draftText(draft: SentDraft) {
  const lines = [
    `Nombre: ${draft.name}`,
    `Correo: ${draft.email}`,
    `Intento: ${draft.intent || "—"}`,
    `Experimento: ${draft.experiment || "ninguno"}`,
  ];
  if (draft.link) lines.push(`Enlace: ${draft.link}`);
  lines.push("", draft.message);
  return lines.join("\n");
}

export function CooperateForm({
  presetIntent: initialIntent,
  presetExperiment,
}: {
  presetIntent: CooperateIntent | "";
  presetExperiment: string;
}) {
  const startedAt = useRef("");
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "error">("idle");
  const [detail, setDetail] = useState<string | null>(null);
  const [fields, setFields] = useState<FieldErrors>({});
  const [intent, setIntent] = useState<CooperateIntent | "">(asIntent(initialIntent));
  const [sent, setSent] = useState<SentDraft | null>(null);
  const [copied, setCopied] = useState(false);

  function markStarted() {
    if (!startedAt.current) startedAt.current = String(Date.now());
  }

  useEffect(() => {
    markStarted();
  }, []);

  function resetForm() {
    setStatus("idle");
    setDetail(null);
    setFields({});
    setSent(null);
    setCopied(false);
    startedAt.current = String(Date.now());
  }

  function focusFirst(next: FieldErrors) {
    const first = cooperateFieldOrder.find((key) => next[key]?.[0]);
    if (!first) return;
    document.getElementById(cooperateFieldIds[first])?.focus();
  }

  async function copyDraft() {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(draftText(sent));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setSent(draftFromData(data));
    setCopied(false);
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
        setDetail(
          `No salió. El mensaje sigue en el cuadro: puedes reintentar. O escríbeme a ${site.email}.`,
        );
        return;
      }

      setStatus("ok");
      setDetail(cooperateCopy.successDetail);
    } catch {
      setStatus("error");
      setDetail("No salió. El mensaje sigue en el cuadro: puedes reintentar.");
    }
  }

  if (status === "ok") {
    const body = sent ? draftText(sent) : "";
    const mailto = `mailto:${site.email}?subject=${encodeURIComponent("Cooperar — kondax.tech")}&body=${encodeURIComponent(body)}`;
    return (
      <div className="banner" role="status">
        <h2 className="row-title">{cooperateCopy.successTitle}</h2>
        <p className="lede ok">{detail}</p>
        {sent ? (
          <>
            <p className="hint">
              {sent.name} · {sent.email}
            </p>
            <p className="lede">{sent.message}</p>
          </>
        ) : null}
        <p className="sr-only" aria-live="polite">
          {copied ? "Copiado" : ""}
        </p>
        <div className="actions">
          <button className="button" type="button" onClick={copyDraft}>
            {copied ? "Copiado" : "Copiar el texto"}
          </button>
          <a className="button ghost" href={mailto}>
            Escribir a {site.email}
          </a>
          <Link className="button ghost" href="/">
            Volver al taller
          </Link>
          <button className="button ghost" type="button" onClick={resetForm}>
            Dejar otra
          </button>
        </div>
      </div>
    );
  }

  const experimentOptions = intent === "entrar" ? openExperiments() : experiments;

  return (
    <form
      className="form"
      onSubmit={onSubmit}
      onInput={markStarted}
      noValidate
      aria-busy={status === "busy"}
    >
      <div className="hp" aria-hidden="true">
        <label htmlFor={honeypotName}>Sitio web</label>
        <input id={honeypotName} type="text" name={honeypotName} tabIndex={-1} autoComplete="off" />
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
                onChange={() => {
                  markStarted();
                  setIntent(item);
                }}
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
          {experimentOptions.map((item) => (
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
            {cooperateCopy.emailHint}
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
