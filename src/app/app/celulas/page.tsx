const cells = [
  {
    name: "Célula Atlas",
    seats: "Lead, 2 ingeniería, QA",
    focus: "Producto web y e-commerce",
  },
  {
    name: "Célula Nimbus",
    seats: "Lead, ML, ingeniería",
    focus: "Agentes autónomos y RPA",
  },
  {
    name: "Célula Bastión",
    seats: "Lead, ingeniería, cumplimiento",
    focus: "Riesgo, KYC y Open Banking",
  },
];

export default function CelulasPage() {
  return (
    <div>
      <h1 className="font-display text-4xl">Células</h1>
      <p className="mt-3 max-w-2xl text-mist">
        Unidades estables de ingeniería. No se arman por ticket: se asignan a un
        dominio y acumulan contexto.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cells.map((cell) => (
          <article key={cell.name} className="cell p-6">
            <h2 className="font-display text-2xl">{cell.name}</h2>
            <p className="mt-3 text-sm text-signal">{cell.seats}</p>
            <p className="mt-2 text-sm text-mist">{cell.focus}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
