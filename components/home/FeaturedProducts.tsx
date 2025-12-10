"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductService } from "@/services/product-service"
import type { ProductCard } from "@/models/product"
import { Star } from "lucide-react"
import Link from "next/link"

export function FeaturedProducts() {
  const [products, setProducts] = useState<ProductCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        setLoading(true)
        const data = await ProductService.getFeaturedProducts(6)
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
        <div className="flex items-center gap-2">
          <span className="text-primary text-lg font-semibold">Rs {formatNumber(salePrice)}</span>
          <span className="text-muted-foreground text-sm line-through">Rs {formatNumber(price)}</span>
        </div>
      )
    }

    return <span className="text-primary text-lg font-semibold">Rs {formatNumber(price)}</span>
  }

  const renderRating = (rating?: number, count?: number) => {
    if (!rating || !count) return null

    return (
      <div className="flex items-center gap-1 mt-2">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">({count})</span>
      </div>
    )
  }

  if (loading) {
    return (
      <section className="py-16 sm:py-24" id="products">
        <h2 className="text-foreground text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-8 text-center">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="flex flex-col gap-4 pb-3 bg-card rounded-xl shadow-sm border-none animate-pulse">
              <div className="w-full aspect-square bg-muted" />
              <CardContent className="p-4 flex flex-col flex-1 gap-2">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-6 bg-muted rounded w-1/4 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 sm:py-24" id="products">
        <h2 className="text-foreground text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-8 text-center">
          Featured Products
        </h2>
        <div className="text-center text-muted-foreground p-4">
          {error}
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-16 sm:py-24" id="products">
        <h2 className="text-foreground text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-8 text-center">
          Featured Products
        </h2>
        <div className="text-center text-muted-foreground p-4">
          No products available at the moment.
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 sm:py-24" id="products">
      <h2 className="text-foreground text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-8 text-center">
        Featured Products
      </h2>
      <div className={products.length === 1 ? "flex justify-center p-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4"}>
        {products.map((product) => {
          const productUrl = `/products/${product.slug || product.id}`
          
          return (
            <Link key={product.id} href={productUrl}>
              <Card
                className={`flex flex-col gap-4 pb-3 bg-card rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border-none cursor-pointer ${products.length === 1 ? 'w-full max-w-md' : ''}`}
              >
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover bg-muted"
                  style={product.primary_image ? { backgroundImage: `url("${product.primary_image}")` } : {}}
                  aria-label={product.name}
                />
                <CardContent className="p-4 flex flex-col flex-1">
                  <p className="text-card-foreground text-lg font-medium leading-normal">{product.name}</p>
                  {product.brand_name && (
                    <p className="text-muted-foreground text-xs font-normal leading-normal mt-1">
                      {product.brand_name}
                    </p>
                  )}
                  {product.description && (
                    <p className="text-muted-foreground text-sm font-normal leading-normal mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  {renderRating(product.average_rating, product.review_count)}
                  <div className="mt-2">
                    {formatPrice(product.base_price, product.sale_price)}
                  </div>
                  {product.stock_quantity > 0 ? (
                    <Button 
                      className="w-full mt-4 h-10 px-4 text-sm font-bold hover:opacity-90 bg-primary/20 text-primary"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        // TODO: Add to cart functionality
                        console.log('Add to cart:', product.id)
                      }}
                    >
                      Add to Cart
                    </Button>
                  ) : (
                    <Button disabled className="w-full mt-4 h-10 px-4 text-sm font-bold">
                      Out of Stock
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}



