"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export default function Header() {
  const { count, setOpen } = useCart();
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="wordmark" aria-label="Sweet Crumb home">
          Sweet&nbsp;Crumb
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link href="/#menu">Menu</Link>
          <Link href="/#story">Story</Link>
          <Link href="/#visit">Visit</Link>
        </nav>
        <button
          className="cart-btn"
          onClick={() => setOpen(true)}
          aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
        >
          Cart
          <span className="cart-badge" data-empty={count === 0}>
            {count}
          </span>
        </button>
      </div>
    </header>
  );
}
