import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function assertParticipant(conversationId: string, userId: string) {
  const participant = await prisma.conversationUser.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  return Boolean(participant);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { conversationId } = await params;
  const isParticipant = await assertParticipant(conversationId, session.user.id as string);
  if (!isParticipant) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: { sender: true },
  });

  return NextResponse.json(messages);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { conversationId } = await params;
  const isParticipant = await assertParticipant(conversationId, session.user.id as string);
  if (!isParticipant) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const { body } = await request.json();
  if (!body || typeof body !== "string" || body.trim().length === 0) {
    return NextResponse.json({ error: "El mensaje no puede estar vacío." }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: session.user.id as string,
      body: body.trim(),
    },
    include: { sender: true },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json(message);
}
