import Link from "next/link";
import type { Note } from "@/lib/notes";

export function NoteRow({ item }: { item: Note }) {
  return (
    <Link className="row" href={`/notas/${item.slug}`}>
      <span className="num" aria-hidden="true">
        ·
      </span>
      <div>
        <p className="row-title">{item.title}</p>
        <p className="row-summary">{item.summary}</p>
      </div>
      <time className="meta" dateTime={item.date}>
        {item.date}
      </time>
    </Link>
  );
}
