"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { audiences } from "@/lib/catalog";

export function ContactForm() {
  const params = useSearchParams();
  const origen = params.get("origen") ?? "web";
  const sello = params.get("sello") ?? "";
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get("company_url") ?? "")) return;
    setStatus("sending");
    const response = await fetch("/api/contacto", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        audience: data.get("audience"),
        message: data.get("message"),
        origen,
        sello,
      }),
    });
    setStatus(response.ok ? "sent" : "error");
    if (response.ok) form.reset();
  }

  if (status === "sent") {
    return (
      <div className="cell p-8">
        <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
          Recibido
        </p>
        <h2 className="font-display mt-3 text-3xl">La conversación quedó sellada.</h2>
        <p className="mt-3 text-sm leading-6 text-mist">
          Revisamos identidad y contexto antes de armar una célula o abrir incubadora.
          Te respondemos a ese correo.
        </p>
      </div>
    );
  }

  return (
    <form className="cell space-y-5 p-6 md:p-8" onSubmit={onSubmit}>
      <input type="text" name="company_url" tabIndex={-1} autoComplete="off" className="hidden" />
      <label className="block text-sm">
        <span className="text-mist">Nombre</span>
        <input required name="name" className="field mt-2" autoComplete="name" />
      </label>
      <label className="block text-sm">
        <span className="text-mist">Correo</span>
        <input required type="email" name="email" className="field mt-2" autoComplete="email" />
      </label>
      <label className="block text-sm">
        <span className="text-mist">Audiencia</span>
        <select name="audience" className="field mt-2" defaultValue="emprendedor">
          {audiences.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="text-mist">Qué necesitas</span>
        <textarea
          required
          name="message"
          rows={5}
          className="field mt-2"
          defaultValue={
            sello
              ? `Vengo de ${origen}. Sello ${sello}.`
              : origen !== "web"
                ? `Vengo de ${origen}.`
                : ""
          }
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-signal px-5 py-2.5 text-sm font-medium text-signal-ink disabled:opacity-60"
      >
        {status === "sending" ? "Enviando…" : "Enviar a Kondax"}
      </button>
      {status === "error" ? (
        <p className="text-sm text-danger">No se pudo enviar. Inténtalo de nuevo.</p>
      ) : null}
    </form>
  );
}
