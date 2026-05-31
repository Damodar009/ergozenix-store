"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  // Premium fake order data for visual design preview
  const [order, setOrder] = useState<OrderData | null>({
    orderNumber: "ERGO-8924-01",
    customerName: "Jane Doe",
    email: "jane.doe@example.com",
    items: [
      {
        id: 1,
        name: "ErgoForm™ Active Ergonomic Chair",
        imageUrl: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?q=80&w=200&auto=format&fit=crop",
        price: 49500,
        quantity: 1,
        attributes: [
          { name: "Frame", value: "Polished Aluminum" },
          { name: "Mesh", value: "Slate Grey" },
          { name: "Support", value: "Dynamic Lumbar Support" }
        ]
      },
      {
        id: 2,
        name: "Premium Wool Felt Desk Mat",
        imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=200&auto=format&fit=crop",
        price: 4500,
        quantity: 2,
        attributes: [
          { name: "Size", value: "Medium (900x400mm)" },
          { name: "Color", value: "Heather Charcoal" }
        ]
      }
    ],
    subtotal: 58500,
    shipping: 1200,
    total: 59700
  });

  const mainRef = useRef<HTMLElement>(null);

  // Commented out during design review - will load actual checkout session data later
  /*
  useEffect(() => {
    try {
      const raw = localStorage.getItem("last_order");
      if (raw) {
        setOrder(JSON.parse(raw));
      }
    } catch {
      // ignore parse errors
    }
  }, []);
  */

  // Fade-in animation on load
  useEffect(() => {
    if (!mainRef.current) return;
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

  if (!order) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f7f3ee", fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
        <p className="text-[15px] font-light text-[#5e5e5c]">Loading order details…</p>
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
        className="min-h-screen"
        style={{ backgroundColor: "#f7f3ee", color: "#1c1c19", fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
        <main
          ref={mainRef}
          className="max-w-[640px] mx-auto px-16 py-24 flex flex-col items-center text-center"
          style={{ paddingLeft: "clamp(1.5rem, 8vw, 64px)", paddingRight: "clamp(1.5rem, 8vw, 64px)" }}
        >
          {/* ── Success Indicator ── */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-8 transition-transform duration-700 ease-out hover:scale-110"
            style={{ border: "2px solid #2c5f4a" }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2c5f4a"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          {/* ── Confirmation Header ── */}
          <h1
            className="mb-4 italic font-normal"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "36px",
              lineHeight: "1.3",
              color: "#1c1c19",
            }}
          >
            Thank you, {firstName}.
          </h1>

          <p
            className="mb-12"
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: "15px",
              lineHeight: "1.6",
              fontWeight: 300,
              color: "#5e5e5c",
              maxWidth: "400px",
            }}
          >
            Your order{" "}
            <span style={{ fontWeight: 500, color: "#1c1c19" }}>#{order.orderNumber}</span>{" "}
            has been placed. A confirmation has been sent to{" "}
            <span
              style={{
                color: "#1c1c19",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                textDecorationColor: "#c0c9c2",
              }}
            >
              {order.email}
            </span>
            .
          </p>

          {/* ── Order Summary Card ── */}
          <div
            className="w-full mb-8 overflow-hidden"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #c0c9c2",
              borderRadius: "0.25rem",
            }}
          >
            <div className="p-8 text-left">
              {/* Card heading */}
              <h2
                className="uppercase mb-4"
                style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: "11px",
                  lineHeight: "1",
                  letterSpacing: "2px",
                  fontWeight: 600,
                  color: "#404944",
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
                    style={{ gap: "16px", paddingTop: "8px", paddingBottom: "8px", borderBottom: "1px solid #f1ede8" }}
                  >
                    {/* Thumbnail */}
                    <div
                      className="flex-shrink-0 overflow-hidden"
                      style={{
                        width: "64px",
                        height: "64px",
                        backgroundColor: "#ece7e2",
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
                          style={{ color: "#707973", fontSize: "11px" }}
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
                          color: "#1c1c19",
                        }}
                      >
                        {item.name}
                        {item.quantity > 1 && (
                          <span style={{ color: "#5e5e5c", fontWeight: 300 }}> × {item.quantity}</span>
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
                            color: "#404944",
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
                          color: "#1c1c19",
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
                  borderTop: "1px solid #c0c9c2",
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
                      color: "#404944",
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
                      color: "#1c1c19",
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
                      color: "#404944",
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
                      color: "#1c1c19",
                    }}
                  >
                    {order.shipping === 0 ? "Complimentary" : `Rs. ${order.shipping.toLocaleString()}`}
                  </span>
                </div>

                <div
                  className="flex justify-between items-center"
                  style={{ paddingTop: "8px" }}
                >
                  <span
                    className="uppercase"
                    style={{
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontSize: "11px",
                      lineHeight: "1",
                      letterSpacing: "2px",
                      fontWeight: 600,
                      color: "#1c1c19",
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
                      color: "#114734",
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
              className="active:scale-95 transition-all duration-300"
              style={{
                backgroundColor: "#2c5f4a",
                color: "#ffffff",
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: "11px",
                lineHeight: "1",
                letterSpacing: "2px",
                fontWeight: 600,
                padding: "16px 32px",
                borderRadius: "0.25rem",
                border: "none",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#114734")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2c5f4a")}
            >
              Track Your Order
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("last_order");
                router.push("/");
              }}
              className="active:scale-95 transition-all duration-300"
              style={{
                backgroundColor: "transparent",
                color: "#1c1c19",
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: "11px",
                lineHeight: "1",
                letterSpacing: "2px",
                fontWeight: 600,
                padding: "16px 32px",
                borderRadius: "0.25rem",
                border: "1px solid #1c1c19",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ece7e2")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              Continue Shopping
            </button>
          </div>

          {/* ── Support Footer ── */}
          <footer
            className="w-full"
            style={{ paddingTop: "32px", borderTop: "1px solid #c0c9c2" }}
          >
            <p
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: "13px",
                lineHeight: "1.6",
                fontWeight: 300,
                color: "#404944",
              }}
            >
              Questions? Reach out to{" "}
              <a
                href="mailto:ergozenix.store@gmail.com"
                style={{
                  color: "#114734",
                  textDecoration: "none",
                  textUnderlineOffset: "4px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
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
