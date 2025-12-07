

// --- Mock Data ---

import CartTable from "@/components/cart/CartTable";
import CartTotals from "@/components/cart/CartTotals";
import CheckoutForm from "@/components/cart/CheckoutForm";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    altText: string;
  }
  
  export interface CartSummary {
    subtotal: number;
    shipping: number;
    total: number;
  }
  

const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: 1,
    name: "Ergonomic Chair",
    price: 250.0,
    quantity: 1,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuApoNas-1Q1qSHPMMr_lEUKB0prg0l5O0MLs8hOFHz4lQlNkbxJB_0aCVZCpZb0TkTG3PgTLZnD79iUtAcPtUMYtc8sC2TmiYBavJaLcQ1FInAt7tG801NMK9YUQlwORWwbGNir9tQl1E4RTUkhIN6EOTEJ-arjRRgsLuDt0hA5CYiM3tc1n3tLvtqCeTYSSJ8Zej0nmIYcXqcLvXRdxKM_-6hvqP8TqYN4gpDVpp2pJrMuZHO2q4ux2wUf5SvnCcy0b9JQadNG8lGX",
    altText: "Ergonomic Chair",
  },
  {
    id: 2,
    name: "Standing Desk",
    price: 400.0,
    quantity: 1,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq0b4M5QUnsCA3kcFUr3gUCo4-LWgMi-qrBzd6FIqGQqWOnJV0wj7p1KRigqcHvddJo9I2SdjyKHyUwnpwxL82a9vByDA6bNXGOcEOL1HnLXp0zbLUiih8GRrj2qkLDpK-d9EUh6cf3uq7S5-d3g6z5sVWCfHRBvbTuIEOMM7Ew4R3qtkTw81qZ9USeeHwyx2XuntzIqY_4rUokpklI-8P2x2864I3pVhUIwRFMbCTgY8TyoNE6TINr7h2JaJ2b_bRGLASDMFxUt0T",
    altText: "Standing Desk",
  },
];

const MOCK_CART_SUMMARY: CartSummary = {
  subtotal: 650.0,
  shipping: 15.0,
  total: 665.0,
};

export default function CartPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Details Column */}
        <div className="lg:col-span-2">
          <p className="text-4xl font-black mb-6">Your Cart</p>
          <CartTable items={MOCK_CART_ITEMS} />
          <CartTotals summary={MOCK_CART_SUMMARY} />
        </div>

        {/* Checkout Column */}
        <div className="lg:col-span-1">
          <CheckoutForm />
        </div>
      </main>
    </div>
  );
}
