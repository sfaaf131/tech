import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 32 32"
        className="size-8"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="9" fill="#d4ff3f" />
        <circle cx="10" cy="10" r="2.1" fill="#14180a" />
        <circle cx="22" cy="10" r="2.1" fill="#14180a" />
        <circle cx="16" cy="22" r="2.1" fill="#14180a" />
        <path
          d="M10 10h12M10 10l6 12M22 10l-6 12"
          stroke="#14180a"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-display text-[1.05rem] font-semibold tracking-tight">
        Kondax
        <span className="text-mist">.tech</span>
      </span>
    </span>
  );
}
