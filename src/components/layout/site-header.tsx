"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/cn";
import { nav, toolNav } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const inApp = pathname.startsWith("/app");
  const links = [...nav, ...toolNav, { href: "/modelo", label: "Modelo" }, { href: "/seguridad", label: "Seguridad" }, { href: "/contacto", label: "Contacto" }];

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" onClick={() => setOpen(false)} aria-label="Kondax.tech inicio">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-mist lg:flex" aria-label="Principal">
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
              className={cn(
                "text-sm transition-colors hover:text-paper",
                pathname === item.href ? "text-paper" : "text-mist",
              )}
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
          className="inline-flex size-10 items-center justify-center md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Menú</span>
          <span className="flex flex-col gap-1.5">
            <span className={cn("block h-px w-5 bg-paper transition", open && "translate-y-2 rotate-45")} />
            <span className={cn("block h-px w-5 bg-paper transition", open && "opacity-0")} />
            <span className={cn("block h-px w-4 bg-paper transition", open && "w-5 -translate-y-2 -rotate-45")} />
          </span>
        </button>
      </div>
      {open ? (
        <div className="border-t border-line bg-ink px-5 py-5 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Móvil">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-3 text-sm",
                  pathname === item.href ? "bg-ink-3 text-paper" : "text-mist",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/passport"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full bg-signal px-4 py-3 text-center text-sm font-medium text-signal-ink"
            >
              Kondax Passport
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
