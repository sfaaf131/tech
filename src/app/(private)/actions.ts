"use server";

import { signIn, signOut } from "@/auth";
import { safePortalPath } from "@/lib/portfolio";

export async function enterPortal(formData: FormData) {
  await signIn("portal", {
    name: formData.get("name"),
    portal: formData.get("portal"),
    redirectTo: safePortalPath(formData.get("next")),
  });
}

export async function leavePortal() {
  await signOut({ redirectTo: "/" });
}
