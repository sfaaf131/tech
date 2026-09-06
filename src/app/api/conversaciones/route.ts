import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Crea una conversación entre el usuario actual y otro usuario (si no existe ya).
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { otherUserId } = await request.json();
  const currentUserId = session.user.id as string;

  if (otherUserId === currentUserId) {
    return NextResponse.json(
      { error: "No puedes iniciar una conversación contigo mismo." },
      { status: 400 }
    );
  }

  const existing = await prisma.conversation.findFirst({
    where: {
      participants: { some: { userId: currentUserId } },
      AND: { participants: { some: { userId: otherUserId } } },
    },
  });

  if (existing) {
    return NextResponse.json({ id: existing.id });
  }

  const conversation = await prisma.conversation.create({
    data: {
      participants: {
        create: [{ userId: currentUserId }, { userId: otherUserId }],
      },
    },
  });

  return NextResponse.json({ id: conversation.id });
}
