"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { OrderService } from "@/services/order-service";

interface OrderItem {
  id: number;
  name: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
  attributes?: { name: string; value: string }[];
}

interface OrderData {
  orderNumber: string;
  customerName: string;
  email: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function loadOrder() {
      const orderId = searchParams.get("orderId");

      if (!orderId) {
        setError("No order ID was found in the URL.");
        setLoading(false);
        return;
      }

      try {
        const data = await OrderService.getOrderDetails(orderId);
        setOrder(data);
      } catch (err: any) {
        console.error("Error loading order:", err);
        setError(err.message || "Failed to load order details.");
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [searchParams]);

  // Fade-in animation on load
  useEffect(() => {
    if (!mainRef.current || !order) return;
    const children = Array.from(mainRef.current.children) as HTMLElement[];
    children.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(10px)";
      el.style.transition = "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 100 * i);
    });
  }, [order]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-background"
        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-[15px] font-light text-muted-foreground">Loading order details…</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6"
        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
        <p className="font-headline-card text-[20px] font-medium text-foreground mb-2">
          Unable to Load Order
        </p>
        <p className="text-[15px] font-light text-muted-foreground max-w-sm mb-8">
          {error}
        </p>
        <Link
          href="/"
          className="bg-primary text-primary-foreground font-label-caps text-[11px] font-semibold tracking-[2px] px-8 py-4 rounded uppercase transition-colors hover:bg-primary/90"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6"
        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
        <p className="font-headline-card text-[20px] font-medium text-foreground mb-2">
          No Order Details Found
        </p>
        <Link
          href="/"
          className="bg-primary text-primary-foreground font-label-caps text-[11px] font-semibold tracking-[2px] px-8 py-4 rounded uppercase transition-colors hover:bg-primary/90"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  const firstName = order.customerName.split(" ")[0] || order.customerName;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Hanken+Grotesk:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Grain texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[100]"
        style={{
          opacity: 0.03,
          mixBlendMode: "multiply",
          backgroundImage: "url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')",
        }}
      />

