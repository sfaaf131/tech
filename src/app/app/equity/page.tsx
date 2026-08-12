const rows = [
  { project: "Ruta Norte", holder: "Fundador", share: "68%" },
  { project: "Ruta Norte", holder: "Kondax (sweat)", share: "18%" },
  { project: "Ruta Norte", holder: "Programador", share: "14%" },
  { project: "Nimbus Pay", holder: "Fundadores", share: "82%" },
  { project: "Nimbus Pay", holder: "Kondax (sweat)", share: "8%" },
  { project: "Nimbus Pay", holder: "Option pool", share: "10%" },
];

export default function EquityPage() {
  return (
    <div>
      <h1 className="font-display text-4xl">Sweat equity</h1>
      <p className="mt-3 max-w-2xl text-mist">
        Participación por co-creación. No sustituye la fábrica por hora: es la vía
        cuando Kondax construye como socio, no como proveedor.
      </p>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="font-mono text-[11px] tracking-[0.16em] text-copper uppercase">
            <tr>
              <th className="border-b border-line py-3">Proyecto</th>
              <th className="border-b border-line py-3">Titular</th>
              <th className="border-b border-line py-3">Share</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.project}-${row.holder}`}>
                <td className="border-b border-line py-3">{row.project}</td>
                <td className="border-b border-line py-3 text-mist">{row.holder}</td>
                <td className="border-b border-line py-3">{row.share}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
