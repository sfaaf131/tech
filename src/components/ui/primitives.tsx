import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Button({
  href,
  children,
  tone = "signal",
  type,
  disabled,
}: {
  href?: string;
  children: ReactNode;
  tone?: "signal" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const className = cn(
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-40",
    tone === "signal"
      ? "bg-signal text-signal-ink hover:bg-paper"
      : "border border-line text-paper hover:border-signal hover:text-signal",
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} className={className} disabled={disabled}>
      {children}
    </button>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto max-w-6xl px-5 py-20", className)}>
      {children}
    </section>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-copper">
      {children}
    </p>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <article className={cn("cell p-6 md:p-8", className)}>{children}</article>;
}
