"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function ConnectStripeButton({ onboarded }: { onboarded: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Al volver del onboarding de Stripe (?conectado=true) revalida el estado real
  // y refresca la página para que se muestre "conectado".
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("conectado") === "true") {
      fetch("/api/stripe/connect/status", { method: "POST" }).finally(() => {
        router.refresh();
      });
    }
  }, [router]);

  async function handleConnect() {
    setLoading(true);
    const res = await fetch("/api/stripe/connect", { method: "POST" });
    const data = await res.json();
    setLoading(false);

    if (data.url) {
      window.location.href = data.url;
    }
  }

  if (onboarded) {
    return <p style={{ color: "#4ade80" }}>✓ Cuenta de pagos conectada</p>;
  }

  return (
    <button onClick={handleConnect} disabled={loading}>
      {loading ? "Conectando..." : "Conectar cuenta para recibir pagos"}
    </button>
  );
}
