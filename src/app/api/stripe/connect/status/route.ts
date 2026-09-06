import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const producerProfile = await prisma.producerProfile.findUnique({
    where: { userId: session.user.id as string },
  });

  if (!producerProfile?.stripeAccountId) {
    return NextResponse.json({ onboarded: false });
  }

  const account = await getStripe().accounts.retrieve(producerProfile.stripeAccountId);
  const onboarded = Boolean(account.details_submitted && account.charges_enabled);

  if (onboarded !== producerProfile.stripeOnboarded) {
    await prisma.producerProfile.update({
      where: { id: producerProfile.id },
      data: { stripeOnboarded: onboarded },
    });
  }

  return NextResponse.json({ onboarded });
}
