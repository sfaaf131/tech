"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { experiments } from "@/lib/lab";
import { intentLabels, cooperateIntents } from "@/lib/schemas";

type FieldErrors = Record<string, string[] | undefined>;

export function CooperateForm() {
  const search = useSearchParams();
  const preset = experiments.some((item) => item.slug === search.get("exp"))
    ? (search.get("exp") ?? "")
    : "";
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "error">("idle");
  const [detail, setDetail] = useState<string | null>(null);
  const [fields, setFields] = useState<FieldErrors>({});

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
        body: JSON.stringify(data),
      });
      const payload = (await response.json().catch(() => null)) as {
        stored?: string;
        error?: { fieldErrors?: FieldErrors } | string;
      } | null;

      if (!response.ok) {
        setStatus("error");
        if (response.status === 429) {
          setDetail(
            typeof payload?.error === "string"
              ? payload.error
              : "Demasiadas notas. Espera unos minutos.",
          );
          return;
        }
        if (payload?.error && typeof payload.error === "object") {
          setFields(payload.error.fieldErrors ?? {});
          setDetail("Revisa los campos marcados.");
          return;
        }
        setDetail("No se pudo recibir. Inténtalo otra vez o escribe a team@kondax.tech.");
        return;
      }

      setStatus("ok");
      setDetail(
        payload?.stored === "pending"
          ? "Llegó. Si calza, te escribo. Si pasan unos días, manda el mismo texto a team@kondax.tech."
          : "Llegó. Si calza, te escribo.",
      );
      form.reset();
    } catch {
      setStatus("error");
      setDetail("No hay conexión. Inténtalo otra vez.");
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-busy={status === "busy"}>
      <div className="hp" aria-hidden="true">
        <label>
          Sitio web
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="fields two">
        <label className="field" htmlFor="coop-name">
          Nombre
          <input
            id="coop-name"
            name="name"
            required
            autoComplete="name"
            aria-invalid={Boolean(fields.name)}
            aria-describedby={fields.name ? "coop-name-error" : undefined}
          />
          {fields.name ? (
            <p id="coop-name-error" className="alert" role="alert">
              {fields.name[0]}
            </p>
          ) : null}
        </label>
        <label className="field" htmlFor="coop-email">
          Correo
          <input
            id="coop-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={Boolean(fields.email)}
            aria-describedby={fields.email ? "coop-email-error" : undefined}
          />
          {fields.email ? (
            <p id="coop-email-error" className="alert" role="alert">
              {fields.email[0]}
            </p>
          ) : null}
        </label>
      </div>

      <div className="fields two">
        <label className="field" htmlFor="coop-intent">
          Para qué escribes
          <select
            id="coop-intent"
            name="intent"
            required
            defaultValue={preset ? "entrar" : ""}
            aria-invalid={Boolean(fields.intent)}
            aria-describedby={fields.intent ? "coop-intent-error" : undefined}
          >
            <option value="" disabled>
              Elige una
            </option>
            {cooperateIntents.map((intent) => (
              <option key={intent} value={intent}>
                {intentLabels[intent]}
              </option>
            ))}
          </select>
          {fields.intent ? (
            <p id="coop-intent-error" className="alert" role="alert">
              {fields.intent[0]}
            </p>
          ) : null}
        </label>
        <label className="field" htmlFor="coop-experiment">
          Experimento
          <select
            id="coop-experiment"
            name="experiment"
            defaultValue={preset}
            aria-invalid={Boolean(fields.experiment)}
            aria-describedby={fields.experiment ? "coop-experiment-error" : "coop-experiment-hint"}
          >
            <option value="">Ninguno / no aplica</option>
            {experiments.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.number} · {item.title}
              </option>
            ))}
          </select>
          {fields.experiment ? (
            <p id="coop-experiment-error" className="alert" role="alert">
              {fields.experiment[0]}
            </p>
          ) : (
            <p id="coop-experiment-hint" className="muted" style={{ fontWeight: 400, fontSize: "0.88rem" }}>
              Obligatorio si quieres entrar a uno.
            </p>
          )}
        </label>
      </div>

      <label className="field" htmlFor="coop-message">
        Nota
        <textarea
          id="coop-message"
          name="message"
          required
          aria-invalid={Boolean(fields.message)}
          aria-describedby={fields.message ? "coop-message-error" : "coop-message-hint"}
        />
        {fields.message ? (
          <p id="coop-message-error" className="alert" role="alert">
            {fields.message[0]}
          </p>
        ) : (
          <p id="coop-message-hint" className="muted" style={{ fontWeight: 400, fontSize: "0.88rem" }}>
            Un hecho, un contexto, una pregunta. Mínimo unas dos líneas.
          </p>
        )}
      </label>

      <div>
        <button className="button" type="submit" disabled={status === "busy"}>
          {status === "busy" ? "Enviando…" : "Enviar nota"}
        </button>
      </div>

      {detail ? (
        <div className="banner" role={status === "ok" ? "status" : "alert"}>
          <p>{detail}</p>
        </div>
      ) : null}
    </form>
  );
}
