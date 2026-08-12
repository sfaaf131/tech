"use client";

import { useEffect, useRef, useState } from "react";
import { agents, grokModel, type AgentId } from "@/lib/agents";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function AgentStudio() {
  const [agentId, setAgentId] = useState<AgentId>("cofundador");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState<boolean | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const agent = agents.find((item) => item.id === agentId) ?? agents[0];

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/agentes")
      .then((response) => response.json() as Promise<{ ready?: boolean }>)
      .then((payload) => {
        if (!cancelled) setReady(Boolean(payload.ready));
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });
    return () => {
      cancelled = true;
      abortRef.current?.abort();
    };
  }, []);

  async function send(content: string) {
    const text = content.trim();
    if (!text || busy) return;
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;

    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setDraft("");
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/agentes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ agent: agentId, messages: next }),
        signal: abort.signal,
      });

      if (!response.ok || !response.body) {
        const payload = (await response.json().catch(() => null)) as
          | { message?: string; error?: string }
          | null;
        const fallback =
          response.status === 503
            ? "Falta XAI_API_KEY en Vercel para Grok 4.6."
            : response.status === 429
              ? "Demasiadas consultas. Espera unos minutos."
              : "El agente no pudo responder. Inténtalo de nuevo.";
        setError(payload?.message ?? fallback);
        if (response.status === 503) setReady(false);
        setBusy(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      setMessages([...next, { role: "assistant", content: "" }]);
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n");
        buffer = chunks.pop() ?? "";
        for (const line of chunks) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const data = trimmed.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data) as {
              choices?: { delta?: { content?: string } }[];
            };
            const piece = json.choices?.[0]?.delta?.content ?? "";
            if (!piece) continue;
            assistant += piece;
            setMessages([...next, { role: "assistant", content: assistant }]);
          } catch {
            /* ignore malformed sse */
          }
        }
      }
    } catch (caught) {
      if ((caught as { name?: string }).name !== "AbortError") {
        setError("No hay conexión con el agente. Revisa la red e inténtalo otra vez.");
      }
    } finally {
      setBusy(false);
    }
  }

  function switchAgent(id: AgentId) {
    abortRef.current?.abort();
    setAgentId(id);
    setMessages([]);
    setError(null);
    setBusy(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-2">
        {agents.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => switchAgent(item.id)}
            className={`cell w-full p-4 text-left ${agentId === item.id ? "border-signal" : ""}`}
          >
            <p className="font-display text-lg">{item.name}</p>
            <p className="mt-1 text-xs leading-5 text-mist">{item.blurb}</p>
          </button>
        ))}
        <p className="px-1 pt-3 font-mono text-[11px] tracking-[0.16em] text-copper uppercase">
          Motor {grokModel}
        </p>
      </aside>

      <div className="cell flex min-h-[520px] flex-col p-4 md:p-6">
        {ready === false ? (
          <p className="mb-4 rounded-2xl border border-line bg-ink-3 px-4 py-3 text-sm leading-6 text-mist">
            Grok 4.6 está listo en código. Falta <span className="text-paper">XAI_API_KEY</span> en
            Vercel para que los agentes respondan.
          </p>
        ) : null}
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.length === 0 ? (
            <div>
              <p className="font-display text-2xl">{agent.name}</p>
              <p className="mt-2 text-sm leading-6 text-mist">{agent.blurb}</p>
              <div className="mt-6 flex flex-col gap-2">
                {agent.starters.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => send(starter)}
                    className="rounded-2xl border border-line px-4 py-3 text-left text-sm hover:border-signal"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <article
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "ml-8 rounded-2xl bg-ink-3 px-4 py-3 text-sm leading-6"
                    : "mr-4 whitespace-pre-wrap text-sm leading-6 text-paper/90"
                }
              >
                {message.content || (busy ? "…" : "")}
              </article>
            ))
          )}
          {error ? <p className="text-sm text-danger">{error}</p> : null}
        </div>

        <form
          className="mt-4 flex gap-2 border-t border-line pt-4"
          onSubmit={(event) => {
            event.preventDefault();
            void send(draft);
          }}
        >
          <label className="sr-only" htmlFor="agent-draft">
            Mensaje
          </label>
          <input
            id="agent-draft"
            className="field"
            value={draft}
            disabled={busy}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={`Escribe al ${agent.name.toLowerCase()}…`}
          />
          <button
            type="submit"
            disabled={busy || !draft.trim()}
            className="rounded-full bg-signal px-4 py-2 text-sm font-medium text-signal-ink disabled:opacity-40"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
