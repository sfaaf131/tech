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
      if (payload?.error && typeof payload.error === "object") {
        setFields(payload.error.fieldErrors ?? {});
        setDetail("Revisa los campos marcados.");
      } else if (response.status === 429) {
        setDetail("Demasiadas solicitudes. Espera unos minutos.");
      } else {
        setDetail("No pudimos recibir la postulación. Inténtalo otra vez.");
      }
      return;
    }
    setStatus("ok");
    setDetail(
      payload?.id
        ? `Expediente ${payload.id}. Evaluamos viabilidad técnica y encaje.`
        : "Postulación recibida.",
    );
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium">
          Fundador
          <input required name="name" className="field mt-2 font-normal" autoComplete="name" />
          {fields.name ? <p className="mt-1 text-xs text-danger">{fields.name[0]}</p> : null}
        </label>
        <label className="block text-sm font-medium">
          Correo
          <input required name="email" type="email" className="field mt-2 font-normal" autoComplete="email" />
          {fields.email ? <p className="mt-1 text-xs text-danger">{fields.email[0]}</p> : null}
        </label>
      </div>
      <label className="block text-sm font-medium">
        Compañía o nombre del proyecto
        <input required name="company" className="field mt-2 font-normal" />
        {fields.company ? <p className="mt-1 text-xs text-danger">{fields.company[0]}</p> : null}
      </label>
      <label className="block text-sm font-medium">
        La idea
        <textarea
          required
          name="idea"
          rows={5}
          minLength={24}
          className="field mt-2 font-normal"
          placeholder="A quién ayudas, qué construyes y por qué ahora."
        />
        {fields.idea ? <p className="mt-1 text-xs text-danger">{fields.idea[0]}</p> : null}
      </label>
      <label className="block text-sm font-medium">
        Mercado
        <input name="market" className="field mt-2 font-normal" placeholder="Geografía, cliente y tamaño aproximado" />
      </label>
      <label className="block text-sm font-medium">
        Tracción
        <textarea
          name="traction"
          rows={3}
          className="field mt-2 font-normal"
          placeholder="Usuarios, ingresos, cartas de intención, o por qué el fundador conoce la industria."
        />
      </label>
      <Button type="submit" disabled={status === "busy"}>
        {status === "busy" ? "Enviando…" : "Postular el proyecto"}
      </Button>
      {status === "ok" ? <p className="text-sm text-mist">{detail}</p> : null}
      {status === "error" ? <p className="text-sm text-danger">{detail}</p> : null}
    </form>
  );
}
