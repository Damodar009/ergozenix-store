"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { retrieveId } from "@/lib/cookieUtils";
import { OrderService } from "@/services/order-service";
import {
  Package,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  ShoppingBag,
  AlertCircle,
  Clock,
} from "lucide-react";

// ─── Status step pipeline ────────────────────────────────────────────────────

const STATUS_STEPS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
] as const;

type OrderStatus = (typeof STATUS_STEPS)[number] | "CANCELLED";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Order Placed",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_DESCRIPTIONS: Record<string, string> = {
  PENDING: "Your order has been received and is awaiting confirmation.",
  CONFIRMED: "Your order has been confirmed and is being prepared.",
  PROCESSING: "Your order is being packed and prepared for dispatch.",
  SHIPPED: "Your order is on its way to you.",
  DELIVERED: "Your order has been delivered successfully.",
  CANCELLED: "This order has been cancelled.",
};

const STATUS_BADGE: Record<string, { className: string; text: string }> = {
  PENDING:    { className: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300", text: "Awaiting Confirmation" },
  CONFIRMED:  { className: "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300", text: "Confirmed" },
  PROCESSING: { className: "bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300", text: "Processing" },
  SHIPPED:    { className: "bg-teal-100 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300", text: "Shipped" },
  DELIVERED:  { className: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300", text: "Delivered" },
  CANCELLED:  { className: "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300", text: "Cancelled" },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  id: number;
  name: string;
  imageUrl: string | null;
  quantity: number;
  price: number;
  attributes: { name: string; value: string }[];
}

interface TrackedOrder {
  id: number;
  orderNumber: string;
  status: string;
  placedAt: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: OrderItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    landmark?: string;
    notes?: string;
  } | null;
}

// ─── Progress Tracker ─────────────────────────────────────────────────────────

function ProgressTracker({ status }: { status: string }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-xl">
        <AlertCircle size={16} className="text-destructive shrink-0" />
        <p className="text-[13px] font-semibold text-destructive">This order was cancelled.</p>
      </div>
    );
  }

  const currentIdx = STATUS_STEPS.indexOf(status as (typeof STATUS_STEPS)[number]);

  return (
    <div className="relative">
      {/* Connector bar */}
      <div className="absolute top-4 left-0 right-0 h-[2px] bg-secondary z-0 mx-[calc(12.5%)]" />
      <div
        className="absolute top-4 left-0 h-[2px] bg-primary z-0 transition-all duration-700"
        style={{
          left: "calc(12.5%)",
          width: currentIdx <= 0
            ? "0%"
            : `${(currentIdx / (STATUS_STEPS.length - 1)) * 75}%`,
        }}
      />

      <div className="relative z-10 flex justify-between">
        {STATUS_STEPS.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isActive = idx === currentIdx;
          const isPending = idx > currentIdx;

          return (
            <div key={step} className="flex flex-col items-center text-center w-1/5 px-1">
              {/* Node */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 transition-all duration-300
                  ${isCompleted ? "bg-primary" : ""}
                  ${isActive ? "bg-primary ring-4 ring-primary/20" : ""}
                  ${isPending ? "bg-muted border border-border" : ""}
                `}
              >
                {isCompleted && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {isActive && <div className="w-2.5 h-2.5 rounded-full bg-background" />}
              </div>
              {/* Label */}
              <span
                className={`text-[10px] font-bold uppercase tracking-wider leading-tight
                  ${isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}
                `}
                style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
              >
                {STATUS_LABELS[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Single Order Card ─────────────────────────────────────────────────────────

function OrderCard({ order }: { order: TrackedOrder }) {
  const [expanded, setExpanded] = useState(false);
  const badge = STATUS_BADGE[order.status] || STATUS_BADGE["PENDING"];

  const formattedDate = new Date(order.placedAt).toLocaleString("en-NP", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusDescription = STATUS_DESCRIPTIONS[order.status] || "";

  return (
    <div
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
      style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
    >
      {/* ── Card Header ── */}
      <div
        className="px-6 py-5 cursor-pointer select-none flex flex-col sm:flex-row sm:items-center gap-4"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[15px] font-bold text-foreground">
              #{order.orderNumber}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${badge.className}`}
            >
              {badge.text}
            </span>
          </div>
          <p className="text-[12px] text-muted-foreground">{formattedDate}</p>
          <p className="text-[12px] text-muted-foreground mt-1">{statusDescription}</p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <p className="text-[18px] font-bold text-foreground">
              Rs. {order.total.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="text-muted-foreground">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="px-6 pb-5">
        <ProgressTracker status={order.status} />
      </div>

      {/* ── Expanded Details ── */}
      {expanded && (
        <div className="border-t border-border bg-muted/30 px-6 py-6 space-y-6">

          <div className="grid md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            {order.customer && (
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[2px] font-bold text-muted-foreground">
                  Delivery Address
                </p>
                <div className="space-y-1.5 text-[13px] text-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin size={13} className="mt-0.5 text-muted-foreground shrink-0" />
                    <span className="leading-relaxed">{order.customer.address}</span>
                  </div>
                  {order.customer.landmark && (
                    <p className="text-[12px] text-muted-foreground pl-5">
                      Near: {order.customer.landmark}
                    </p>
                  )}
                  <div className="flex items-center gap-2 pl-0">
                    <Phone size={13} className="text-muted-foreground shrink-0" />
                    <span>{order.customer.phone}</span>
                  </div>
                </div>
                {order.customer.notes && (
                  <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl px-3 py-2 mt-2">
                    <Clock size={12} className="mt-0.5 text-amber-800 dark:text-amber-300 shrink-0" />
                    <span className="text-[12px] text-amber-800 dark:text-amber-300 leading-relaxed">
                      {order.customer.notes}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Order Totals */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[2px] font-bold text-muted-foreground">
                Payment Summary
              </p>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>Rs. {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Rs. {order.shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border text-[14px]">
                  <span>Total</span>
                  <span>Rs. {order.total.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-muted-foreground pt-1">
                  Payment via Direct Bank Transfer
                </p>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[2px] font-bold text-muted-foreground">
              Items Ordered
            </p>
            <div className="rounded-xl border border-border overflow-hidden divide-y divide-border bg-card">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-4 py-3">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-border shrink-0 bg-accent">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={16} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground truncate">
                      {item.name}
                    </p>
                    {item.attributes.length > 0 && (
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5">
                        {item.attributes.map((a) => a.value).join(" / ")}
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  {/* Price */}
                  <p className="text-[13px] font-semibold text-foreground shrink-0">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrderTrackingPage() {
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const loadOrders = useCallback(async (sid: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await OrderService.getOrdersBySessionId(sid);
      setOrders(data as TrackedOrder[]);
    } catch (err: any) {
      setError(err.message || "Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const sid = retrieveId("session_id");
    if (sid) {
      setSessionId(sid);
      loadOrders(sid);
    } else {
      setLoading(false);
      setError("No session found. Your orders are linked to your browser session.");
    }
  }, [loadOrders]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Hanken+Grotesk:wght@300;400;500;600;700&display=swap');
      `}</style>

      {/* Subtle grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[100]"
        style={{
          opacity: 0.025,
          backgroundImage: "url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')",
        }}
      />

      <div
        className="min-h-screen bg-background"
        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
        <main className="max-w-[860px] mx-auto px-4 sm:px-6 py-10 space-y-8">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[3px] font-bold text-muted-foreground mb-1">
                My Account
              </p>
              <h1
                className="text-[36px] sm:text-[48px] font-normal italic leading-tight text-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                My Orders
              </h1>
              {orders.length > 0 && (
                <p className="text-[13px] text-muted-foreground mt-1">
                  {orders.length} order{orders.length !== 1 ? "s" : ""} found for your session
                </p>
              )}
            </div>
            {sessionId && (
              <button
                onClick={() => loadOrders(sessionId)}
                disabled={loading}
                className="flex items-center gap-2 text-[11px] uppercase tracking-[2px] font-semibold text-primary border border-primary px-4 py-2.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 shrink-0 cursor-pointer"
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            )}
          </div>

          {/* ── Content ── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-[13px] text-muted-foreground">Looking up your orders…</p>
            </div>
          ) : error ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <AlertCircle size={24} className="text-destructive" />
              </div>
              <p className="text-[15px] font-semibold text-foreground">Unable to load orders</p>
              <p className="text-[13px] text-muted-foreground max-w-sm mx-auto leading-relaxed">{error}</p>
              <Link
                href="/"
                className="inline-block text-[11px] uppercase tracking-[2px] font-bold text-primary border border-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Go Home
              </Link>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto">
                <Package size={28} className="text-muted-foreground" />
              </div>
              <p className="text-[18px] font-semibold text-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                No orders yet
              </p>
              <p className="text-[13px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
                You haven't placed any orders from this browser. Start shopping and your orders will appear here.
              </p>
              <Link
                href="/shop"
                className="inline-block text-[11px] uppercase tracking-[2px] font-bold text-primary-foreground bg-primary px-8 py-3 rounded-lg hover:bg-primary/90 transition-all"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}

          {/* ── Support Footer ── */}
          {!loading && (
            <div className="bg-primary text-primary-foreground rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-[15px] font-semibold mb-1">Need help with your order?</p>
                <p className="text-[13px] opacity-90 font-light">
                  Our team is here to help with any questions or concerns.
                </p>
              </div>
              <a
                href="mailto:ergozenix.store@gmail.com"
                className="shrink-0 text-[11px] uppercase tracking-[2px] font-bold border border-primary-foreground/50 px-5 py-2.5 rounded-lg hover:bg-primary-foreground hover:text-primary transition-all"
              >
                Contact Support
              </a>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
