"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/primitives";

export function ApplyForm() {
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "error">("idle");
  const [detail, setDetail] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("busy");
    setDetail(null);
    const response = await fetch("/api/apply", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      setStatus("error");
      setDetail("No pudimos recibir la postulación. Revisa los campos e inténtalo otra vez.");
      return;
    }
    const payload = (await response.json()) as { id?: string };
    setStatus("ok");
    setDetail(payload.id ? `Expediente ${payload.id}` : null);
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          Fundador
          <input required name="name" className="field mt-2" autoComplete="name" />
        </label>
        <label className="block text-sm">
          Correo
          <input required name="email" type="email" className="field mt-2" autoComplete="email" />
        </label>
      </div>
      <label className="block text-sm">
        Compañía o nombre del proyecto
        <input required name="company" className="field mt-2" />
      </label>
      <label className="block text-sm">
        La idea
        <textarea
          required
          name="idea"
          rows={5}
          minLength={24}
          className="field mt-2"
          placeholder="A quién ayudas, qué construyes y por qué ahora."
        />
      </label>
      <label className="block text-sm">
        Mercado
        <input name="market" className="field mt-2" placeholder="Geografía, cliente y tamaño aproximado" />
      </label>
      <label className="block text-sm">
        Tracción
        <textarea
          name="traction"
          rows={3}
          className="field mt-2"
          placeholder="Usuarios, ingresos, cartas de intención, o por qué el fundador conoce la industria."
        />
      </label>
      <Button type="submit" disabled={status === "busy"}>
        {status === "busy" ? "Enviando…" : "Postular el proyecto"}
      </Button>
      {status === "ok" ? (
        <p className="text-sm text-signal">Postulación recibida. Evaluamos viabilidad técnica y encaje. {detail}</p>
      ) : null}
      {status === "error" ? <p className="text-sm text-danger">{detail}</p> : null}
    </form>
  );
}
