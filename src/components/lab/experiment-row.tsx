import Link from "next/link";
import { statusLabel, type Experiment } from "@/lib/lab";
import { formatDate } from "@/lib/site";

export function ExperimentRow({ item }: { item: Experiment }) {
  return (
    <article className="row">
      <div>
        <h3 className="row-title">
          <Link href={`/experimentos/${item.slug}`}>{item.title}</Link>
        </h3>
        <p className="row-summary">{item.summary}</p>
      </div>
      <p className="meta">
        <span className="status-mark" data-state={item.status} aria-hidden="true" />
        <span className="sr-only">Estado: </span>
        {statusLabel(item.status)}
        <span aria-hidden="true"> · </span>
        <time dateTime={item.opened}>{formatDate(item.opened)}</time>
      </p>
    </article>
  );
}
