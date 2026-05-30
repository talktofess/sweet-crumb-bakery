"use client";

import { useEffect } from "react";
import { useCart } from "./CartContext";

// Tiny client helper: empties the cart once the success page mounts.
export default function ClearCartOnMount() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
