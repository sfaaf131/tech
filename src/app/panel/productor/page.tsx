import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ConnectStripeButton } from "@/components/ConnectStripeButton";
import { UploadBeatForm } from "@/components/UploadBeatForm";

export default async function ProducerPanelPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if ((session.user as { role?: string }).role !== "PRODUCER") {
    redirect("/");
  }

  const producerProfile = await prisma.producerProfile.findUnique({
    where: { userId: session.user.id as string },
    include: { beats: { orderBy: { createdAt: "desc" } } },
  });

  return (
    <div style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Panel de productor</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Pagos</h2>
        <ConnectStripeButton onboarded={producerProfile?.stripeOnboarded ?? false} />
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Subir nuevo beat</h2>
        <UploadBeatForm />
      </section>

      <section>
        <h2>Tus beats publicados</h2>
        {producerProfile?.beats.length ? (
          <ul>
            {producerProfile.beats.map((beat) => (
              <li key={beat.id}>
                {beat.title} — {beat.genre} — {beat.bpm} BPM
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "var(--text-muted)" }}>
            Todavía no publicaste ningún beat.
          </p>
        )}
      </section>
    </div>
  );
}
