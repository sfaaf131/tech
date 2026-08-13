"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { leavePortal } from "@/app/(private)/actions";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Resumen" },
  { href: "/proyectos", label: "Proyectos" },
];

export function Sidebar({ name, portal }: { name: string; portal: string }) {
  const pathname = usePathname();
  return (
    <aside className="border-b border-line bg-ink-2 md:flex md:min-h-screen md:w-64 md:flex-col md:border-r md:border-b-0">
      <div className="flex items-center justify-between px-5 py-4 md:block">
        <Link href="/dashboard" aria-label="Portal Kondax">
          <Logo />
        </Link>
        <p className="hidden text-xs font-medium tracking-[0.14em] text-copper uppercase md:mt-6 md:block">
          {portal === "startup" ? "Vista socio" : "Vista cliente B2B"}
        </p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:px-3" aria-label="Portal">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm whitespace-nowrap",
              pathname === item.href ? "bg-ink-3 text-paper" : "text-mist hover:text-paper",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="hidden border-t border-line px-5 py-5 text-sm md:block">
        <p className="font-medium">{name}</p>
        <div className="mt-4 flex flex-col gap-2">
          <Link href="/" className="text-mist hover:text-paper">
            Sitio público
          </Link>
          <form action={leavePortal}>
            <button type="submit" className="text-mist hover:text-paper">
              Salir
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
