import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink-2">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.3fr_0.7fr_0.7fr_0.8fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-mist">{site.description}</p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-[0.14em] text-copper uppercase">Empresa</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/enterprise#servicios" className="text-mist hover:text-paper">
                Servicios
              </Link>
            </li>
            <li>
              <Link href="/enterprise" className="text-mist hover:text-paper">
                Enterprise
              </Link>
            </li>
            <li>
              <Link href="/startups" className="text-mist hover:text-paper">
                Venture
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium tracking-[0.14em] text-copper uppercase">Portal</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/acceso" className="text-mist hover:text-paper">
                Entrar
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-mist hover:text-paper">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium tracking-[0.14em] text-copper uppercase">Contacto</p>
          <p className="mt-4 text-sm">
            <a href={`mailto:${site.email}`} className="text-mist hover:text-paper">
              {site.email}
            </a>
          </p>
          <p className="mt-3 text-sm text-mist">Santiago, Chile</p>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-copper">
          © {new Date().getFullYear()} Kondax.tech · Factoría de software, IA y venture studio
        </p>
      </div>
    </footer>
  );
}
