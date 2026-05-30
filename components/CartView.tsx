"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/format";

export default function CartView() {
  const { detailed, subtotal, setQty, remove, count, lines } = useCart();
  const [fulfilment, setFulfilment] = useState<"Pickup" | "Delivery">("Pickup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, fulfilment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (count === 0) {
    return (
      <div className="empty-state">
        <h1>Your cart is empty</h1>
        <p className="muted">Find something sweet to fill it.</p>
        <Link href="/#menu" className="btn btn-primary">
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <section className="cart-lines">
        <h1>Your order</h1>
        <ul>
          {detailed.map(({ product, qty }) => (
            <li key={product.id} className="cart-row">
              <span
                className="cart-row-thumb"
                style={{ background: product.tone }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="64px"
                  className="thumb-img"
                />
              </span>
              <div className="cart-row-main">
                <p className="cart-row-name">{product.name}</p>
                <p className="muted">{product.blurb}</p>
                <button
                  className="link-btn"
                  onClick={() => remove(product.id)}
                >
                  Remove
                </button>
              </div>
              <div className="qty">
                <button
                  aria-label={`Decrease ${product.name}`}
                  onClick={() => setQty(product.id, qty - 1)}
                >
                  −
                </button>
                <span>{qty}</span>
                <button
                  aria-label={`Increase ${product.name}`}
                  onClick={() => setQty(product.id, qty + 1)}
                >
                  +
                </button>
              </div>
              <span className="cart-row-price">
                {formatPrice(product.price * qty)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <aside className="cart-summary">
        <h2>Summary</h2>
        <fieldset className="fulfilment">
          <legend>Fulfilment</legend>
          <label className="radio">
            <input
              type="radio"
              name="fulfilment"
              checked={fulfilment === "Pickup"}
              onChange={() => setFulfilment("Pickup")}
            />
            Pickup (ready in ~2 hours)
          </label>
          <label className="radio">
            <input
              type="radio"
              name="fulfilment"
              checked={fulfilment === "Delivery"}
              onChange={() => setFulfilment("Delivery")}
            />
            Local delivery
          </label>
        </fieldset>
        <div className="summary-row">
          <span>Subtotal</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <p className="muted small">
          Taxes &amp; delivery are calculated at checkout.
        </p>
        {error && <p className="error">{error}</p>}
        <button
          className="btn btn-primary btn-block"
          onClick={checkout}
          disabled={loading}
        >
          {loading ? "Starting checkout…" : "Checkout securely"}
        </button>
        <p className="muted small center">Payments handled by Stripe.</p>
        <Link href="/#menu" className="link-btn center-block">
          ← Continue shopping
        </Link>
      </aside>
    </div>
  );
}
