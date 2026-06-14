"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useWishlist } from "@/context/wishlist-context"
import { WishlistService, WishlistItem } from "@/services/wishlist-service"
import { retrieveId } from "@/lib/cookieUtils"
import { ProductCard, ProductItem } from "@/components/shop/ProductCard"

export default function WishlistPage() {
  const { wishlistIds } = useWishlist()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadWishlist() {
      const sessionId = retrieveId("session_id")
      if (!sessionId) {
        setLoading(false)
        return
      }

      try {
        const data = await WishlistService.getWishlist(sessionId)
        setWishlistItems(data)
      } catch (err) {
        console.error("Failed to load wishlist items:", err)
        setError("Failed to load your wishlist. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadWishlist()
  }, [])

  // Filter items in real time based on active wishlist context IDs
  const activeItems = wishlistItems.filter((item) => wishlistIds.has(item.product_id))

  return (
    <main className="pb-[var(--ef-section-padding)] bg-background text-foreground font-body-main min-h-[60vh]">
      {/* ─── Page Title Section ─── */}
      <section className="py-12 px-8 md:px-12 lg:px-16 border-b border-border bg-card">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <span className="block mb-2 font-label-caps text-[11px] font-semibold tracking-[2px] uppercase text-muted-foreground">
              Saved Items
            </span>
            <h1 className="font-headline-section text-headline-section text-foreground">
              My Wishlist
            </h1>
          </div>
          <div className="font-body-main text-[15px] font-light text-muted-foreground">
            {loading ? "Loading…" : `${activeItems.length} item${activeItems.length === 1 ? "" : "s"}`}
          </div>
        </div>
      </section>

      {/* ─── Main Content Grid ─── */}
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-8">
        {loading ? (
          /* Loading Skeleton */
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden bg-card border border-border rounded-[6px] max-w-[320px] mx-auto w-full"
              >
                <div className="aspect-square bg-muted" />
                <div className="p-3 space-y-2">
                  <div className="h-4 rounded bg-muted w-[70%]" />
                  <div className="h-3 rounded bg-muted w-[40%]" />
                  <div className="h-3 rounded bg-muted w-[100%]" />
                </div>
              </div>
            ))}
          </section>
        ) : error ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
            <span className="material-symbols-outlined mb-4 text-[48px] text-destructive">
              error_outline
            </span>
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/95 transition-all text-sm uppercase tracking-wider cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : activeItems.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
            <span className="material-symbols-outlined mb-4 text-[48px] text-muted-foreground animate-pulse">
              favorite
            </span>
            <h2 className="text-xl font-bold mb-2">Your Wishlist is Empty</h2>
            <p className="text-muted-foreground mb-6">
              Keep track of items you love by clicking the heart icon on any product page or card.
            </p>
            <Link
              href="/shop"
              className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/95 transition-all text-sm uppercase tracking-wider cursor-pointer"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Active Items Grid */
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeItems.map((item) => {
              // Map db product schema to format expected by ProductCard
              const mappedProduct: ProductItem = {
                id: item.product_id,
                name: item.product?.name || "Product Name",
                slug: item.product?.slug || "",
                description: item.product?.description || "",
                price: item.product?.sale_price || item.product?.base_price || 0,
                basePrice: item.product?.base_price || 0,
                salePrice: item.product?.sale_price || null,
                imageUrl: item.product?.primary_image || "/placeholder.png",
                alt: item.product?.name || "Product Image",
              }

              return (
                <div key={item.id} className="flex justify-center">
                  <ProductCard product={mappedProduct} />
                </div>
              )
            })}
          </section>
        )}
      </div>
    </main>
  )
}
