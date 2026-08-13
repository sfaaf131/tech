import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Button({
  href,
  children,
  tone = "signal",
  type,
  disabled,
  className,
}: {
  href?: string;
  children: ReactNode;
  tone?: "signal" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-40",
    tone === "signal"
      ? "bg-signal text-signal-ink hover:bg-paper-2"
      : "border border-line bg-ink-2 text-paper hover:border-paper/30 hover:bg-ink",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}

export function Section({
  children,
  className,
  id,
  band = false,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  band?: boolean;
}) {
  if (band) {
    return (
      <section id={id} className={cn("scroll-mt-24 border-y border-line bg-ink-2", className)}>
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">{children}</div>
      </section>
    );
  }

  return (
    <section id={id} className={cn("mx-auto max-w-6xl scroll-mt-24 px-5 py-16 md:py-24", className)}>
      {children}
    </section>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.8125rem] font-medium tracking-[0.12em] text-copper uppercase">
      {children}
    </p>
  );
}

export function Card({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
}) {
  const classes = cn("cell p-6 md:p-8", className);

  if (href) {
    return (
      <Link href={href} className={cn(classes, "block")}>
        {children}
      </Link>
    );
  }

  return <article className={classes}>{children}</article>;
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
