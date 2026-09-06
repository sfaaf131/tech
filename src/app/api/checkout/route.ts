import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, calculatePlatformFeeCents } from "@/lib/stripe";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Debes iniciar sesión para comprar." },
      { status: 401 }
    );
  }

  const { beatId } = await request.json();

  const beat = await prisma.beat.findUnique({
    where: { id: beatId },
    include: { producer: true },
  });

  if (!beat) {
    return NextResponse.json({ error: "Beat no encontrado." }, { status: 404 });
  }

  if (!beat.producer.stripeAccountId || !beat.producer.stripeOnboarded) {
    return NextResponse.json(
      { error: "El productor todavía no configuró su cuenta de pagos." },
      { status: 400 }
    );
  }

  const order = await prisma.order.create({
    data: {
      beatId: beat.id,
      clientId: session.user.id as string,
      amountCents: beat.priceCents,
      currency: beat.priceCurrency,
      status: "PENDING",
    },
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: beat.priceCurrency.toLowerCase(),
          product_data: { name: beat.title },
          unit_amount: beat.priceCents,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: calculatePlatformFeeCents(beat.priceCents),
      transfer_data: {
        destination: beat.producer.stripeAccountId,
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/beat/${beat.id}?compra=exitosa`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/beat/${beat.id}?compra=cancelada`,
    metadata: { orderId: order.id },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripePaymentIntentId: checkoutSession.payment_intent as string },
  });

  return NextResponse.json({ checkoutUrl: checkoutSession.url });
}
