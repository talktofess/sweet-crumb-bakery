"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/format";

export default function CartDrawer() {
  const { detailed, subtotal, setQty, remove, open, setOpen, count } = useCart();

  return (
    <>
      <div
        className="drawer-scrim"
        data-open={open}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        className="drawer"
        data-open={open}
        aria-label="Shopping cart"
        aria-hidden={!open}
      >
        <div className="drawer-head">
          <h2>Your order</h2>
          <button
            className="icon-btn"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {count === 0 ? (
          <div className="drawer-empty">
            <p>Your cart is empty.</p>
            <button className="btn btn-outline" onClick={() => setOpen(false)}>
              Keep browsing
            </button>
          </div>
        ) : (
          <>
            <ul className="drawer-items">
              {detailed.map(({ product, qty }) => (
                <li key={product.id} className="drawer-item">
                  <span
                    className="drawer-thumb"
                    style={{ background: product.tone }}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="52px"
                      className="thumb-img"
                    />
                  </span>
                  <div className="drawer-item-main">
                    <p className="drawer-item-name">{product.name}</p>
                    <p className="drawer-item-price">
                      {formatPrice(product.price)}
                    </p>
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
                  </div>
                  <button
                    className="link-btn"
                    onClick={() => remove(product.id)}
                    aria-label={`Remove ${product.name}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="drawer-foot">
              <div className="subtotal-row">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <Link
                href="/cart"
                className="btn btn-primary btn-block"
                onClick={() => setOpen(false)}
              >
                Review &amp; checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
