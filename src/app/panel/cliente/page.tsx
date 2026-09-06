import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat("es", { style: "currency", currency }).format(
    cents / 100
  );
}

export default async function ClientPanelPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const currentUserId = session.user.id as string;

  const orders = await prisma.order.findMany({
    where: { clientId: currentUserId, status: "PAID" },
    include: { beat: { include: { producer: { include: { user: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  const conversations = await prisma.conversationUser.findMany({
    where: { userId: currentUserId },
    include: {
      conversation: {
        include: { participants: { include: { user: true } } },
      },
    },
  });

  return (
    <div style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Mi panel</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Beats comprados</h2>
        {orders.length > 0 ? (
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                <Link href={`/beat/${order.beat.id}`}>{order.beat.title}</Link>
                {" — "}
                {order.beat.producer.user.name} —{" "}
                {formatPrice(order.amountCents, order.currency)}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "var(--text-muted)" }}>Todavía no compraste ningún beat.</p>
        )}
      </section>

      <section>
        <h2>Conversaciones</h2>
        {conversations.length > 0 ? (
          <ul>
            {conversations.map((cu) => {
              const other = cu.conversation.participants.find(
                (p) => p.userId !== currentUserId
              );
              return (
                <li key={cu.conversation.id}>
                  <Link href={`/mensajes/${cu.conversation.id}`}>
                    {other?.user.name ?? "Usuario"}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p style={{ color: "var(--text-muted)" }}>No tienes conversaciones activas.</p>
        )}
      </section>
    </div>
  );
}
