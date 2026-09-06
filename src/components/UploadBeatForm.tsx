"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GENRES } from "@/lib/genres";

type StemInput = { label: string; file: File | null };

export function UploadBeatForm() {
  const router = useRouter();
  const [stems, setStems] = useState<StemInput[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function addStem() {
    setStems((prev) => [...prev, { label: "", file: null }]);
  }

  function updateStemLabel(index: number, label: string) {
    setStems((prev) => prev.map((s, i) => (i === index ? { ...s, label } : s)));
  }

  function updateStemFile(index: number, file: File | null) {
    setStems((prev) => prev.map((s, i) => (i === index ? { ...s, file } : s)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    stems.forEach((stem) => {
      if (stem.file) {
        form.append("stemFiles", stem.file);
        form.append("stemLabels", stem.label || stem.file.name);
      }
    });

    try {
      const res = await fetch("/api/beats", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "No se pudo subir el beat.");
      }

      router.push(`/beat/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <input name="title" placeholder="Título del beat" required />

      <select name="genre" required defaultValue="">
        <option value="" disabled>
          Selecciona un género
        </option>
        {GENRES.map((g) => (
          <option key={g.value} value={g.value}>
            {g.label}
          </option>
        ))}
      </select>

      <input name="bpm" type="number" placeholder="BPM" required min={1} />
      <input name="key" placeholder="Tonalidad (ej: A minor)" required />
      <input name="priceCents" type="number" placeholder="Precio en centavos (ej: 1500 = $15.00)" required min={1} />

      <label>
        Preview (20-50s, con marca de agua)
        <input name="previewFile" type="file" accept="audio/*" required />
      </label>

      <label>
        Pista completa
        <input name="fullFile" type="file" accept="audio/*" required />
      </label>

      <div>
        <p>Stems (opcional)</p>
        {stems.map((stem, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input
              placeholder="Ej: Drums"
              value={stem.label}
              onChange={(e) => updateStemLabel(i, e.target.value)}
            />
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => updateStemFile(i, e.target.files?.[0] ?? null)}
            />
          </div>
        ))}
        <button type="button" onClick={addStem}>
          + Agregar stem
        </button>
      </div>

      {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Subiendo..." : "Publicar beat"}
      </button>
    </form>
  );
}
