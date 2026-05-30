// The product catalog is the SERVER-SIDE source of truth. The checkout API
// looks prices up here by id — it never trusts a price sent by the browser, so
// a tampered cart can't change what Stripe charges.

export type Category = "Cakes" | "Pastries" | "Bread" | "Cookies";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  /** price in cents (avoid floating-point money) */
  price: number;
  blurb: string;
  description: string;
  /** emoji stand-in for product photography (drop real images in /public later) */
  emoji: string;
  /** subtle per-card gradient for the minimal/premium look */
  tone: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "victoria-sponge",
    slug: "victoria-sponge",
    name: "Victoria Sponge",
    category: "Cakes",
    price: 3200,
    blurb: "Vanilla sponge, raspberry, vanilla bean cream.",
    description:
      "Our founding recipe. Two layers of feather-light vanilla sponge with a seam of raspberry preserve and vanilla bean Chantilly, finished with a whisper of icing sugar.",
    emoji: "🎂",
    tone: "linear-gradient(135deg,#f6efe7,#efe2d2)",
  },
  {
    id: "dark-chocolate-torte",
    slug: "dark-chocolate-torte",
    name: "Dark Chocolate Torte",
    category: "Cakes",
    price: 3800,
    blurb: "70% single-origin ganache, flourless crumb.",
    description:
      "A dense, flourless torte built on 70% single-origin chocolate and finished with a mirror ganache. Naturally gluten-free and unapologetically rich.",
    emoji: "🍫",
    tone: "linear-gradient(135deg,#efe6dc,#e3d3c2)",
  },
  {
    id: "almond-croissant",
    slug: "almond-croissant",
    name: "Almond Croissant",
    category: "Pastries",
    price: 480,
    blurb: "Laminated 27 layers, frangipane, toasted almonds.",
    description:
      "Two days in the making: a 27-layer laminated croissant filled with house frangipane, baked twice, and showered in toasted almonds.",
    emoji: "🥐",
    tone: "linear-gradient(135deg,#f7f0e6,#f0e4d2)",
  },
  {
    id: "lemon-tart",
    slug: "lemon-tart",
    name: "Lemon Tart",
    category: "Pastries",
    price: 620,
    blurb: "Sablé shell, Amalfi lemon curd, torched.",
    description:
      "A crisp sablé shell holding silky Amalfi lemon curd, torched to a bruléed edge. Sharp, bright, and balanced.",
    emoji: "🍋",
    tone: "linear-gradient(135deg,#f8f3e3,#efe7cf)",
  },
  {
    id: "sourdough-loaf",
    slug: "sourdough-loaf",
    name: "Country Sourdough",
    category: "Bread",
    price: 850,
    blurb: "48-hour ferment, blistered crust, open crumb.",
    description:
      "A 48-hour naturally-leavened country loaf with a blistered, lacquered crust and a wildly open crumb. Just flour, water, salt, and time.",
    emoji: "🍞",
    tone: "linear-gradient(135deg,#f2e9dc,#e6d6c1)",
  },
  {
    id: "cinnamon-roll",
    slug: "cinnamon-roll",
    name: "Cardamom Bun",
    category: "Pastries",
    price: 520,
    blurb: "Swedish-style, cardamom sugar, pearl sugar.",
    description:
      "A Swedish-style knotted bun layered with freshly ground cardamom sugar and crowned with crunchy pearl sugar.",
    emoji: "🌀",
    tone: "linear-gradient(135deg,#f6eee2,#ece0cc)",
  },
  {
    id: "brown-butter-cookie",
    slug: "brown-butter-cookie",
    name: "Brown Butter Cookie",
    category: "Cookies",
    price: 380,
    blurb: "Brown butter, sea salt, chocolate puddles.",
    description:
      "Brown-butter dough rested 36 hours, studded with chopped dark chocolate and finished with flaky sea salt. Crisp edge, molten centre.",
    emoji: "🍪",
    tone: "linear-gradient(135deg,#f4ece0,#e9dcc8)",
  },
  {
    id: "pistachio-financier",
    slug: "pistachio-financier",
    name: "Pistachio Financier",
    category: "Cookies",
    price: 420,
    blurb: "Brown butter, Sicilian pistachio, gold.",
    description:
      "A petite brown-butter financier rich with Sicilian pistachio flour and a fleck of gold leaf. Moist, nutty, elegant.",
    emoji: "🟢",
    tone: "linear-gradient(135deg,#f1ece0,#e4dcc6)",
  },
];

export const CATEGORIES: Category[] = ["Cakes", "Pastries", "Bread", "Cookies"];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
