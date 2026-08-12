"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const links = [
  { href: "/app", label: "Resumen" },
  { href: "/app/proyectos", label: "Proyectos" },
  { href: "/app/celulas", label: "Células" },
  { href: "/app/marketplace", label: "Marketplace" },
  { href: "/app/equity", label: "Equity" },
  { href: "/app/auditoria", label: "Auditoría" },
];

export function AppNav() {
  const pathname = usePathname();
  return (
    <nav className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-5 pb-3 text-sm">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "whitespace-nowrap text-mist hover:text-paper",
            pathname === link.href && "text-signal",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
