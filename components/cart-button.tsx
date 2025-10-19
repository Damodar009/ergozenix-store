"use client";

import { Button } from "@/components/ui/button"; // your shadcn button
import { ShoppingCart, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartButtons() {
  const router = useRouter();

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
        className="rounded-full h-10 w-10 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Cart"
        onClick={goToCart}
      >
        <ShoppingCart className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden rounded-full h-10 w-10 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Open menu"
        onClick={openMenu}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
}
