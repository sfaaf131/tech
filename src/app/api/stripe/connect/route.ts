import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const session = await auth();

  if (!session?.user || (session.user as { role?: string }).role !== "PRODUCER") {
    return NextResponse.json(
      { error: "Solo productores pueden conectar una cuenta de pagos." },
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

  let accountId = producerProfile.stripeAccountId;

  if (!accountId) {
    const account = await getStripe().accounts.create({
      type: "express",
      email: session.user.email ?? undefined,
      capabilities: {
        transfers: { requested: true },
        card_payments: { requested: true },
      },
    });
    accountId = account.id;

    await prisma.producerProfile.update({
      where: { id: producerProfile.id },
      data: { stripeAccountId: accountId },
    });
  }

  const accountLink = await getStripe().accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/panel/productor`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/panel/productor?conectado=true`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: accountLink.url });
}
