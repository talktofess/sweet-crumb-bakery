import CartView from "@/components/CartView";

export const metadata = { title: "Your order — Sweet Crumb" };

export default function CartPage() {
  return (
    <main className="container page">
      <CartView />
    </main>
  );
}
