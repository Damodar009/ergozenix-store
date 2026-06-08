import OrderConfirmationPage from "@/components/order/OrderConfirmationPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f7f3ee]">
        <p className="text-[15px] font-light text-[#5e5e5c]">Loading order confirmation…</p>
      </div>
    }>
      <OrderConfirmationPage />
    </Suspense>
  );
}
