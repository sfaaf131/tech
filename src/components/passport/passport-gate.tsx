"use client";

import { useState } from "react";
import { enterPassport, startOauth } from "@/app/(marketing)/passport/actions";
import { roles, type RoleId } from "@/lib/catalog";

const providerLabel: Record<string, string> = {
  github: "GitHub",
  gitlab: "GitLab",
  linkedin: "LinkedIn",
};

export function PassportGate({
  oauth,
}: {
  oauth: { github: boolean; gitlab: boolean; linkedin: boolean };
}) {
  const [role, setRole] = useState<RoleId>("fundador");
  const [name, setName] = useState("");
  const selected = roles.find((item) => item.id === role) ?? roles[1];
  const canEnter = name.trim().length >= 2;

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-3" role="listbox" aria-label="Rol Passport">
        {roles.map((item) => (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={role === item.id}
            onClick={() => setRole(item.id)}
            className={`cell w-full p-5 text-left ${role === item.id ? "border-signal" : ""}`}
          >
            <p className="font-display text-xl">{item.label}</p>
            <p className="mt-2 text-sm leading-6 text-mist">{item.requirement}</p>
          </button>
        ))}
      </div>

      <div className="cell p-6 md:p-8">
        <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
          Kondax Passport · OAuth 2.0
        </p>
        <h2 className="font-display mt-4 text-3xl">
          Validación {selected.validation === "technical" ? "técnica" : "comercial"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-mist">{selected.requirement}</p>
        <p className="mt-4 rounded-2xl border border-line bg-ink-2 px-4 py-3 font-mono text-[11px] tracking-[0.14em] text-copper uppercase">
          Sello {selected.id} · {selected.providers.join(" / ")}
        </p>

        <label className="mt-6 block text-sm">
          <span className="text-mist">Nombre para la sesión</span>
          <input
            className="field mt-2"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Agustín Sáez"
            autoComplete="name"
            required
          />
        </label>

        <div className="mt-6 flex flex-wrap gap-2">
          {selected.providers.map((provider) => {
            const ready = oauth[provider as keyof typeof oauth];
            return (
              <form key={provider} action={startOauth}>
                <input type="hidden" name="provider" value={provider} />
                <input type="hidden" name="role" value={role} />
                <button
                  type="submit"
                  disabled={!ready}
                  className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-40"
                >
                  Continuar con {providerLabel[provider]}
                  {ready ? "" : " (configurar)"}
                </button>
              </form>
            );
          })}
        </div>

        <form action={enterPassport} className="mt-8 border-t border-line pt-6">
          <input type="hidden" name="role" value={role} />
          <input type="hidden" name="name" value={name.trim()} />
          <p className="text-sm text-mist">
            Sin claves OAuth, la consola abre en modo demostración. El rol y la
            validación quedan en la sesión.
          </p>
          <button
            type="submit"
            disabled={!canEnter}
            className="mt-4 rounded-full bg-signal px-5 py-2.5 text-sm font-medium text-signal-ink disabled:opacity-40"
          >
            Entrar a la consola
          </button>
        </form>
      </div>
    </div>
  );
}
