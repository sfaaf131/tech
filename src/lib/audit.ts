import { createHash } from "node:crypto";

export type AuditEvent = {
  id: string;
  at: string;
  type: string;
  payload: unknown;
  prevHash: string;
  hash: string;
};

const GENESIS = "kondax-audit-genesis-v1";

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function sealEvent(
  type: string,
  payload: unknown,
  previousHash = GENESIS,
): AuditEvent {
  const at = new Date().toISOString();
  const body = JSON.stringify({ at, type, payload, previousHash });
  const hash = digest(body);
  return {
    id: hash.slice(0, 12),
    at,
    type,
    payload,
    prevHash: previousHash,
    hash,
  };
}

export function verifyChain(events: AuditEvent[], genesis = GENESIS) {
  let prev = genesis;
  for (const event of events) {
    const body = JSON.stringify({
      at: event.at,
      type: event.type,
      payload: event.payload,
      previousHash: event.prevHash,
    });
    if (event.prevHash !== prev) return false;
    if (digest(body) !== event.hash) return false;
    prev = event.hash;
  }
  return true;
}
