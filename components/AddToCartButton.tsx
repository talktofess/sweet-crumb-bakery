"use client";

import { useCart } from "./CartContext";

export default function AddToCartButton({
  id,
  label = "Add to cart",
  variant = "primary",
}: {
  id: string;
  label?: string;
  variant?: "primary" | "outline";
}) {
  const { add } = useCart();
  return (
    <button
      className={variant === "primary" ? "btn btn-primary" : "btn btn-outline"}
      onClick={() => add(id)}
    >
      {label}
    </button>
  );
}
