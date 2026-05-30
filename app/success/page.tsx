import Link from "next/link";
import ClearCartOnMount from "@/components/ClearCartOnMount";
import { getOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Order confirmed — Sweet Crumb" };
export const dynamic = "force-dynamic";

// After a successful Stripe redirect we look the order up by session id. The
// order only exists here if the webhook recorded it (i.e. payment really
// completed) — so this confirms against the authoritative source, not the
// redirect alone.
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const order = sessionId ? await getOrder(sessionId) : undefined;

  return (
    <main className="container page">
      <div className="empty-state">
        <div className="success-mark">🎉</div>
        <h1>Thank you — your order is in!</h1>

        {order ? (
          <>
            <p className="muted">
              Confirmed{order.name ? `, ${order.name}` : ""}. We&rsquo;ve emailed
              your receipt{order.email ? ` to ${order.email}` : ""}.
            </p>
            <ul className="receipt">
              {order.items.map((it, i) => (
                <li key={i}>
                  <span>
                    {it.quantity} × {it.name}
                  </span>
                  <span>{formatPrice(it.amountTotal)}</span>
                </li>
              ))}
              <li className="receipt-total">
                <span>Total ({order.fulfilment})</span>
                <strong>{formatPrice(order.amountTotal)}</strong>
              </li>
            </ul>
          </>
        ) : (
          <p className="muted">
            Your payment is being confirmed. If you just paid, this page updates
            once our system receives the confirmation from Stripe.
          </p>
        )}

        <Link href="/" className="btn btn-primary">
          Back to the bakery
        </Link>
      </div>
      <ClearCartOnMount />
    </main>
  );
}
