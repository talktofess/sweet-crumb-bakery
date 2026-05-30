import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";

// Pre-render a static page per product.
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return {
    title: product ? `${product.name} — Sweet Crumb` : "Sweet Crumb",
    description: product?.blurb,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="container product-page">
      <Link href="/#menu" className="link-btn">
        ← Back to menu
      </Link>
      <div className="product-detail">
        <div className="product-art" style={{ background: product.tone }}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 860px) 100vw, 540px"
            className="product-img"
            priority
          />
        </div>
        <div className="product-info">
          <p className="card-cat">{product.category}</p>
          <h1 className="product-name">{product.name}</h1>
          <p className="price product-price">{formatPrice(product.price)}</p>
          <p className="product-desc">{product.description}</p>
          <AddToCartButton id={product.id} label="Add to cart" />
        </div>
      </div>
    </main>
  );
}
