import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { recordOrder, type OrderItem } from "@/lib/orders";

// Stripe webhook. THIS — not the success redirect — is the authoritative signal
// that payment completed. We verify the signature against the raw body, then
// persist the paid order so fulfilment can proceed.
//
// Local testing:
//   stripe listen --forward-to localhost:3000/api/webhook
//   (copy the printed whsec_... into STRIPE_WEBHOOK_SECRET in .env.local)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not set" },
      { status: 500 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Raw body is required for signature verification — do not parse as JSON first.
  const payload = await req.text();

  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json(
      { error: `Webhook verification failed: ${message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
      });
      const items: OrderItem[] = lineItems.data.map((li) => ({
        name: li.description ?? "Item",
        quantity: li.quantity ?? 1,
        amountTotal: li.amount_total ?? 0,
      }));

      await recordOrder({
        id: session.id,
        createdAt: new Date().toISOString(),
        email: session.customer_details?.email ?? null,
        name: session.customer_details?.name ?? null,
        amountTotal: session.amount_total ?? 0,
        currency: session.currency ?? "usd",
        fulfilment: (session.metadata?.fulfilment as string) ?? "Pickup",
        paymentStatus: session.payment_status ?? "unknown",
        items,
      });
    } catch (err) {
      // Returning 500 makes Stripe retry — good, since the order isn't recorded.
      const message = err instanceof Error ? err.message : "record failed";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  // Acknowledge all other event types so Stripe stops retrying them.
  return NextResponse.json({ received: true });
}
