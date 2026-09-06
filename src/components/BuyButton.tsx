"use client";

import { useState } from "react";

export function BuyButton({ beatId }: { beatId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beatId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "No se pudo iniciar el pago.");
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleBuy} disabled={loading}>
        {loading ? "Redirigiendo..." : "Comprar ahora"}
      </button>
      {error && <p style={{ color: "#ff6b6b", fontSize: "0.85rem" }}>{error}</p>}
    </div>
  );
}
