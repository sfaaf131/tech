import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <hr className="hairline" />
        <div className="footer-row" style={{ marginTop: "1.25rem" }}>
          <p>
            {site.author} · {site.city}
          </p>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
