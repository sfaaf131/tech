import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { leavePortal } from "@/app/(private)/actions";
import Link from "next/link";

export default async function PrivateLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/acceso");
  }

  const name = session.user.name ?? "Kondax";
  const portal = session.user.portal ?? "b2b";

  return (
    <div className="min-h-screen bg-ink md:flex">
      <Sidebar name={name} portal={portal} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-3 text-sm md:hidden">
          <span className="text-mist">{name}</span>
          <div className="flex gap-4">
            <Link href="/" className="text-mist">
              Sitio
            </Link>
            <form action={leavePortal}>
              <button type="submit" className="text-mist">
                Salir
              </button>
            </form>
          </div>
        </div>
        <div className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">{children}</div>
      </div>
    </div>
  );
}
