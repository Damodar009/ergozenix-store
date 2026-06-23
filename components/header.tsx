"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { LogoIcon } from "@/components/logo-icon"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { retrieveId } from "@/lib/cookieUtils"
import { supabase } from "@/services/supabase"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

const ACTIVE_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED"]

export function Header() {
  const pathname = usePathname()
  const { itemCount } = useCart()
  const { wishlistCount } = useWishlist()
  const [hasPendingOrder, setHasPendingOrder] = useState(false)

  useEffect(() => {
    async function checkPendingOrders() {
      const sessionId = retrieveId("session_id")
      if (!sessionId) return

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("id, order_status")
          .eq("session_id", sessionId)
          .in("order_status", ACTIVE_STATUSES)
          .limit(1)

        if (!error && data && data.length > 0) {
          setHasPendingOrder(true)
        }
      } catch {
        // Silently fail — non-critical UI enhancement
      }
    }

    checkPendingOrders()
  }, [])

  const navLinkStyle = {
    fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "2px",
  }

  return (
    <header className="bg-card sticky top-0 z-50 border-b border-border">
      <div className="flex justify-between items-center h-[64px] w-full px-8 md:px-12 lg:px-16">

        {/* ── Left: Logo ── */}
        <div className="flex-1 flex justify-start items-center">
          <Link href="/" className="flex items-center text-foreground cursor-pointer">
            <Image
              src="/logo_v2.1.png"
              alt="ErgoZenix logo"
              width={32}
              height={32}
              className="w-10 h-10 object-contain mix-blend-multiply dark:mix-blend-normal"
            />
            <div
              className="font-semibold"
              style={{
                fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
                fontSize: "16px",
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              ErgoZenix
            </div>
          </Link>
        </div>

        {/* ── Center: Nav ── */}
        <nav className="hidden md:flex flex-none justify-center gap-[var(--ef-stack-lg)] h-full items-center">
          {[
            { href: "/shop", label: "Shop" },
            { href: "/contact", label: "Contact" },
            { href: "/about", label: "About" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "pb-1 cursor-pointer transition-colors duration-200 uppercase",
                pathname === href
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={navLinkStyle}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* ── Right: Icons ── */}
        <div className="flex-1 flex justify-end items-center gap-[var(--ef-stack-sm)] md:gap-[var(--ef-stack-md)]">

          {/* Track Order — shown only when pending order exists */}
          {hasPendingOrder && (
            <Link
              href="/order-tracking"
              className="hidden sm:flex items-center gap-1.5 relative"
              title="You have an active order"
            >
              {/* Pulse dot */}
              <span className="relative flex h-2 w-2 mr-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2c5f4a] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#114734]" />
              </span>
              <span
                className="text-[#114734] hover:text-[#2c5f4a] transition-colors uppercase"
                style={{
                  fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                }}
              >
                Track Order
              </span>
            </Link>
          )}

          <Link
            href="/wishlist"
            className="relative text-muted-foreground cursor-pointer hover:text-primary transition-colors flex items-center justify-center w-10 h-10"
            title="Wishlist"
          >
            <span className="material-symbols-outlined">favorite</span>
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="relative text-muted-foreground cursor-pointer hover:text-primary transition-colors flex items-center justify-center w-10 h-10"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-primary transition-colors">
                <span className="material-symbols-outlined">menu</span>
                <span className="sr-only">Toggle menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-6 flex flex-col h-full bg-card border-l border-border">
              <SheetHeader className="mb-6 text-left">
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2 text-foreground cursor-pointer">
                    <LogoIcon className="w-6 h-6" />
                    <div
                      className="font-semibold"
                      style={{
                        fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
                        fontSize: "13px",
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                      }}
                    >
                      ErgoZenix
                    </div>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 flex-1 mt-4">
                {[
                  { href: "/shop", label: "Shop" },
                  { href: "/wishlist", label: `Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ""}` },
                  { href: "/contact", label: "Contact" },
                  { href: "/about", label: "About" },
                ].map(({ href, label }) => (
                  <SheetClose key={href} asChild>
                    <Link
                      href={href}
                      className={cn(
                        "font-medium px-4 py-3 rounded-md transition-colors",
                        pathname === href ? "bg-muted text-primary" : "text-foreground hover:bg-muted"
                      )}
                      style={{
                        fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      {label}
                    </Link>
                  </SheetClose>
                ))}

                {/* Track Order in mobile menu */}
                {hasPendingOrder && (
                  <SheetClose asChild>
                    <Link
                      href="/order-tracking"
                      className="flex items-center gap-2 px-4 py-3 rounded-md bg-[#114734]/8 text-[#114734] hover:bg-[#114734]/15 transition-colors"
                      style={{
                        fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        fontSize: "13px",
                        fontWeight: 700,
                      }}
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2c5f4a] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#114734]" />
                      </span>
                      Track Order
                    </Link>
                  </SheetClose>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