      {/* Body background */}
      <div
        className="min-h-screen bg-background text-foreground"
        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
        <main
          ref={mainRef}
          className="max-w-[640px] mx-auto px-16 py-24 flex flex-col items-center text-center"
          style={{ paddingLeft: "clamp(1.5rem, 8vw, 64px)", paddingRight: "clamp(1.5rem, 8vw, 64px)" }}
        >
          {/* ── Success Indicator ── */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-8 transition-transform duration-700 ease-out hover:scale-110 border-2 border-primary"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          {/* ── Confirmation Header ── */}
          <h1
            className="mb-4 italic font-normal text-foreground"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "36px",
              lineHeight: "1.3",
            }}
          >
            Thank you, {firstName}.
          </h1>

          <p
            className="mb-12 text-muted-foreground"
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: "15px",
              lineHeight: "1.6",
              fontWeight: 300,
              maxWidth: "400px",
            }}
          >
            Your order{" "}
            <span className="font-medium text-foreground">#{order.orderNumber}</span>{" "}
            has been placed.
          </p>

          {/* ── Order Summary Card ── */}
          <div
            className="w-full mb-8 overflow-hidden bg-card border border-border"
            style={{
              borderRadius: "0.25rem",
            }}
          >
            <div className="p-8 text-left">
              {/* Card heading */}
              <h2
                className="uppercase mb-4 text-muted-foreground"
                style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: "11px",
                  lineHeight: "1",
                  letterSpacing: "2px",
                  fontWeight: 600,
                }}
              >
                Order Summary
              </h2>

              {/* Items */}
              <div className="mb-8" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center"
                    style={{ gap: "16px", paddingTop: "8px", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}
                  >
                    {/* Thumbnail */}
                    <div
                      className="flex-shrink-0 overflow-hidden"
                      style={{
                        width: "64px",
                        height: "64px",
                        backgroundColor: "var(--muted)",
                        borderRadius: "0.125rem",
                      }}
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ color: "var(--muted-foreground)", fontSize: "11px" }}
                        >
                          No img
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-grow">
                      <p
                        style={{
                          fontFamily: "'Hanken Grotesk', sans-serif",
                          fontSize: "15px",
                          lineHeight: "1.6",
                          fontWeight: 400,
                          color: "var(--foreground)",
                        }}
                      >
                        {item.name}
                        {item.quantity > 1 && (
                          <span style={{ color: "var(--muted-foreground)", fontWeight: 300 }}> × {item.quantity}</span>
                        )}
                      </p>
                      {item.attributes && item.attributes.length > 0 && (
                        <p
                          className="uppercase"
                          style={{
                            fontFamily: "'Hanken Grotesk', sans-serif",
                            fontSize: "10px",
                            letterSpacing: "2px",
                            fontWeight: 600,
                            color: "var(--muted-foreground)",
                            marginTop: "2px",
                          }}
                        >
                          {item.attributes.map((a) => a.value).join(" / ")}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p
                        style={{
                          fontFamily: "'Hanken Grotesk', sans-serif",
                          fontSize: "15px",
                          lineHeight: "1.6",
                          fontWeight: 300,
                          color: "var(--foreground)",
                        }}
                      >
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div className="flex justify-between items-center">
                  <span
                    style={{
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontSize: "15px",
                      lineHeight: "1.6",
                      fontWeight: 300,
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Subtotal
                  </span>
                  <span
                    style={{
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontSize: "15px",
                      lineHeight: "1.6",
                      fontWeight: 300,
                      color: "var(--foreground)",
                    }}
                  >
                    Rs. {order.subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span
                    style={{
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontSize: "15px",
                      lineHeight: "1.6",
                      fontWeight: 300,
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Shipping
                  </span>
                  <span
                    style={{
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontSize: "15px",
                      lineHeight: "1.6",
                      fontWeight: 300,
                      color: "var(--foreground)",
                    }}
                  >
                    Rs. {order.shipping.toLocaleString()}
                  </span>
                </div>

                <div
                  className="flex justify-between items-center"
                  style={{ paddingTop: "8px" }}
                >
                  <span
                    className="uppercase text-foreground"
                    style={{
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontSize: "11px",
                      lineHeight: "1",
                      letterSpacing: "2px",
                      fontWeight: 600,
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontSize: "18px",
                      lineHeight: "1.6",
                      fontWeight: 600,
                      color: "var(--primary)",
                    }}
                  >
                    Rs. {order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div
            className="w-full flex flex-col sm:flex-row sm:justify-center mb-16"
            style={{ gap: "16px" }}
          >
            <button
              onClick={() => router.push("/order-tracking")}
              className="active:scale-95 transition-all duration-300 w-full sm:w-auto bg-primary text-primary-foreground font-label-caps text-[11px] font-semibold tracking-[2px] px-8 py-4 rounded uppercase hover:bg-primary/90 border border-transparent cursor-pointer"
            >
              Track Your Order
            </button>

            <button
              onClick={() => {
                router.push("/");
              }}
              className="active:scale-95 transition-all duration-300 w-full sm:w-auto bg-transparent border border-foreground text-foreground font-label-caps text-[11px] font-semibold tracking-[2px] px-8 py-4 rounded uppercase hover:bg-muted cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>

          {/* ── Support Footer ── */}
          <footer
            className="w-full"
            style={{ paddingTop: "32px", borderTop: "1px solid var(--border)" }}
          >
            <p
              className="text-muted-foreground"
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: "13px",
                lineHeight: "1.6",
                fontWeight: 300,
              }}
            >
              Questions? Reach out to{" "}
              <a
                href="mailto:ergozenix.store@gmail.com"
                className="text-primary hover:underline transition-colors"
                style={{
                  textDecoration: "none",
                  textUnderlineOffset: "4px",
                }}
              >
                ergozenix.store@gmail.com
              </a>
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
