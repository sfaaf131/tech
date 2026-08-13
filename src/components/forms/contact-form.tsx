"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/primitives";

const needs = [
  { id: "agentes", label: "Agentes de IA" },
  { id: "rpa", label: "RPA y process mining" },
  { id: "celulas", label: "Célula de ingeniería" },
  { id: "otro", label: "Otra necesidad" },
] as const;

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
      if (payload?.error && typeof payload.error === "object") {
        setFields(payload.error.fieldErrors ?? {});
        setDetail("Revisa los campos marcados.");
      } else if (response.status === 429) {
        setDetail("Demasiadas solicitudes. Espera unos minutos.");
      } else {
        setDetail("No pudimos recibir la solicitud. Inténtalo otra vez.");
      }
      return;
    }
    setStatus("ok");
    setDetail(payload?.id ? `Referencia ${payload.id}. Te escribimos a tu correo.` : "Recibido.");
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium">
          Nombre
          <input required name="name" className="field mt-2 font-normal" autoComplete="name" />
          {fields.name ? <p className="mt-1 text-xs text-danger">{fields.name[0]}</p> : null}
        </label>
        <label className="block text-sm font-medium">
          Correo
          <input required name="email" type="email" className="field mt-2 font-normal" autoComplete="email" />
          {fields.email ? <p className="mt-1 text-xs text-danger">{fields.email[0]}</p> : null}
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium">
          Empresa
          <input required name="company" className="field mt-2 font-normal" autoComplete="organization" />
          {fields.company ? <p className="mt-1 text-xs text-danger">{fields.company[0]}</p> : null}
        </label>
        <label className="block text-sm font-medium">
          Cargo
          <input name="role" className="field mt-2 font-normal" autoComplete="organization-title" />
        </label>
      </div>
      <fieldset>
        <legend className="text-sm font-medium">Qué necesitas</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {needs.map((need) => (
            <label key={need.id} className="cursor-pointer">
              <input type="radio" name="need" value={need.id} required className="peer sr-only" />
              <span className="inline-block rounded-lg border border-line px-3 py-1.5 text-sm font-normal peer-checked:border-paper peer-checked:bg-paper peer-checked:text-ink">
                {need.label}
              </span>
            </label>
          ))}
        </div>
        {fields.need ? <p className="mt-1 text-xs text-danger">{fields.need[0]}</p> : null}
      </fieldset>
      <label className="block text-sm font-medium">
        Contexto
        <textarea
          required
          name="message"
          rows={5}
          minLength={12}
          className="field mt-2 font-normal"
          placeholder="Proceso, sistema actual y resultado que buscas."
        />
        {fields.message ? <p className="mt-1 text-xs text-danger">{fields.message[0]}</p> : null}
      </label>
      <Button type="submit" disabled={status === "busy"}>
        {status === "busy" ? "Enviando…" : "Solicitar propuesta comercial"}
      </Button>
      {status === "ok" ? <p className="text-sm text-mist">{detail}</p> : null}
      {status === "error" ? <p className="text-sm text-danger">{detail}</p> : null}
    </form>
  );
}
