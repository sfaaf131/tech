"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/cn";
import { nav, toolNav } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const inApp = pathname.startsWith("/app");

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" onClick={() => setOpen(false)} aria-label="Kondax.tech">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-mist md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-paper",
                pathname === item.href && "text-paper",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {toolNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-mist transition-colors hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={inApp ? "/app" : "/passport"}
            className="rounded-full bg-signal px-4 py-2 text-sm font-medium text-signal-ink"
          >
            {inApp ? "Consola" : "Passport"}
          </Link>
        </div>
        <button
          type="button"
          className="md:hidden"
          aria-label="Abrir menú"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="block h-px w-6 bg-paper" />
          <span className="mt-1.5 block h-px w-4 bg-paper" />
        </button>
      </div>
      {open ? (
        <div className="border-t border-line bg-ink px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            {[...nav, ...toolNav, { href: "/modelo", label: "Modelo" }, { href: "/seguridad", label: "Seguridad" }].map(
              (item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ),
            )}
            <Link
              href="/passport"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-signal px-4 py-2 text-center text-signal-ink"
            >
              Kondax Passport
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
