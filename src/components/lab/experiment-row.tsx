import Link from "next/link";
import { statusLabel, type Experiment } from "@/lib/lab";

export function ExperimentRow({ item }: { item: Experiment }) {
  return (
    <Link className="row" href={`/lab/${item.slug}`}>
      <span className="num">{item.number}</span>
      <div>
        <p className="row-title">{item.title}</p>
        <p className="row-summary">{item.summary}</p>
      </div>
      <span className={`meta status-${item.status}`}>{statusLabel(item.status)}</span>
    </Link>
  );
}
