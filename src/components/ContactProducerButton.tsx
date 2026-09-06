"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ContactProducerButton({ producerUserId }: { producerUserId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/conversaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otherUserId: producerUserId }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push(`/mensajes/${data.id}`);
    }
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? "Abriendo chat..." : "Hablar con el productor"}
    </button>
  );
}
