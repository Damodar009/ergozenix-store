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
    <div className="flex items-center gap-1 mb-4">
      <div className="flex" style={{ color: "var(--ef-primary)" }}>
        {stars}
      </div>
      {count > 0 && (
        <span
          className="font-[var(--font-hanken-grotesk)]"
          style={{
            fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "var(--ef-on-surface-variant)",
          }}
        >
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
      className="ef-product-card group overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: "var(--ef-surface-container-lowest)",
        border: "1px solid var(--ef-outline-variant)",
        borderRadius: "6px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--ef-primary)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--ef-outline-variant)"
      }}
    >
      {/* Image */}
      <Link href={`/products/${product.slug || product.id}`} className="block">
        <div
          className="relative aspect-[4/5] overflow-hidden"
          style={{ backgroundColor: "var(--ef-surface-container)" }}
        >
          <img
            alt={product.alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={product.imageUrl}
          />
          {/* Hover Add-to-Cart Overlay */}
          <div
            className="ef-add-to-cart absolute inset-x-0 bottom-0 py-4 text-center backdrop-blur-md"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
          >
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                addToCart(product.id, 1, [])
              }}
              className="cursor-pointer hover:underline"
              style={{
                fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "var(--ef-primary)",
                background: "none",
                border: "none",
              }}
            >
              Add to Cart — {formatPrice(displayPrice)}
            </button>
          </div>
        </div>
      </Link>

      {/* Card Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/products/${product.slug || product.id}`}>
            <h3
              className="hover:underline"
              style={{
                fontFamily: "var(--font-playfair-display), 'Playfair Display', serif",
                fontSize: "20px",
                lineHeight: "1.4",
                fontWeight: 500,
                color: "var(--ef-on-surface)",
              }}
            >
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-col items-end gap-0.5 shrink-0 ml-3">
            {hasSale ? (
              <>
                <span
                  style={{
                    fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "var(--ef-error)",
                  }}
                >
                  {formatPrice(product.salePrice!)}
                </span>
                <span
                className="line-through"
                  style={{
                    fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "var(--ef-on-surface-variant)",
                  }}
                >
                  {formatPrice(product.basePrice!)}
                </span>
              </>
            ) : (
              <span
                style={{
                  fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--ef-primary)",
                }}
              >
                {formatPrice(displayPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Star Rating */}
        <StarRating rating={product.averageRating} count={product.reviewCount} />

        {/* Description */}
        <p
          className="line-clamp-2"
          style={{
            fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
            fontSize: "15px",
            lineHeight: "1.6",
            fontWeight: 300,
            color: "var(--ef-secondary)",
          }}
        >
          {product.description}
        </p>
      </div>
    </div>
  )
}
