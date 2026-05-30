import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Sweet Crumb — Handcrafted Cakes & Bakes",
  description:
    "A small-batch bakery. Handcrafted cakes, pastries and breads, baked fresh and ordered online for pickup or local delivery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          {children}
          <CartDrawer />
          <footer className="footer">
            <div className="container footer-inner">
              <span className="wordmark">Sweet Crumb</span>
              <p className="muted">Baked fresh daily · Riverton, OR</p>
              <p className="muted small">
                Demo storefront. Use Stripe test card 4242 4242 4242 4242.
              </p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
