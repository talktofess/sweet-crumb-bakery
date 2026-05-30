import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow">Small-batch · baked fresh daily</p>
          <h1 className="hero-title">
            The quiet luxury
            <br />
            of a perfect crumb.
          </h1>
          <p className="hero-lede">
            A handful of recipes, made properly. Cakes, pastries and bread baked
            the morning you receive them — ordered online for pickup or local
            delivery.
          </p>
          <div className="hero-actions">
            <Link href="#menu" className="btn btn-primary">
              Browse the menu
            </Link>
            <Link href="#story" className="btn btn-outline">
              Our story
            </Link>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="section" id="menu">
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">The menu</p>
            <h2 className="section-title">Today&rsquo;s table</h2>
          </header>
          <div className="grid">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section section-alt" id="story">
        <div className="container split">
          <div className="split-art" aria-hidden="true">
            <span>👩‍🍳</span>
          </div>
          <div className="split-copy">
            <p className="eyebrow">Our story</p>
            <h2 className="section-title">Patience, mostly.</h2>
            <p>
              Sweet Crumb began in 1998 with one oven and a stubborn family
              recipe. We still mix by feel, proof overnight, and refuse to rush a
              good crumb.
            </p>
            <p className="muted">
              No freezers, no shortcuts — just good ingredients and time.
            </p>
          </div>
        </div>
      </section>

      {/* Visit */}
      <section className="section" id="visit">
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">Visit</p>
            <h2 className="section-title">Come say hello</h2>
          </header>
          <div className="info-grid">
            <div className="info">
              <h3>Address</h3>
              <p>14 Maple Lane, Riverton, OR 97000</p>
            </div>
            <div className="info">
              <h3>Hours</h3>
              <p>Tue–Fri 7–6 · Sat–Sun 8–4 · Mon closed</p>
            </div>
            <div className="info">
              <h3>Contact</h3>
              <p>
                <a href="tel:+15035550148">(503) 555-0148</a>
                <br />
                <a href="mailto:hello@sweetcrumb.example">
                  hello@sweetcrumb.example
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
