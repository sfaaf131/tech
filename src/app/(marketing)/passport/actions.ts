"use server";

import { signIn } from "@/auth";
import { roles, type RoleId } from "@/lib/catalog";

function parseRole(value: FormDataEntryValue | null): RoleId {
  const candidate = String(value ?? "");
  return roles.some((role) => role.id === candidate)
    ? (candidate as RoleId)
    : "fundador";
}

export async function enterPassport(formData: FormData) {
  const role = parseRole(formData.get("role"));
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) return;
  await signIn("passport-demo", {
    role,
    name,
    redirectTo: "/app",
  });
}

export async function startOauth(formData: FormData) {
  const provider = String(formData.get("provider") ?? "");
  const allowed = ["github", "gitlab", "linkedin"];
  if (!allowed.includes(provider)) return;
  await signIn(provider, { redirectTo: "/app" });
}
