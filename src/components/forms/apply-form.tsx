"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/primitives";

type FieldErrors = Record<string, string[] | undefined>;

export function ApplyForm() {
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
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = (await response.json().catch(() => null)) as {
        id?: string;
        error?: { fieldErrors?: FieldErrors } | string;
      } | null;
      if (!response.ok) {
        setStatus("error");
        if (response.status === 429) {
          setDetail(
            typeof payload?.error === "string"
              ? payload.error
              : "Demasiadas solicitudes. Espera unos minutos.",
          );
          return;
        }
        if (payload?.error && typeof payload.error === "object") {
          setFields(payload.error.fieldErrors ?? {});
          setDetail("Revisa los campos marcados.");
          return;
        }
        setDetail("No pudimos recibir la postulación. Inténtalo otra vez.");
        return;
      }
      setStatus("ok");
      setDetail(
        payload?.id
          ? `Expediente ${payload.id}. Evaluamos industria, tracción y si una célula puede cerrar el primer hito.`
          : "Postulación recibida.",
      );
      form.reset();
    } catch {
      setStatus("error");
      setDetail("No hay conexión. Inténtalo otra vez.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={status === "busy"}
      className="relative space-y-4"
    >
      <div className="absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
        <label>
          Sitio web
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium" htmlFor="apply-name">
          Fundador (nombre)
          <input
            id="apply-name"
            required
            name="name"
            className="field mt-2 font-normal"
            autoComplete="name"
            aria-invalid={Boolean(fields.name)}
            aria-describedby={fields.name ? "apply-name-error" : undefined}
          />
          {fields.name ? (
            <p id="apply-name-error" role="alert" className="mt-1 text-xs text-danger">
              {fields.name[0]}
            </p>
          ) : null}
        </label>
        <label className="block text-sm font-medium" htmlFor="apply-email">
          Correo
          <input
            id="apply-email"
            required
            name="email"
            type="email"
            className="field mt-2 font-normal"
            autoComplete="email"
            aria-invalid={Boolean(fields.email)}
            aria-describedby={fields.email ? "apply-email-error" : undefined}
          />
          {fields.email ? (
            <p id="apply-email-error" role="alert" className="mt-1 text-xs text-danger">
              {fields.email[0]}
            </p>
          ) : null}
        </label>
      </div>
      <label className="block text-sm font-medium" htmlFor="apply-company">
        Compañía
        <input
          id="apply-company"
          required
          name="company"
          className="field mt-2 font-normal"
          aria-invalid={Boolean(fields.company)}
          aria-describedby={fields.company ? "apply-company-error" : undefined}
        />
        {fields.company ? (
          <p id="apply-company-error" role="alert" className="mt-1 text-xs text-danger">
            {fields.company[0]}
          </p>
        ) : null}
      </label>
      <label className="block text-sm font-medium" htmlFor="apply-idea">
        Qué debe construir la célula
        <textarea
          id="apply-idea"
          required
          name="idea"
          rows={5}
          minLength={24}
          className="field mt-2 font-normal"
          placeholder="Qué producto o flujo, para quién, y qué hito cierra el primer tramo."
          aria-invalid={Boolean(fields.idea)}
          aria-describedby={fields.idea ? "apply-idea-error" : undefined}
        />
        {fields.idea ? (
          <p id="apply-idea-error" role="alert" className="mt-1 text-xs text-danger">
            {fields.idea[0]}
          </p>
        ) : null}
      </label>
      <label className="block text-sm font-medium" htmlFor="apply-market">
        Industria que conoces de primera mano
        <input
          id="apply-market"
          required
          name="market"
          className="field mt-2 font-normal"
          placeholder="Rubro, cliente y por qué tú, no un tesista."
          aria-invalid={Boolean(fields.market)}
          aria-describedby={fields.market ? "apply-market-error" : undefined}
        />
        {fields.market ? (
          <p id="apply-market-error" role="alert" className="mt-1 text-xs text-danger">
            {fields.market[0]}
          </p>
        ) : null}
      </label>
      <label className="block text-sm font-medium" htmlFor="apply-traction">
        Tracción o acceso al canal
        <textarea
          id="apply-traction"
          required
          name="traction"
          rows={3}
          minLength={12}
          className="field mt-2 font-normal"
          placeholder="Clientes, LOI, ventas, o el acceso concreto al canal. Vacío = no hay encaje."
          aria-invalid={Boolean(fields.traction)}
          aria-describedby={fields.traction ? "apply-traction-error" : undefined}
        />
        {fields.traction ? (
          <p id="apply-traction-error" role="alert" className="mt-1 text-xs text-danger">
            {fields.traction[0]}
          </p>
        ) : null}
      </label>
      <label className="flex items-start gap-3 text-sm leading-6">
        <input
          type="checkbox"
          name="partner"
          required
          className="mt-1 size-4 shrink-0 accent-paper"
          aria-invalid={Boolean(fields.partner)}
          aria-describedby={fields.partner ? "apply-partner-error" : undefined}
        />
        <span>
          Entiendo que Kondax entra como socio (equity por hitos), no como proveedor por hora.
        </span>
      </label>
      {fields.partner ? (
        <p id="apply-partner-error" role="alert" className="text-xs text-danger">
          {fields.partner[0]}
        </p>
      ) : null}
      <Button type="submit" disabled={status === "busy"}>
        {status === "busy" ? "Enviando…" : "Enviar postulación"}
      </Button>
      <div aria-live="polite" role="status">
        {status === "ok" ? <p className="text-sm text-mist">{detail}</p> : null}
      </div>
      <div aria-live="assertive">
        {status === "error" ? <p className="text-sm text-danger">{detail}</p> : null}
      </div>
    </form>
  );
}
