"use client";

import { useEffect, useState, useCallback } from "react";

type Message = {
  id: string;
  body: string;
  createdAt: string;
  sender: { id: string; name: string };
};

export function ChatBox({
  conversationId,
  currentUserId,
}: {
  conversationId: string;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const loadMessages = useCallback(async () => {
    const res = await fetch(`/api/mensajes/${conversationId}`);
    if (res.ok) {
      setMessages(await res.json());
    }
  }, [conversationId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    const res = await fetch(`/api/mensajes/${conversationId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: text }),
    });

    if (res.ok) {
      setText("");
      await loadMessages();
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "60vh" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
        <button type="button" onClick={loadMessages}>
          ↻ Actualizar
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {messages.map((msg) => {
          const isMine = msg.sender.id === currentUserId;
          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isMine ? "flex-end" : "flex-start",
                background: isMine ? "var(--accent)" : "var(--bg-card)",
                padding: "0.5rem 0.75rem",
                borderRadius: 12,
                maxWidth: "70%",
              }}
            >
              <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>{msg.sender.name}</div>
              <div>{msg.body}</div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <p style={{ color: "var(--text-muted)" }}>Todavía no hay mensajes.</p>
        )}
      </div>

      <form onSubmit={handleSend} style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={loading}>
          Enviar
        </button>
      </form>
    </div>
  );
}
