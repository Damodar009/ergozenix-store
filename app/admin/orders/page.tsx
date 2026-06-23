"use client"

import { useEffect, useState, useCallback } from "react"
import { OrderService } from "@/services/order-service"
import {
  Package,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  User,
  Phone,
  MapPin,
  MessageSquare,
  ShoppingBag,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"

interface OrderRow {
  id: number
  orderNumber: string
  status: string
  createdAt: string
  subtotal: number
  shipping: number
  total: number
  itemCount: number
  items: { id: number; name: string; imageUrl: string | null; quantity: number; price: number }[]
  customer: {
    name: string
    email: string
    phone: string
    address: string
    landmark?: string
    notes?: string
  } | null
}

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  PENDING:    { label: "Pending",    className: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/30", icon: Clock },
  CONFIRMED:  { label: "Confirmed",  className: "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/30", icon: CheckCircle2 },
  PROCESSING: { label: "Processing", className: "bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-900/30", icon: RefreshCw },
  SHIPPED:    { label: "Shipped",    className: "bg-teal-100 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-900/30", icon: Truck },
  DELIVERED:  { label: "Delivered",  className: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/30", icon: CheckCircle2 },
  CANCELLED:  { label: "Cancelled",  className: "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/30", icon: XCircle },
}

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as OrderStatus[]

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as OrderStatus]
  if (!cfg) return <span className="text-xs text-gray-400 uppercase">{status}</span>
  const Icon = cfg.icon
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${cfg.className}`}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  )
}

// ─── Status Selector ──────────────────────────────────────────────────────────

function StatusSelector({
  orderId,
  current,
  onUpdate,
}: {
  orderId: number
  current: string
  onUpdate: (id: number, status: string) => Promise<void>
}) {
  const [saving, setSaving] = useState(false)
  const [selected, setSelected] = useState(current)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value
    setSelected(next)
    setSaving(true)
    try {
      await onUpdate(orderId, next)
    } catch {
      setSelected(current)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={selected}
        onChange={handleChange}
        disabled={saving}
        className="text-[12px] font-semibold uppercase tracking-wider border border-border rounded-md px-3 py-1.5 bg-card text-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-60 cursor-pointer"
        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
        {ALL_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_CONFIG[s].label}
          </option>
        ))}
      </select>
      {saving && (
        <RefreshCw size={13} className="animate-spin text-primary" />
      )}
    </div>
  )
}

// ─── Order Row ────────────────────────────────────────────────────────────────

function OrderCard({
  order,
  onUpdate,
}: {
  order: OrderRow
  onUpdate: (id: number, status: string) => Promise<void>
}) {
  const [expanded, setExpanded] = useState(false)

  const formattedDate = new Date(order.createdAt).toLocaleString("en-NP", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div
      className="bg-card border border-border rounded-xl overflow-hidden transition-shadow hover:shadow-md"
      style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
    >
      {/* ── Row Header ── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Order Number + Date */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[13px] font-bold text-foreground">#{order.orderNumber}</span>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-[12px] text-muted-foreground">{formattedDate}</p>
        </div>

        {/* Customer */}
        <div className="flex-1 min-w-0 hidden md:block">
          {order.customer ? (
            <>
              <p className="text-[13px] font-semibold text-foreground truncate">{order.customer.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{order.customer.phone}</p>
            </>
          ) : (
            <p className="text-[12px] text-muted-foreground italic">No customer info</p>
          )}
        </div>

        {/* Items count */}
        <div className="hidden lg:flex flex-col items-center w-16">
          <p className="text-[18px] font-bold text-primary">{order.itemCount}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Items</p>
        </div>

        {/* Total */}
        <div className="flex flex-col items-end w-28">
          <p className="text-[16px] font-bold text-foreground">Rs. {order.total.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">incl. shipping</p>
        </div>

        {/* Expand icon */}
        <div className="text-muted-foreground ml-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* ── Expanded Detail ── */}
      {expanded && (
        <div className="border-t border-border px-5 py-5 space-y-5 bg-muted/30">
          <div className="grid md:grid-cols-2 gap-5">

            {/* Customer Info */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-[2px] font-bold text-muted-foreground">Customer Details</h4>
              {order.customer ? (
                <div className="space-y-2 text-[13px] text-foreground">
                  <div className="flex items-start gap-2">
                    <User size={13} className="mt-0.5 text-muted-foreground shrink-0" />
                    <span className="font-semibold">{order.customer.name}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone size={13} className="mt-0.5 text-muted-foreground shrink-0" />
                    <span>{order.customer.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={13} className="mt-0.5 text-muted-foreground shrink-0" />
                    <span className="text-[12px] leading-relaxed">{order.customer.address}</span>
                  </div>
                  {order.customer.landmark && (
                    <p className="text-[12px] text-muted-foreground pl-5">Landmark: {order.customer.landmark}</p>
                  )}
                  {order.customer.notes && (
                    <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg px-3 py-2">
                      <MessageSquare size={12} className="mt-0.5 text-amber-800 dark:text-amber-300 shrink-0" />
                      <span className="text-[12px] text-amber-800 dark:text-amber-300">{order.customer.notes}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[12px] text-muted-foreground italic">No customer information recorded.</p>
              )}
            </div>

            {/* Status Update */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-[2px] font-bold text-muted-foreground">Update Status</h4>
              <StatusSelector orderId={order.id} current={order.status} onUpdate={onUpdate} />
              <div className="pt-2 border-t border-border space-y-1">
                <div className="flex justify-between text-[12px] text-muted-foreground">
                  <span>Subtotal</span>
                  <span>Rs. {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[12px] text-muted-foreground">
                  <span>Shipping</span>
                  <span>Rs. {order.shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[13px] font-bold text-foreground pt-1 border-t border-border">
                  <span>Total</span>
                  <span>Rs. {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase tracking-[2px] font-bold text-muted-foreground">
              Order Items ({order.itemCount})
            </h4>
            <div className="divide-y divide-border rounded-lg border border-border overflow-hidden bg-card">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-md overflow-hidden border border-border shrink-0 bg-accent">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={16} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">Qty: {item.quantity}</p>
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
  )
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <p className="text-[10px] uppercase tracking-[2px] font-bold text-muted-foreground mb-1">{label}</p>
      <p className="text-[28px] font-bold text-foreground leading-none">{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("ALL")
  const [updating, setUpdating] = useState<number | null>(null)

  const loadOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await OrderService.getAllOrders()
      setOrders(data as OrderRow[])
    } catch (err: any) {
      setError(err.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const handleUpdateStatus = async (orderId: number, status: string) => {
    setUpdating(orderId)
    try {
      await OrderService.updateOrderStatus(orderId, status)
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      )
    } finally {
      setUpdating(null)
    }
  }

  // Derived stats
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0)
  const pendingCount = orders.filter((o) => o.status === "PENDING").length
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length

  // Filtered list
  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.phone?.includes(search)
    const matchStatus = filterStatus === "ALL" || o.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Hanken+Grotesk:wght@300;400;500;600;700&display=swap');
      `}</style>

      <div
        className="min-h-screen bg-background"
        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-8">

          {/* ── Page Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[3px] font-bold text-muted-foreground mb-1">Admin Panel</p>
              <h1
                className="text-[36px] sm:text-[44px] font-normal italic leading-tight text-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Orders
              </h1>
            </div>
            <button
              onClick={loadOrders}
              disabled={loading}
              className="flex items-center gap-2 text-[11px] uppercase tracking-[2px] font-semibold text-primary border border-primary px-4 py-2.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* ── Stats Row ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Orders" value={orders.length} sub="all time" />
            <StatCard label="Pending" value={pendingCount} sub="need attention" />
            <StatCard label="Delivered" value={deliveredCount} sub="completed" />
            <StatCard
              label="Total Revenue"
              value={`Rs. ${totalRevenue.toLocaleString()}`}
              sub="incl. shipping"
            />
          </div>

          {/* ── Filters ── */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by order #, customer name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-[13px] border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            {/* Status filter */}
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-muted-foreground shrink-0" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-[12px] font-semibold uppercase tracking-wider border border-border rounded-lg px-3 py-2.5 bg-card text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Content ── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-[13px] text-muted-foreground">Loading orders…</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-6 flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-[13px] font-semibold text-red-700 dark:text-red-300">Failed to load orders</p>
                <p className="text-[12px] text-red-500 dark:text-red-400 mt-1">{error}</p>
                <button onClick={loadOrders} className="text-[11px] font-bold uppercase text-red-600 dark:text-red-400 mt-2 underline cursor-pointer">
                  Try again
                </button>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
              <Package size={40} className="text-muted-foreground" />
              <p className="text-[15px] font-semibold text-foreground">
                {orders.length === 0 ? "No orders yet" : "No orders match your filters"}
              </p>
              <p className="text-[13px] text-muted-foreground">
                {orders.length === 0
                  ? "Orders will appear here once customers start checking out."
                  : "Try adjusting your search or status filter."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[12px] text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
                <span className="font-semibold text-foreground">{orders.length}</span> orders
              </p>
              {filtered.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdate={handleUpdateStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
