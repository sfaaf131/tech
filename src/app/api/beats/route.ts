import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GENRES } from "@/lib/genres";

// Validación de los campos de texto/numéricos del formulario de subida.
const genreValues = GENRES.map((g) => g.value) as [string, ...string[]];
const beatFieldsSchema = z.object({
  title: z.string().min(1, "El título es obligatorio."),
  genre: z.enum(genreValues),
  bpm: z.coerce.number().int().positive("El BPM debe ser un número positivo."),
  key: z.string().min(1, "La tonalidad es obligatoria."),
  priceCents: z.coerce
    .number()
    .int()
    .positive("El precio debe ser un número positivo en centavos."),
});

// Guarda archivos en `public/uploads`, que Next.js sirve estáticamente en /uploads/...
// Esto permite reproducir el audio en local sin almacenamiento externo.
// TODO: migrar a Vercel Blob (u otro almacenamiento externo) antes de
// desplegar a producción — Vercel no persiste el filesystem entre despliegues.
const UPLOADS_DIR = path.join("public", "uploads");

async function saveFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  // Sanitiza el nombre para evitar path traversal o caracteres problemáticos.
  const safeName = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${randomUUID()}-${safeName}`;
  const dir = path.join(process.cwd(), UPLOADS_DIR);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || (session.user as { role?: string }).role !== "PRODUCER") {
    return NextResponse.json(
      { error: "Solo productores pueden subir beats." },
      { status: 403 }
    );
  }

  const producerProfile = await prisma.producerProfile.findUnique({
    where: { userId: session.user.id as string },
  });

  if (!producerProfile) {
    return NextResponse.json(
      { error: "Perfil de productor no encontrado." },
      { status: 404 }
    );
  }

  const formData = await request.formData();

  const parsed = beatFieldsSchema.safeParse({
    title: formData.get("title"),
    genre: formData.get("genre"),
    bpm: formData.get("bpm"),
    key: formData.get("key"),
    priceCents: formData.get("priceCents"),
  });

  const previewFile = formData.get("previewFile") as File | null;
  const fullFile = formData.get("fullFile") as File | null;
  const stemFiles = formData.getAll("stemFiles") as File[];
  const stemLabels = formData.getAll("stemLabels") as string[];

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos del beat inválidos." },
      { status: 400 }
    );
  }

  if (!previewFile || !fullFile) {
    return NextResponse.json(
      { error: "Faltan los archivos de audio: preview y pista completa." },
      { status: 400 }
    );
  }

  const { title, genre, bpm, key, priceCents } = parsed.data;

  const previewFileUrl = await saveFile(previewFile);
  const fullFileUrl = await saveFile(fullFile);

  const beat = await prisma.beat.create({
    data: {
      producerId: producerProfile.id,
      title,
      genre: genre as never,
      bpm,
      key,
      priceCents,
      previewFileUrl,
      fullFileUrl,
      stems: {
        create: await Promise.all(
          stemFiles.map(async (file, i) => ({
            label: stemLabels[i] ?? file.name,
            fileUrl: await saveFile(file),
          }))
        ),
      },
    },
  });

  return NextResponse.json({ id: beat.id });
}
