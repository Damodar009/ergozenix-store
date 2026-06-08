"use client"

import { FC, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PROVINCES, DISTRICTS } from "@/lib/nepal-locations";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { OrderService } from "@/services/order-service";
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from "lucide-react";

const CheckoutForm: FC = () => {
  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, cartTotal, clearCart, sessionId, userId } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const shipping = items.length > 0 ? 1000 : 0;
  const total = cartTotal + shipping;

  const handleProvinceChange = (value: string) => {
    setProvince(value);
    setDistrict("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) {
      toast({ title: "Cart is empty", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    const checkoutData: any = {
      fullName: name,
      phoneNumber: formData.get("phone") as string,
      email: (formData.get("email") as string) || "",
      province,
      district,
      city: formData.get("city") as string,
      streetAddress: formData.get("address") as string,
      landmark: formData.get("landmark") as string,
      notes: formData.get("notes") as string,
    };

    try {
      const summary = { subtotal: cartTotal, shipping, total };

      const placedOrder = await OrderService.placeOrder(
        checkoutData,
        items,
        summary,
        userId || null,
        sessionId || null
      );

      await clearCart();
      router.push(`/order-confirmation?orderId=${placedOrder.id}`);
    } catch (error: any) {
      console.error("Order Error:", error);
      toast({
        title: "Failed to place order",
        description: error.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  // ── Main Checkout ────────────────────────────────────────────────────────
  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Hanken+Grotesk:wght@300;400;600&display=swap');
        .checkout-label {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 11px;
          line-height: 1;
          letter-spacing: 2px;
          font-weight: 600;
          text-transform: uppercase;
          color: #5e5e5c;
          display: block;
          margin-bottom: 8px;
        }
        .checkout-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #c0c9c2;
          padding: 12px 0;
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 15px;
          font-weight: 300;
          color: #1c1c19;
          outline: none;
          transition: border-color 0.2s;
        }
        .checkout-input:focus {
          border-bottom-color: #114734;
        }
        .checkout-input::placeholder {
          color: #707973;
        }
        .checkout-select-trigger {
          width: 100%;
          background: transparent !important;
          border: none !important;
          border-bottom: 1px solid #c0c9c2 !important;
          border-radius: 0 !important;
          padding: 12px 0 !important;
          font-family: 'Hanken Grotesk', sans-serif !important;
          font-size: 15px !important;
          font-weight: 300 !important;
          color: #1c1c19 !important;
          box-shadow: none !important;
        }
        .checkout-select-trigger:focus {
          border-bottom-color: #114734 !important;
          ring: none !important;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <main
        className="max-w-[1100px] mx-auto px-6 py-12 md:py-16"
        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
        {/* Progress Indicator */}
        <nav className="flex items-center gap-4 mb-12 overflow-x-auto no-scrollbar">
          <span
            className="text-[11px] leading-[1] tracking-[2px] font-semibold uppercase"
            style={{ color: "#114734" }}
          >
            Information
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#c0c9c2] shrink-0" />
          <span
            className="text-[11px] leading-[1] tracking-[2px] font-semibold uppercase text-[#5e5e5c]"
          >
            Confirmation
          </span>
        </nav>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-16 relative">
            {/* ── Left Column: Forms (58%) ── */}
            <div className="md:w-[58%] space-y-12">

              <section className="space-y-8">
                {/* Shipping Address */}
                <h2
                  className="text-[36px] leading-[1.3] font-normal"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#1c1c19" }}
                >
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="checkout-label">FULL NAME</label>
                    <input
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      className="checkout-input"
                    />
                  </div>

                  {/* Phone */}
                  <div className="md:col-span-2">
                    <label className="checkout-label">PHONE NUMBER</label>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="98XXXXXXXX"
                      required
                      className="checkout-input"
                    />
                  </div>

                  {/* Province */}
                  <div className="md:col-span-1">
                    <label className="checkout-label">PROVINCE</label>
                    <Select onValueChange={handleProvinceChange} value={province} required>
                      <SelectTrigger className="checkout-select-trigger w-full bg-transparent border-0 border-b border-[#c0c9c2] rounded-none shadow-none focus:ring-0 focus:border-b-[#114734] px-0 h-auto py-3 text-[15px] font-light text-[#1c1c19]">
                        <SelectValue placeholder="Select Province" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#fdf9f3] border border-[#c0c9c2]">
                        {PROVINCES.map((p) => (
                          <SelectItem
                            key={p}
                            value={p}
                            className="text-[14px] font-light text-[#1c1c19] focus:bg-[#f1ede8]"
                            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                          >
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* District */}
                  <div className="md:col-span-1">
                    <label className="checkout-label">DISTRICT</label>
                    <Select
                      onValueChange={setDistrict}
                      value={district}
                      disabled={!province}
                      required
                    >
                      <SelectTrigger className="w-full bg-transparent border-0 border-b border-[#c0c9c2] rounded-none shadow-none focus:ring-0 px-0 h-auto py-3 text-[15px] font-light text-[#1c1c19] disabled:opacity-50">
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#fdf9f3] border border-[#c0c9c2]">
                        {province &&
                          DISTRICTS[province as keyof typeof DISTRICTS]?.map((d) => (
                            <SelectItem
                              key={d}
                              value={d}
                              className="text-[14px] font-light text-[#1c1c19] focus:bg-[#f1ede8]"
                              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                            >
                              {d}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* City */}
                  <div className="md:col-span-1">
                    <label className="checkout-label">CITY / TOWN</label>
                    <input
                      name="city"
                      type="text"
                      placeholder="e.g. Kathmandu, Pokhara"
                      required
                      className="checkout-input"
                    />
                  </div>

                  {/* Postal */}
                  <div className="md:col-span-1">
                    <label className="checkout-label">POSTAL CODE (OPTIONAL)</label>
                    <input
                      name="postal"
                      type="text"
                      placeholder="44600"
                      className="checkout-input"
                    />
                  </div>

                  {/* Street Address */}
                  <div className="md:col-span-2">
                    <label className="checkout-label">ADDRESS</label>
                    <input
                      name="address"
                      type="text"
                      placeholder="House No, Street Name, Tole"
                      required
                      className="checkout-input"
                    />
                  </div>

                  {/* Landmark */}
                  <div className="md:col-span-2">
                    <label className="checkout-label">LANDMARK (OPTIONAL)</label>
                    <input
                      name="landmark"
                      type="text"
                      placeholder="Near Temple / School / Hospital"
                      className="checkout-input"
                    />
                  </div>

                  {/* Notes */}
                  <div className="md:col-span-2">
                    <label className="checkout-label">ORDER NOTES (OPTIONAL)</label>
                    <input
                      name="notes"
                      type="text"
                      placeholder="Special delivery instructions..."
                      className="checkout-input"
                    />
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="pt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex items-center gap-2 text-[#5e5e5c] hover:text-[#1c1c19] transition-colors order-2 md:order-1"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-[11px] leading-[1] tracking-[2px] font-semibold uppercase">
                    BACK TO CART
                  </span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full md:w-auto bg-[#114734] text-white px-12 py-5 rounded-[4px] text-[11px] leading-[1] tracking-[2px] font-semibold uppercase hover:bg-[#2c5f4a] transition-all active:scale-[0.98] order-1 md:order-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      PROCESSING...
                    </>
                  ) : (
                    "CONTINUE TO CONFIRMATION"
                  )}
                </button>
              </div>
            </div>

            {/* ── Right Column: Order Summary (42%) ── */}
            <div className="md:w-[42%]">
              <div className="md:sticky md:top-28 space-y-8">
                {/* Order Summary Card */}
                <div className="bg-[#f7f3ee] rounded-lg p-8 border border-[#c0c9c2] space-y-8">
                  <h3
                    className="text-[20px] leading-[1.4] font-medium"
                    style={{ fontFamily: "'Playfair Display', serif", color: "#1c1c19" }}
                  >
                    Order Summary
                  </h3>

                  {/* Line Items */}
                  <div className="space-y-6">
                    {items.length === 0 ? (
                      <p
                        className="text-[15px] font-light text-[#707973]"
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                      >
                        Your cart is empty.
                      </p>
                    ) : (
                      items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-start">
                          {/* Thumbnail */}
                          <div className="relative w-20 h-20 bg-white border border-[#c0c9c2] rounded-lg overflow-hidden shrink-0">
                            {item.product?.image_url ? (
                              <img
                                src={item.product.image_url}
                                alt={item.product?.name || "Product"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#ece7e2] flex items-center justify-center">
                                <span className="text-[#707973] text-xs">No img</span>
                              </div>
                            )}
                            <span className="absolute -top-1 -right-1 bg-[#5e5e5c] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                              {item.quantity}
                            </span>
                          </div>

                          {/* Info */}
                          <div className="flex-grow">
                            <p
                              className="text-[15px] font-semibold text-[#1c1c19] break-words"
                              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                            >
                              {item.product?.name || "Product"}
                            </p>
                            {item.attributes && item.attributes.length > 0 && (
                              <p
                                className="text-[11px] tracking-[2px] uppercase text-[#5e5e5c] mt-0.5"
                                style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                              >
                                {item.attributes.map((a: any) => a.value).join(" / ")}
                              </p>
                            )}
                          </div>

                          {/* Price */}
                          <span
                            className="text-[15px] font-semibold text-[#1c1c19] shrink-0"
                            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                          >
                            Rs. {((item.product?.price || 0) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 pt-4 border-t border-[#c0c9c2]">
                    <div className="flex justify-between text-[#5e5e5c]">
                      <span
                        className="text-[15px] font-light"
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                      >
                        Subtotal
                      </span>
                      <span
                        className="text-[15px] font-light"
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                      >
                        Rs. {cartTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#5e5e5c]">
                      <span
                        className="text-[15px] font-light"
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                      >
                        Shipping
                      </span>
                      <span
                        className="text-[15px] font-light"
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                      >
                        {items.length === 0 ? "—" : `Rs. ${shipping.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline pt-4 border-t border-[#c0c9c2]">
                      <span
                        className="text-[20px] leading-[1.4] font-medium"
                        style={{ fontFamily: "'Playfair Display', serif", color: "#1c1c19" }}
                      >
                        Total
                      </span>
                      <div className="text-right">
                        <span
                          className="text-[11px] text-[#5e5e5c] tracking-[2px] font-semibold uppercase mr-2"
                          style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                        >
                          NPR
                        </span>
                        <span
                          className="text-[32px] leading-[1.3] font-normal text-[#1c1c19]"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method Card */}
                <div className="bg-[#f7f3ee] rounded-lg p-8 border border-[#c0c9c2] space-y-6">
                  <h3
                    className="text-[20px] leading-[1.4] font-medium"
                    style={{ fontFamily: "'Playfair Display', serif", color: "#1c1c19" }}
                  >
                    Payment
                  </h3>

                  <div className="space-y-4">
                    <div className="p-6 rounded-lg border border-[#114734] bg-[#f1ede8] flex items-start gap-4">
                      <div className="flex items-center h-5 mt-0.5">
                        <input
                          id="payment-bank"
                          name="paymentMethod"
                          type="radio"
                          defaultChecked
                          className="h-4.5 w-4.5 accent-[#114734] cursor-pointer"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="payment-bank" className="font-semibold text-[15px] text-[#1c1c19] cursor-pointer block">
                          Direct Bank Transfer
                        </label>
                        <p className="text-[13px] text-[#5e5e5c] font-light leading-relaxed">

                          To complete your purchase, kindly transfer the payment to our bank account, quoting your Order ID or Name as the reference. Please note that dispatch will only occur once the payment has been confirmed and cleared.                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

export default CheckoutForm;
