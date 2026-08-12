import { sealEvent, verifyChain } from "@/lib/audit";

export default function AuditoriaPage() {
  const events = [
    sealEvent("passport.login", { role: "fundador", provider: "demo" }),
  ];
  events.push(sealEvent("quote.sealed", { hours: 412 }, events[0].hash));
  events.push(sealEvent("cell.assigned", { cell: "Atlas" }, events[1].hash));
  const intact = verifyChain(events);

  return (
    <div>
      <h1 className="font-display text-4xl">Auditoría inmutable</h1>
      <p className="mt-3 max-w-2xl text-mist">
        Cadena SHA-256. Cada evento apunta al hash anterior. Si alguien altera un
        payload, la verificación falla.
      </p>
      <p className={`mt-4 font-mono text-sm ${intact ? "text-signal" : "text-danger"}`}>
        Cadena {intact ? "íntegra" : "rota"}
      </p>
      <ol className="mt-8 space-y-4">
        {events.map((event) => (
          <li key={event.id} className="cell p-5">
            <p className="font-mono text-[11px] text-copper">{event.at}</p>
            <p className="mt-2">{event.type}</p>
            <p className="mt-2 break-all font-mono text-[11px] text-mist">
              {event.hash}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
