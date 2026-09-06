import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registroSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["PRODUCER", "CLIENT"]),
  specialty: z.string().min(2).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registroSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos. Revisa el formulario." },
      { status: 400 }
    );
  }

  const { name, email, password, role, specialty } = parsed.data;

  if (role === "PRODUCER" && !specialty) {
    return NextResponse.json(
      { error: "Los productores deben indicar a qué se dedican." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Ya existe una cuenta con ese correo." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      ...(role === "PRODUCER"
        ? { producerProfile: { create: { specialty } } }
        : {}),
    },
  });

  return NextResponse.json({ id: user.id, email: user.email, role: user.role });
}
