"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { nav } from "@/lib/site";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [...nav, { href: "/acceso", label: "Entrar" }];
  const isCurrent = (href: string) => {
    const path = href.split("#")[0] || "/";
    if (href.includes("#")) return pathname === path;
    return pathname === href;
  };

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
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" onClick={() => setOpen(false)} aria-label="Kondax.tech inicio">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-mist md:flex" aria-label="Principal">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className={cn(
                "transition-colors hover:text-paper",
                isCurrent(item.href) && "font-medium text-paper",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/acceso"
            className={cn("text-sm hover:text-paper", pathname === "/acceso" ? "text-paper" : "text-mist")}
            aria-current={pathname === "/acceso" ? "page" : undefined}
          >
            Entrar
          </Link>
          <Button href="/enterprise#contacto">Pedir alcance</Button>
        </div>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="flex flex-col gap-1.5">
            <span className={cn("block h-px w-5 bg-paper transition", open && "translate-y-2 rotate-45")} />
            <span className={cn("block h-px w-5 bg-paper transition", open && "opacity-0")} />
            <span className={cn("block h-px w-4 bg-paper transition", open && "w-5 -translate-y-2 -rotate-45")} />
          </span>
        </button>
      </div>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 top-16 z-30 bg-paper/25 md:hidden"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />
          <div id="mobile-nav" className="relative z-40 border-t border-line bg-ink px-5 py-5 md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Móvil">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-3 text-sm",
                    isCurrent(item.href) ? "bg-ink-3 font-medium text-paper" : "text-mist",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/enterprise#contacto"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg bg-signal px-3 py-3 text-center text-sm font-medium text-signal-ink"
              >
                Pedir alcance
              </Link>
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}
