import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/auth";
import { AppShell } from "@/components/app/app-shell";

export default async function PrivateLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/passport");

  return (
    <AppShell
      name={session.user.name ?? "Passport"}
      role={session.user.role ?? "fundador"}
      validation={session.user.validation ?? "pending"}
    >
      {children}
    </AppShell>
  );
}
