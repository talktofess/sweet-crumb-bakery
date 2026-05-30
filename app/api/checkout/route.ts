import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProduct } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface IncomingLine {
  id: string;
  qty: number;
}

// Create a Stripe Checkout Session from the cart. Crucially, line prices are
// looked up from the server-side catalog by id — the browser only sends ids and
// quantities, so it cannot influence what Stripe charges.
export async function POST(req: Request) {
  let body: { lines?: IncomingLine[]; fulfilment?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const incoming = Array.isArray(body.lines) ? body.lines : [];
  const lineItems = [];
  for (const line of incoming) {
    const product = getProduct(String(line.id));
    const qty = Math.max(1, Math.min(99, Math.floor(Number(line.qty) || 0)));
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product: ${line.id}` },
        { status: 400 }
      );
    }
    lineItems.push({
      quantity: qty,
      price_data: {
        currency: "usd",
        unit_amount: product.price, // trusted server-side price (cents)
        product_data: {
          name: product.name,
          description: product.blurb,
        },
      },
    });
  }

  if (lineItems.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ??
    req.headers.get("origin") ??
    "http://localhost:3000";

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${base}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/cart`,
      shipping_address_collection:
        body.fulfilment === "Delivery"
          ? { allowed_countries: ["US"] }
          : undefined,
      phone_number_collection: { enabled: true },
      metadata: { fulfilment: body.fulfilment ?? "Pickup" },
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not start checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
