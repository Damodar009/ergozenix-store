import OrderConfirmationPage from "@/components/order/OrderConfirmationPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-[15px] font-light text-muted-foreground">Loading order confirmation…</p>
      </div>
    }>
      <OrderConfirmationPage />
    </Suspense>
  );
}
