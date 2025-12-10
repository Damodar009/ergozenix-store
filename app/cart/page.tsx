"use client"
import CartTable, { CartTableItem } from "@/components/cart/CartTable";
import CartTotals from "@/components/cart/CartTotals";
import CheckoutForm from "@/components/cart/CheckoutForm";
import { useCart } from "@/context/cart-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
    
export interface CartSummary {
  subtotal: number;
  shipping: number;
  total: number;
}

export default function CartPage() {
  const { items, cartTotal, isLoading } = useCart()

  if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center">Loading cart...</div>
  }

  // Transform context items to view format
  const viewItems = items.map(item => ({
      id: item.product_id, // Product ID for display/link
      name: item.product?.name || 'Unknown Product',
      price: item.product?.price || 0,
      quantity: item.quantity,
      imageUrl: item.product?.image_url || 'https://via.placeholder.com/150',
      altText: item.product?.name || 'Product Image',
      cartItemId: item.id // The actual CartItem ID (number) for removal
  }))

  const summary = {
      subtotal: cartTotal,
      shipping: 15, // Fixed shipping for now
      total: cartTotal + 15
  }

  if (items.length === 0) {
      return (
          <div className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
              <Link href="/shop">
                  <Button size="lg">Continue Shopping</Button>
              </Link>
          </div>
      )
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Details Column */}
        <div className="lg:col-span-2">
          <p className="text-4xl font-black mb-6">Your Cart</p>
          <CartTable items={viewItems} />
          <CartTotals summary={summary} />
        </div>

        {/* Checkout Column */}
        <div className="lg:col-span-1">
          <CheckoutForm />
        </div>
      </main>
    </div>
  );
}
