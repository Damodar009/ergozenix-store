"use client"

import Link from "next/link"
import { useCart } from "@/context/cart-context"

export type ProductItem = {
  id: number | string
  name: string
  slug?: string | null
  description: string
  price: string | number
  basePrice?: number
  salePrice?: number | null
  imageUrl: string
  alt: string
  averageRating?: number
  reviewCount?: number
}

/* ─── Star Rating Display ─── */
function StarRating({ rating = 0, count = 0 }: { rating?: number; count?: number }) {
  const stars: React.ReactNode[] = []
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75
  const emptyAfter = 5 - fullStars - (hasHalf ? 1 : 0)

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span
        key={`full-${i}`}
        className="material-symbols-outlined"
        style={{ fontVariationSettings: "'FILL' 1", fontSize: "14px" }}
      >
        star
      </span>
    )
  }
  if (hasHalf) {
    stars.push(
      <span
        key="half"
        className="material-symbols-outlined"
        style={{ fontSize: "14px" }}
      >
        star_half
      </span>
    )
  }
  for (let i = 0; i < emptyAfter; i++) {
    stars.push(
      <span
        key={`empty-${i}`}
        className="material-symbols-outlined"
        style={{ fontSize: "14px" }}
      >
        star_outline
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1 mb-2">
      <div className="flex text-primary">
        {stars}
      </div>
      {count > 0 && (
        <span className="font-label-caps text-[10px] tracking-[2px] text-muted-foreground uppercase">
          ({count} {count === 1 ? "Review" : "Reviews"})
        </span>
      )}
    </div>
  )
}

export function ProductCard({ product }: { product: ProductItem }) {
  const { addToCart } = useCart()

  // Price Logic
  const hasSale = product.salePrice && product.salePrice < (product.basePrice || 0)
  const displayPrice = hasSale ? product.salePrice! : (product.basePrice || 0)
  const formatPrice = (p: number) => `Rs. ${p.toLocaleString()}`

  return (
    <div
      className="ef-product-card group overflow-hidden transition-all duration-300 bg-card border border-border rounded-[6px] max-w-[320px] hover:border-primary"
    >
      {/* Image */}
      <Link href={`/products/${product.slug || product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-accent">
          <img
            alt={product.alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={product.imageUrl}
          />
          {/* Hover Add-to-Cart Overlay */}
          <div className="ef-add-to-cart absolute inset-x-0 bottom-0 py-2.5 text-center backdrop-blur-md bg-white/80">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                addToCart(product.id, 1, [])
              }}
              className="cursor-pointer hover:underline font-label-caps text-[10px] tracking-[2px] uppercase text-primary bg-transparent border-none"
            >
              Add to Cart — {formatPrice(displayPrice)}
            </button>
          </div>
        </div>
      </Link>

      {/* Card Info */}
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <Link href={`/products/${product.slug || product.id}`}>
            <h3 className="hover:underline font-headline-card text-[15px] leading-snug text-foreground">
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-col items-end gap-0.5 shrink-0 ml-3">
            {hasSale ? (
              <>
                <span className="font-label-caps text-[12px] tracking-[2px] uppercase text-destructive font-bold">
                  {formatPrice(product.salePrice!)}
                </span>
                <span className="line-through font-label-caps text-[10px] text-muted-foreground">
                  {formatPrice(product.basePrice!)}
                </span>
              </>
            ) : (
              <span className="font-label-caps text-[12px] tracking-[2px] uppercase text-primary font-bold">
                {formatPrice(displayPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Star Rating */}
        <StarRating rating={product.averageRating} count={product.reviewCount} />

        {/* Description */}
        <p className="line-clamp-1 font-body-main text-[13px] font-light text-muted-foreground">
          {product.description}
        </p>
      </div>
    </div>
  )
}
