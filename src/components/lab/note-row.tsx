import Link from "next/link";
import type { Note } from "@/lib/notes";
import { formatDate } from "@/lib/site";

export function NoteRow({ item }: { item: Note }) {
  return (
    <article className="row">
      <div>
        <h3 className="row-title">
          <Link href={`/notas/${item.slug}`}>{item.title}</Link>
        </h3>
        <p className="row-summary">{item.summary}</p>
      </div>
      <time className="meta" dateTime={item.date}>
        {formatDate(item.date)}
      </time>
    </article>
  );
}
