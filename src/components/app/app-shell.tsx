import Link from "next/link";
import { leavePassport } from "@/app/app/actions";
import { AppNav } from "@/components/app/app-nav";
import { Logo } from "@/components/brand/logo";
import type { ReactNode } from "react";

export function AppShell({
  children,
  name,
  role,
  validation,
}: {
  children: ReactNode;
  name: string;
  role: string;
  validation: string;
}) {
  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/app">
            <Logo />
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-mist sm:inline">
              {name} · {role} · {validation}
            </span>
            <Link href="/" className="text-mist hover:text-paper">
              Sitio
            </Link>
            <form action={leavePassport}>
              <button type="submit" className="text-mist hover:text-paper">
                Salir
              </button>
            </form>
          </div>
        </div>
        <AppNav />
      </header>
      <div className="mx-auto max-w-6xl px-5 py-10">{children}</div>
    </div>
  );
}
