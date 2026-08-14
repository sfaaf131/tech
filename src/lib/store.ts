import type { CooperateInput } from "./schemas";

export function saveCooperation(input: CooperateInput) {
  void input;
  if (!process.env.DATABASE_URL) {
    return { stored: "pending" as const };
  }
  return { stored: "pending" as const };
}
