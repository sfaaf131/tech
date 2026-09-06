"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistroPage() {
  const router = useRouter();
  const [role, setRole] = useState<"PRODUCER" | "CLIENT">("CLIENT");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
      role,
      specialty: role === "PRODUCER" ? form.get("specialty") : undefined,
    };

    try {
      const res = await fetch("/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "No se pudo completar el registro.");
      }

      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Crear cuenta</h1>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button
          type="button"
          onClick={() => setRole("CLIENT")}
          className={`genre-chip ${role === "CLIENT" ? "active" : ""}`}
        >
          Soy Cliente
        </button>
        <button
          type="button"
          onClick={() => setRole("PRODUCER")}
          className={`genre-chip ${role === "PRODUCER" ? "active" : ""}`}
        >
          Soy Productor
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <input name="name" placeholder="Nombre" required />
        <input name="email" type="email" placeholder="Correo" required />
        <input name="password" type="password" placeholder="Contraseña" required minLength={8} />

        {role === "PRODUCER" && (
          <input
            name="specialty"
            placeholder="¿A qué te dedicas? Ej: Productor de Trap y Hip-Hop"
            required
          />
        )}

        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Registrarme"}
        </button>
      </form>
    </div>
  );
}
