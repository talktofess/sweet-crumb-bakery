import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card">
      <Link
        href={`/product/${product.slug}`}
        className="card-art"
        style={{ background: product.tone }}
        aria-label={product.name}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 860px) 100vw, 280px"
          className="card-img"
        />
      </Link>
      <div className="card-body">
        <p className="card-cat">{product.category}</p>
        <h3 className="card-title">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="card-blurb">{product.blurb}</p>
        <div className="card-foot">
          <span className="price">{formatPrice(product.price)}</span>
          <AddToCartButton id={product.id} label="Add" variant="outline" />
        </div>
      </div>
    </article>
  );
}
