"use client"

import React, { useEffect, useState, useCallback } from "react"
import { ProductCard } from "@/components/shop/ProductCard"
import { Pagination } from "@/components/shop/Pagination"
import { ProductService } from "@/services/product-service"
import type { ProductCard as ProductCardType } from "@/models/product"

/* ═══════════════════════════════════════════════════════
   SHOP PAGE
   ═══════════════════════════════════════════════════════ */
export default function ShopPage() {
  // Data State
  const [products, setProducts] = useState<ProductCardType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination State
  const [page, setPage] = useState(1)
  const [limit] = useState(9)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await ProductService.getProducts(
        {},
        undefined,
        limit,
        (page - 1) * limit,
      )

      setProducts(data)
      // Estimate total pages (if we get a full page, there might be more)
      if (data.length < limit) {
        setTotalPages(page)
      } else {
        // At least one more page possible
        setTotalPages(page + 1)
      }
    } catch (err) {
      setError("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchProducts])

  return (
    <main className="pb-[var(--ef-section-padding)] bg-background text-foreground font-body-main">
      {/* ─── Page Title Section ─── */}
      <section className="py-12 px-8 md:px-12 lg:px-16 border-b border-border bg-card">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <span className="block mb-2 font-label-caps text-[11px] font-semibold tracking-[2px] uppercase text-muted-foreground">
              Collections
            </span>
            <h1 className="font-headline-section text-headline-section text-foreground">
              All Products
            </h1>
          </div>
          <div className="font-body-main text-[15px] font-light text-muted-foreground">
            {loading ? "Loading…" : `${products.length} product${products.length === 1 ? '' : 's'}`}
          </div>
        </div>
      </section>

      {/* ─── Product Grid / List ─── */}
      {loading ? (
        /* Loading Skeleton */
        <section
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[var(--ef-gutter)] gap-y-[var(--ef-stack-md)] px-8 md:px-12 lg:px-16 py-8"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden bg-card border border-border rounded-[6px] max-w-[320px]"
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
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined mb-4 text-[48px] text-destructive">
            error_outline
          </span>
          <p className="mb-2 font-headline-card text-[20px] font-medium text-foreground">
            Something went wrong
          </p>
          <p className="mb-4 font-body-main text-[15px] font-light text-muted-foreground">
            {error}
          </p>
          <button
            onClick={fetchProducts}
            className="cursor-pointer hover:underline font-label-caps text-[11px] font-semibold tracking-[2px] uppercase text-primary bg-transparent border-none"
          >
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined mb-4 text-[48px] text-muted-foreground">
            inventory_2
          </span>
          <p className="mb-2 font-headline-card text-[20px] font-medium text-foreground">
            No Products Found
          </p>
          <button
            onClick={fetchProducts}
            className="cursor-pointer hover:underline font-label-caps text-[11px] font-semibold tracking-[2px] uppercase text-primary bg-transparent border-none"
          >
            Reload Products
          </button>
        </div>
      ) : (
        <section
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[var(--ef-gutter)] gap-y-[var(--ef-stack-md)] px-8 md:px-12 lg:px-16 py-8"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                description: product.description || "",
                price: `Rs ${product.base_price}`,
                basePrice: product.base_price,
                salePrice: product.sale_price,
                imageUrl: product.primary_image || "https://via.placeholder.com/400x500",
                alt: product.name,
                slug: product.slug,
                averageRating: product.average_rating,
                reviewCount: product.review_count,
              }}
            />
          ))}
        </section>
      )}

      {/* ─── Pagination ─── */}
      {!loading && !error && products.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          loading={loading}
        />
      )}
    </main>
  )
}
