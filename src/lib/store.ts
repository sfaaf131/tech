import type { CooperateInput } from "./schemas";

export function saveCooperation(input: CooperateInput) {
  void input;
  return { stored: "pending" as const };
}
