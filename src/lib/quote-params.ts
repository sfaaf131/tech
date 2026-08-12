import type { QuoteInput } from "@/lib/quote";
import type { AudienceId, ScopeId, ServiceId, TimelineId } from "@/lib/catalog";
import { audiences, scopes, services, timelines } from "@/lib/catalog";

const serviceIds = new Set<string>(services.map((item) => item.id));
const audienceIds = new Set<string>(audiences.map((item) => item.id));
const scopeIds = new Set<string>(scopes.map((item) => item.id));
const timelineIds = new Set<string>(timelines.map((item) => item.id));

export function parseQuoteParams(params: URLSearchParams): Partial<QuoteInput> {
  const audience = params.get("a");
  const scope = params.get("sc");
  const timeline = params.get("t");
  const selected = (params.get("s") ?? "")
    .split(",")
    .filter((id): id is ServiceId => serviceIds.has(id));

  return {
    audience: audienceIds.has(audience ?? "") ? (audience as AudienceId) : undefined,
    scope: scopeIds.has(scope ?? "") ? (scope as ScopeId) : undefined,
    timeline: timelineIds.has(timeline ?? "") ? (timeline as TimelineId) : undefined,
    serviceIds: selected.length ? selected : undefined,
    equity: params.has("e") ? params.get("e") === "1" : undefined,
  };
}

export function serializeQuoteParams(input: QuoteInput) {
  const params = new URLSearchParams();
  params.set("a", input.audience);
  params.set("s", input.serviceIds.join(","));
  params.set("sc", input.scope);
  params.set("t", input.timeline);
  params.set("e", input.equity ? "1" : "0");
  return params.toString();
}
