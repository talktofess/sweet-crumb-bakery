import Stripe from "stripe";

// Lazily construct the Stripe client so importing this module (e.g. during
// `next build`) never throws when the key is absent. The key is only required
// when the checkout route actually runs.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Copy .env.example to .env.local and add your Stripe keys."
    );
  }
  if (!_stripe) {
    _stripe = new Stripe(key, { apiVersion: "2024-06-20" });
  }
  return _stripe;
}
