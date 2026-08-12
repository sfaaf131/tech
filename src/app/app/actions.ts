"use server";

import { signOut } from "@/auth";

export async function leavePassport() {
  await signOut({ redirectTo: "/" });
}
