"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ProductService } from "@/services/product-service"
import type { ProductCard } from "@/models/product"
import { Star, ChevronRight } from "lucide-react"
import Link from "next/link"

export function FeaturedProducts() {
  const [products, setProducts] = useState<ProductCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        setLoading(true)
        const data = await ProductService.getFeaturedProducts(8)
        setProducts(data)
      } catch (err) {
        console.error('Failed to fetch featured products:', err)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const formatPrice = (price: number, salePrice?: number | null) => {
    const formatNumber = (num: number) => {
      return new Intl.NumberFormat('ne-NP', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num)
    }

    if (salePrice && salePrice < price) {
      return (
        <div className="flex flex-col">
          <span className="text-xl md:text-2xl font-semibold">Rs {formatNumber(salePrice)}</span>
          <span className="text-muted-foreground text-sm line-through">Rs {formatNumber(price)}</span>
        </div>
      )
    }

    return <span className="text-xl md:text-2xl font-semibold">Rs {formatNumber(price)}</span>
  }

  const renderRating = (rating?: number, count?: number) => {
    if (!rating || !count) return null

    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">({count})</span>
      </div>
    )
  }

  if (loading) {
    return (
      <section id="products" className="bg-secondary/30 py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground text-lg">Discover our top-rated ergonomic solutions</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="group overflow-hidden rounded-xl bg-card animate-pulse">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted" />
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="h-8 bg-muted rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="products" className="bg-secondary/30 py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground text-lg">Discover our top-rated ergonomic solutions</p>
          </div>
          <div className="text-center text-muted-foreground p-4">
            {error}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section id="products" className="bg-secondary/30 py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground text-lg">Discover our top-rated ergonomic solutions</p>
          </div>
          <div className="text-center text-muted-foreground p-4">
            No products available at the moment.
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="products" className="bg-secondary/30 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Featured Products</h2>
          <p className="text-muted-foreground text-lg">Discover our top-rated ergonomic solutions</p>
        </div>
        <div className={products.length === 1 ? "flex justify-center" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-4"}>
          {products.map((product) => {
            const productUrl = `/products/${product.slug || product.id}`

            return (
              <Link
                key={product.id}
                href={productUrl}
                className={`group block overflow-hidden rounded-xl bg-card transition-all hover:shadow-lg ${products.length === 1 ? "w-full max-w-md" : ""
                  }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {product.primary_image ? (
                    <img
                      src={product.primary_image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-muted transition-transform duration-300 group-hover:scale-105" />
                  )}
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    {product.brand_name && (
                      <p className="text-sm text-muted-foreground">{product.brand_name}</p>
                    )}
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                    )}
                    {renderRating(product.average_rating, product.review_count)}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      {formatPrice(product.base_price, product.sale_price)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      View <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}



