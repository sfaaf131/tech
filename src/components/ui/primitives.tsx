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
    "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-40",
    tone === "signal"
      ? "bg-signal text-signal-ink hover:bg-paper-2"
      : "border border-line bg-ink-2 text-paper hover:border-paper/30",
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
    <section id={id} className={cn("mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:py-24", className)}>
      {children}
    </section>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium tracking-[0.14em] text-copper uppercase">
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

export function Status({ children, tone = "muted" }: { children: ReactNode; tone?: "done" | "live" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        tone === "done" && "bg-ink-3 text-paper",
        tone === "live" && "bg-paper text-ink",
        tone === "muted" && "bg-ink-3 text-mist",
      )}
    >
      {children}
    </span>
  );
}
