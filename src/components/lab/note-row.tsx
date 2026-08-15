import Link from "next/link";
import type { Note } from "@/lib/notes";
import { formatDate } from "@/lib/site";

export function NoteRow({
  item,
  heading: Title = "h2",
}: {
  item: Note;
  heading?: "h2" | "h3";
}) {
  return (
    <article className="row row-note">
      <div>
        <Title className="row-title">
          <Link href={`/notas/${item.slug}`}>{item.title}</Link>
        </Title>
        <p className="row-summary">{item.summary}</p>
      </div>
      <time className="meta" dateTime={item.date}>
        {formatDate(item.date)}
      </time>
    </article>
  );
}
