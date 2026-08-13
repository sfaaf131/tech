"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/primitives";
import { contactNeeds } from "@/lib/services";

type FieldErrors = Record<string, string[] | undefined>;

export function ContactForm() {
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
      const response = await fetch("/api/contact", {
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
        setDetail("No pudimos recibir la solicitud. Inténtalo otra vez.");
        return;
      }
      setStatus("ok");
      setDetail(
        payload?.id
          ? `Referencia ${payload.id}. Respondemos al correo con alcance, composición de célula y banda de inversión.`
          : "Recibido. Te escribimos a tu correo.",
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
        <label className="block text-sm font-medium" htmlFor="contact-name">
          Nombre y apellido
          <input
            id="contact-name"
            required
            name="name"
            className="field mt-2 font-normal"
            autoComplete="name"
            aria-invalid={Boolean(fields.name)}
            aria-describedby={fields.name ? "contact-name-error" : undefined}
          />
          {fields.name ? (
            <p id="contact-name-error" role="alert" className="mt-1 text-xs text-danger">
              {fields.name[0]}
            </p>
          ) : null}
        </label>
        <label className="block text-sm font-medium" htmlFor="contact-email">
          Correo de trabajo
          <input
            id="contact-email"
            required
            name="email"
            type="email"
            className="field mt-2 font-normal"
            autoComplete="email"
            aria-invalid={Boolean(fields.email)}
            aria-describedby={fields.email ? "contact-email-error" : undefined}
          />
          {fields.email ? (
            <p id="contact-email-error" role="alert" className="mt-1 text-xs text-danger">
              {fields.email[0]}
            </p>
          ) : null}
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium" htmlFor="contact-company">
          Empresa
          <input
            id="contact-company"
            required
            name="company"
            className="field mt-2 font-normal"
            autoComplete="organization"
            placeholder="Razón social o marca con la que operan"
            aria-invalid={Boolean(fields.company)}
            aria-describedby={fields.company ? "contact-company-error" : undefined}
          />
          {fields.company ? (
            <p id="contact-company-error" role="alert" className="mt-1 text-xs text-danger">
              {fields.company[0]}
            </p>
          ) : null}
        </label>
        <label className="block text-sm font-medium" htmlFor="contact-role">
          Cargo
          <input
            id="contact-role"
            name="role"
            className="field mt-2 font-normal"
            autoComplete="organization-title"
            placeholder="Operaciones, TI, gerencia, otro"
          />
        </label>
      </div>
      <label className="block text-sm font-medium" htmlFor="contact-need">
        Por dónde te duele
        <select
          id="contact-need"
          required
          name="need"
          defaultValue=""
          className="field mt-2 font-normal"
          aria-invalid={Boolean(fields.need)}
          aria-describedby={fields.need ? "contact-need-error" : undefined}
        >
          <option value="" disabled>
            Elige la capa más cercana
          </option>
          {contactNeeds.map((need) => (
            <option key={need.id} value={need.id}>
              {need.label}
            </option>
          ))}
        </select>
        {fields.need ? (
          <p id="contact-need-error" role="alert" className="mt-1 text-xs text-danger">
            {fields.need[0]}
          </p>
        ) : null}
      </label>
      <label className="block text-sm font-medium" htmlFor="contact-message">
        Flujo actual
        <textarea
          id="contact-message"
          required
          name="message"
          rows={5}
          minLength={24}
          className="field mt-2 font-normal"
          placeholder="Qué proceso, cuántos casos al mes, en qué sistema vive hoy, qué debería quedar hecho en el primer sprint."
          aria-invalid={Boolean(fields.message)}
          aria-describedby={fields.message ? "contact-message-error" : undefined}
        />
        {fields.message ? (
          <p id="contact-message-error" role="alert" className="mt-1 text-xs text-danger">
            {fields.message[0]}
          </p>
        ) : null}
      </label>
      <Button type="submit" disabled={status === "busy"}>
        {status === "busy" ? "Enviando…" : "Enviar y pedir alcance"}
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
