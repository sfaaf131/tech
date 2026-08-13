import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="band border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-mist">{site.description}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">Público</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/enterprise" className="text-mist hover:text-paper">
                Factoría Enterprise
              </Link>
            </li>
            <li>
              <Link href="/startups" className="text-mist hover:text-paper">
                Venture Building
              </Link>
            </li>
            <li>
              <Link href="/acceso" className="text-mist hover:text-paper">
                Portal privado
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">Contacto</p>
          <p className="mt-4 text-sm text-mist">
            <a href={`mailto:${site.email}`} className="hover:text-paper">
              {site.email}
            </a>
          </p>
          <p className="mt-3 text-sm text-mist">B2B por hora, sprint o proyecto. Startups por sweat equity.</p>
        </div>
      </div>
    </footer>
  );
}
