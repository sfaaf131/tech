import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function PageHero({
  kicker,
  title,
  description,
  actions,
}: {
  kicker: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <section className="grid-bg grain relative overflow-hidden border-b border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <p className="rise font-mono text-[11px] uppercase tracking-[0.22em] text-copper">
          {kicker}
        </p>
        <h1 className="rise-2 font-display mt-5 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight md:text-6xl">
          {title}
        </h1>
        <p className="rise-3 mt-6 max-w-2xl text-lg leading-8 text-mist">{description}</p>
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}

export function ButtonLink({
  href,
  children,
  tone = "signal",
}: {
  href: string;
  children: ReactNode;
  tone?: "signal" | "ghost";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
        tone === "signal"
          ? "bg-signal text-signal-ink hover:bg-paper"
          : "border border-line text-paper hover:border-signal hover:text-signal",
      )}
    >
      {children}
    </Link>
  );
}

export function Section({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto max-w-6xl px-5 py-20", className)}>
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
