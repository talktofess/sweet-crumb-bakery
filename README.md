# Sweet Crumb Bakery

A minimal, premium bakery storefront — browse cakes, pastries and bread, add to
cart, and **pay for real with Stripe Checkout**. Built with Next.js (App Router)
+ TypeScript.

## Features
- Product catalog + per-product pages (statically generated)
- Persistent cart (React context + `localStorage`) with a slide-out drawer
- **Stripe Checkout** for real payments (cards, Apple/Google Pay via Stripe)
- Pickup / local-delivery fulfilment (delivery collects a shipping address)
- Server-trusted pricing: the checkout API recomputes every line price from the
  server-side catalog, so a tampered cart can't change what Stripe charges
- Responsive, accessible, no UI framework — hand-rolled CSS

## Tech
Next.js 16 · React 19 · TypeScript · Stripe · Google Fonts (Fraunces + Inter).
`npm audit` clean (0 vulnerabilities).

## Setup

```bash
cd sweet-crumb-bakery
npm install
cp .env.example .env.local      # then add your Stripe TEST keys
npm run dev                     # http://localhost:3000
```

Get test keys at <https://dashboard.stripe.com/test/apikeys>. In `.env.local`:

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=whsec_...   # from `stripe listen` (see Webhook section)
```

### Test a purchase
Add items → **Review & checkout** → **Checkout securely**. On Stripe's page use
test card `4242 4242 4242 4242`, any future expiry, any CVC/ZIP. You'll be
redirected back to `/success` and the cart clears.

## How payments work (the safe path)
1. The browser POSTs only `{ id, qty }[]` to `/api/checkout`.
2. The route looks each product up in `lib/products.ts`, builds Stripe line items
   with **server-side prices**, and creates a Checkout Session.
3. The browser is redirected to Stripe's hosted, PCI-compliant checkout — card
   details never touch this app.
4. Stripe redirects to `/success?session_id=...` on completion.
5. **Separately**, Stripe POSTs a `checkout.session.completed` **webhook** to
   `/api/webhook`. That call — not the redirect — is the authoritative proof of
   payment. The route verifies the Stripe **signature** against the raw body,
   then records the paid order (`lib/orders.ts`). The success page looks the
   order up by session id, so it only shows a confirmed receipt once the webhook
   has recorded it.

## Webhook: local testing
The webhook verifies a Stripe signature, so you can't just curl it. Use the
Stripe CLI to forward real events to your dev server:

```bash
# 1. install + log in:  https://stripe.com/docs/stripe-cli
stripe login
# 2. forward events (prints a whsec_... -> put it in .env.local as STRIPE_WEBHOOK_SECRET):
stripe listen --forward-to localhost:3000/api/webhook
# 3. complete a test checkout (card 4242…). The CLI shows the event delivered,
#    /success renders the itemized receipt, and .data/orders.json gets the order.
```

In production, create the endpoint in the Stripe Dashboard (Developers →
Webhooks → your-domain/api/webhook), subscribe to `checkout.session.completed`,
and copy its signing secret into `STRIPE_WEBHOOK_SECRET`.

> **Order storage:** the demo persists orders to `.data/orders.json` (gitignored)
> so the flow is self-contained. Swap `lib/orders.ts` for a real database in
> production — the `recordOrder`/`getOrder`/`listOrders` interface stays the same.
> `recordOrder` is idempotent on session id, so Stripe's webhook retries are safe.

## Project layout
```
app/
  layout.tsx            # fonts, cart provider, header, drawer, footer
  page.tsx              # home: hero + catalog + story + visit
  product/[slug]/       # product detail (generateStaticParams)
  cart/                 # cart review + checkout
  success/              # post-payment confirmation (reads the recorded order)
  api/checkout/route.ts # Stripe Checkout Session (server-trusted prices)
  api/webhook/route.ts  # Stripe webhook: verify signature -> record paid order
components/             # Header, ProductCard, CartContext, CartDrawer, CartView…
lib/                    # products (source of truth), stripe, format, orders
```

## Customizing
- **Products:** edit `lib/products.ts` (prices are in **cents**).
- **Real photos:** drop images in `public/` and swap the emoji/gradient art in
  `ProductCard` / product page for `next/image`.
- **Branding:** colors and type live as CSS variables at the top of
  `app/globals.css`.
