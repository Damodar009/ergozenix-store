"use client";
"use client";

import { Button } from "@/components/ui/button"; // your shadcn button
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import CartTable, { CartTableItem } from "@/components/cart/CartTable";
import { useCart } from "@/context/cart-context";

export default function CartButtons() {
  const { itemCount } = useCart();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const viewItems = useCart().items.map(item => ({
    id: item.product_id,
    name: item.product?.name || "Unknown Product",
    price: item.product?.price || 0,
    quantity: item.quantity,
    imageUrl: item.product?.image_url || "https://via.placeholder.com/150",
    altText: item.product?.name || "Product Image",
    cartItemId: item.id,
  }));

  // No summary needed for simplified cart view

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 bg-secondary text-foreground hover:bg-secondary/80 relative"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-background">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        {viewItems.length > 0 ? (
          <>
            <CartTable items={viewItems as CartTableItem[]} />
          </>
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            Your cart is empty.
          </div>
        )}
        {viewItems.length > 0 && (
          <Button
            className="w-full mt-4 bg-[#00B5D8] hover:bg-[#00A3C0] text-white py-2 px-4 rounded-md"
            onClick={() => {
              router.push('/checkout');
            }}
          >
            Proceed to Checkout
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
}
