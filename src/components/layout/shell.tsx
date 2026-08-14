import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <hr className="hairline" />
      {children}
      <Footer />
    </>
  );
}
