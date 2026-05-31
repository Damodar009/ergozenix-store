"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";

export default function CartButtons() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart" passHref>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full h-10 w-10 bg-secondary text-foreground hover:bg-secondary/80 relative cursor-pointer"
        aria-label="Cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-background font-semibold">
            {itemCount}
          </span>
        )}
      </Button>
    </Link>
  );
}
