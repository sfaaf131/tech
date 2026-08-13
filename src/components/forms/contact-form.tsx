"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/primitives";

const needs = [
  { id: "agentes", label: "Agentes de IA" },
  { id: "rpa", label: "RPA y process mining" },
  { id: "celulas", label: "Célula de ingeniería" },
  { id: "otro", label: "Otra necesidad" },
] as const;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "error">("idle");
  const [detail, setDetail] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("busy");
    setDetail(null);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      setStatus("error");
      setDetail("No pudimos recibir la solicitud. Revisa los campos e inténtalo otra vez.");
      return;
    }
    const payload = (await response.json()) as { id?: string };
    setStatus("ok");
    setDetail(payload.id ? `Referencia ${payload.id}` : null);
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          Nombre
          <input required name="name" className="field mt-2" autoComplete="name" />
        </label>
        <label className="block text-sm">
          Correo
          <input required name="email" type="email" className="field mt-2" autoComplete="email" />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          Empresa
          <input required name="company" className="field mt-2" autoComplete="organization" />
        </label>
        <label className="block text-sm">
          Cargo
          <input name="role" className="field mt-2" autoComplete="organization-title" />
        </label>
      </div>
      <fieldset>
        <legend className="text-sm">Qué necesitas</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {needs.map((need) => (
            <label key={need.id} className="cursor-pointer">
              <input type="radio" name="need" value={need.id} required className="peer sr-only" />
              <span className="inline-block rounded-full border border-line px-3 py-1.5 text-sm peer-checked:border-signal peer-checked:text-signal">
                {need.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block text-sm">
        Contexto
        <textarea
          required
          name="message"
          rows={5}
          minLength={12}
          className="field mt-2"
          placeholder="Proceso, sistema actual y resultado que buscas."
        />
      </label>
      <Button type="submit" disabled={status === "busy"}>
        {status === "busy" ? "Enviando…" : "Solicitar propuesta comercial"}
      </Button>
      {status === "ok" ? (
        <p className="text-sm text-signal">Recibido. Un lead de Kondax te escribe. {detail}</p>
      ) : null}
      {status === "error" ? <p className="text-sm text-danger">{detail}</p> : null}
    </form>
  );
}
