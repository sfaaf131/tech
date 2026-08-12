import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { footerNav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink-2">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-6 text-mist">{site.tagline}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-copper">
            TLS 1.3 · AES-256 · SOC 2 / ISO 27001 ready
          </p>
        </div>
        {Object.entries(footerNav).map(([group, links]) => (
          <div key={group}>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist">
              {group}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-paper/90 hover:text-signal">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-mist sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Kondax.tech. Todos los derechos reservados.</p>
          <p>SaaS · Fábrica por hora · Sweat equity</p>
        </div>
      </div>
    </footer>
  );
}
