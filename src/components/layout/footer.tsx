import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-row">
        <p>
          {site.author}
          <br />
          {site.city}
        </p>
        <p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <br />
          Kursox es una agencia aparte.
        </p>
      </div>
    </footer>
  );
}
