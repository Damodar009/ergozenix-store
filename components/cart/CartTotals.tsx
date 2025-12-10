import { CartSummary } from "@/app/cart/page";
import { FC } from "react";

interface CartTotalsProps {
  summary: CartSummary;
}

const CartTotals: FC<CartTotalsProps> = ({ summary }) => (
  <div className="mt-6 p-4">
    <div className="flex justify-between gap-x-6 py-2 border-b border-b-[#dbe4e6] dark:border-b-gray-700">
      <p className="text-[#618389] dark:text-gray-400 text-sm font-normal leading-normal">Subtotal</p>
      <p className="text-[#111718] dark:text-white text-sm font-normal leading-normal text-right">
        Rs. {summary.subtotal.toFixed(2)}
      </p>
    </div>
    <div className="flex justify-between gap-x-6 py-2 border-b border-b-[#dbe4e6] dark:border-b-gray-700">
      <p className="text-[#618389] dark:text-gray-400 text-sm font-normal leading-normal">Shipping</p>
      <p className="text-[#111718] dark:text-white text-sm font-normal leading-normal text-right">
        Rs. {summary.shipping.toFixed(2)}
      </p>
    </div>
    <div className="flex justify-between gap-x-6 py-2">
      <p className="text-[#618389] dark:text-gray-400 text-base font-bold leading-normal">Total</p>
      <p className="text-[#111718] dark:text-white text-base font-bold leading-normal text-right">
        Rs. {summary.total.toFixed(2)}
      </p>
    </div>
  </div>
);

export default CartTotals;
