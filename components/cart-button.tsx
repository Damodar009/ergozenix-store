"use client";

import { Button } from "@/components/ui/button"; // your shadcn button
import { ShoppingCart, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

import { useCart } from "@/context/cart-context";

export default function CartButtons() {
  const router = useRouter();
  const { itemCount } = useCart();

  const goToCart = () => {
    router.push("/cart");
  };

  const openMenu = () => {
    // handle mobile menu open
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full h-10 w-10 bg-secondary text-foreground hover:bg-secondary/80 relative"
        aria-label="Cart"
        onClick={goToCart}
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-background">
            {itemCount}
          </span>
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden rounded-full h-10 w-10 bg-secondary text-foreground hover:bg-secondary/80"
        aria-label="Open menu"
        onClick={openMenu}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
}
