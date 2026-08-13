"use server";

import { signIn, signOut } from "@/auth";

export async function enterPortal(formData: FormData) {
  const raw = String(formData.get("next") ?? "/dashboard");
  const redirectTo = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";
  await signIn("portal", {
    name: formData.get("name"),
    portal: formData.get("portal"),
    redirectTo,
  });
}

export async function leavePortal() {
  await signOut({ redirectTo: "/" });
}
