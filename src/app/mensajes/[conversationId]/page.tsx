import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChatBox } from "@/components/ChatBox";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { conversationId } = await params;
  const currentUserId = session.user.id as string;

  const participant = await prisma.conversationUser.findUnique({
    where: {
      conversationId_userId: { conversationId, userId: currentUserId },
    },
    include: {
      conversation: {
        include: { participants: { include: { user: true } } },
      },
    },
  });

  if (!participant) {
    redirect("/");
  }

  const otherParticipant = participant.conversation.participants.find(
    (p) => p.userId !== currentUserId
  );

  return (
    <div style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Chat con {otherParticipant?.user.name ?? "usuario"}</h1>
      <ChatBox conversationId={conversationId} currentUserId={currentUserId} />
    </div>
  );
}
