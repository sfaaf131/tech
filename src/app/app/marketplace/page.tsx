const people = [
  { name: "Camila R.", role: "Fundadora", stamp: "LinkedIn", looking: "CTO técnico" },
  { name: "Diego M.", role: "Programador", stamp: "GitHub", looking: "Equity en fintech" },
  { name: "Sofía L.", role: "Inversora", stamp: "LinkedIn", looking: "Pre-semilla B2B" },
];

export default function MarketplacePage() {
  return (
    <div>
      <h1 className="font-display text-4xl">Marketplace de socios</h1>
      <p className="mt-3 max-w-2xl text-mist">
        Solo identidades con Passport. La validación técnica o comercial aparece como
        sello, no como un badge decorativo.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {people.map((person) => (
          <article key={person.name} className="cell p-6">
            <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
              {person.stamp}
            </p>
            <h2 className="font-display mt-3 text-2xl">{person.name}</h2>
            <p className="mt-1 text-sm text-mist">{person.role}</p>
            <p className="mt-4 text-sm">{person.looking}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
