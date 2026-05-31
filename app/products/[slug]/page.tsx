"use client"

import { useEffect, useState, useRef, use } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ProductService } from "@/services/product-service"
import { ReviewService } from "@/services/review-service"
import type { ProductWithDetails, ProductImage, ProductReview } from "@/models/product"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { formatDistanceToNow } from "date-fns"

/* ─── Helper: Material Symbol Icon ─── */
function MIcon({
  name,
  filled = false,
  className = "",
  size,
}: {
  name: string
  filled?: boolean
  className?: string
  size?: number
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: filled
          ? "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24"
          : undefined,
        fontSize: size ? `${size}px` : undefined,
      }}
    >
      {name}
    </span>
  )
}

/* ─── Star Rating Component ─── */
function StarRating({
  rating,
  className = "",
}: {
  rating: number
  className?: string
}) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.25

  return (
    <div className={`flex ${className}`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <MIcon key={`full-${i}`} name="star" filled className="text-[var(--ef-primary)]" />
      ))}
      {hasHalf && (
        <MIcon name="star_half" filled className="text-[var(--ef-primary)]" />
      )}
    </div>
  )
}

const isVideoUrl = (url: string) => {
  if (!url) return false
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url)
}

/* ─── Main Page Component ─── */
export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [product, setProduct] = useState<ProductWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState<string>("")
  const [activeThumbIdx, setActiveThumbIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(0)
  const { addToCart } = useCart()
  const reviewsSectionRef = useRef<HTMLElement>(null)

  // Review Form & List States
  const [reviewsList, setReviewsList] = useState<ProductReview[]>([])
  const [newReviewRating, setNewReviewRating] = useState(5)
  const [newReviewHoverRating, setNewReviewHoverRating] = useState(0)
  const [newReviewName, setNewReviewName] = useState("")
  const [newReviewEmail, setNewReviewEmail] = useState("")
  const [newReviewText, setNewReviewText] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)

  useEffect(() => {
    if (product) {
      setReviewsList(product.reviews || [])
    }
  }, [product])

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReviewText.trim()) return

    setSubmittingReview(true)

    // Construct local review item
    const newReviewItem: ProductReview = {
      id: Date.now(),
      product_id: product?.id || 1,
      user_id: 1,
      full_name: newReviewName.trim() || "Anonymous User",
      phone_or_email: newReviewEmail.trim() || "anonymous@example.com",
      rating: newReviewRating,
      review: newReviewText.trim(),
      created_at: new Date().toISOString(),
      updated_at: "",
      deleted_at: null
    }

    try {
      if (product) {
        await ReviewService.createReview({
          product_id: product.id,
          user_id: 1,
          full_name: newReviewItem.full_name,
          phone_or_email: newReviewItem.phone_or_email,
          rating: newReviewItem.rating,
          review: newReviewItem.review ?? ""
        })
      }
    } catch (err) {
      console.warn("Could not write review to Supabase:", err)
    }

    // Always update visual local state
    setReviewsList((prev) => [newReviewItem, ...prev])

    // Reset states
    setNewReviewName("")
    setNewReviewEmail("")
    setNewReviewText("")
    setNewReviewRating(5)
    setSubmittingReview(false)
    alert("Thank you! Your review has been added.")
  }

  useEffect(() => {
    async function fetchProduct() {
      try {
        if (slug) {
          let data = await ProductService.getProductBySlug(slug)
          // Fallback to fetch by id if slug is numeric and not found by slug
          if (!data && !isNaN(Number(slug))) {
            data = await ProductService.getProductById(Number(slug))
          }
          setProduct(data)
          if (data?.images && data.images.length > 0) {
            const sortedImages = [...data.images].sort((a, b) => a.sort_order - b.sort_order)
            const primary = sortedImages.find((img) => img.is_primary) || sortedImages[0]
            setMainImage(primary.image_url)
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  // Scroll-reveal for reviews section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0")
            entry.target.classList.remove("opacity-0", "translate-y-10")
          }
        })
      },
      { threshold: 0.1 }
    )

    if (reviewsSectionRef.current) {
      observer.observe(reviewsSectionRef.current)
    }

    return () => observer.disconnect()
  }, [product])

  const handleThumbClick = (img: ProductImage, idx: number) => {
    setMainImage(img.image_url)
    setActiveThumbIdx(idx)
  }

  const updateQty = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  const renderReviewForm = () => {
    return (
      <div
        className="transition-all"
        style={{
          padding: "var(--ef-stack-md)",
          background: "var(--ef-surface-container-lowest)",
          border: "1px solid var(--ef-outline-variant)",
          borderRadius: "0.5rem",
        }}
      >
        <h3
          className="uppercase mb-3"
          style={{
            fontFamily: "var(--font-hanken-grotesk)",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "2px",
            color: "var(--ef-on-surface)",
          }}
        >
          Write a Review
        </h3>
        <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
          {/* Name field */}
          <div className="flex flex-col gap-1">
            <label
              className="uppercase"
              style={{
                fontFamily: "var(--font-hanken-grotesk)",
                fontSize: "10px",
                letterSpacing: "1px",
                fontWeight: 600,
                color: "var(--ef-on-surface-variant)",
              }}
            >
              Name
            </label>
            <input
              type="text"
              placeholder="Your full name"
              value={newReviewName}
              onChange={(e) => setNewReviewName(e.target.value)}
              required
              className="w-full px-3 py-1.5 bg-transparent text-sm transition-all focus:outline-none"
              style={{
                border: "1px solid var(--ef-outline-variant)",
                borderRadius: "0.25rem",
                fontFamily: "var(--font-hanken-grotesk)",
                color: "var(--ef-on-surface)",
              }}
            />
          </div>

          {/* Email field */}
          <div className="flex flex-col gap-1">
            <label
              className="uppercase"
              style={{
                fontFamily: "var(--font-hanken-grotesk)",
                fontSize: "10px",
                letterSpacing: "1px",
                fontWeight: 600,
                color: "var(--ef-on-surface-variant)",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={newReviewEmail}
              onChange={(e) => setNewReviewEmail(e.target.value)}
              required
              className="w-full px-3 py-1.5 bg-transparent text-sm transition-all focus:outline-none"
              style={{
                border: "1px solid var(--ef-outline-variant)",
                borderRadius: "0.25rem",
                fontFamily: "var(--font-hanken-grotesk)",
                color: "var(--ef-on-surface)",
              }}
            />
          </div>

          {/* Rating Selector */}
          <div className="flex flex-col gap-1">
            <label
              className="uppercase"
              style={{
                fontFamily: "var(--font-hanken-grotesk)",
                fontSize: "10px",
                letterSpacing: "1px",
                fontWeight: 600,
                color: "var(--ef-on-surface-variant)",
              }}
            >
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-transform hover:scale-110"
                  onMouseEnter={() => setNewReviewHoverRating(star)}
                  onMouseLeave={() => setNewReviewHoverRating(0)}
                  onClick={() => setNewReviewRating(star)}
                >
                  <MIcon
                    name="star"
                    filled={(newReviewHoverRating || newReviewRating) >= star}
                    className={(newReviewHoverRating || newReviewRating) >= star ? "text-[var(--ef-primary)]" : "text-[var(--ef-outline-variant)]"}
                    size={20}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review text */}
          <div className="flex flex-col gap-1">
            <label
              className="uppercase"
              style={{
                fontFamily: "var(--font-hanken-grotesk)",
                fontSize: "10px",
                letterSpacing: "1px",
                fontWeight: 600,
                color: "var(--ef-on-surface-variant)",
              }}
            >
              Message
            </label>
            <textarea
              placeholder="Share your thoughts about this product..."
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-1.5 bg-transparent text-sm transition-all focus:outline-none resize-none"
              style={{
                border: "1px solid var(--ef-outline-variant)",
                borderRadius: "0.25rem",
                fontFamily: "var(--font-hanken-grotesk)",
                color: "var(--ef-on-surface)",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submittingReview}
            className="w-full py-2 uppercase transition-colors duration-300 mt-1 text-xs font-semibold tracking-wider"
            style={{
              borderRadius: "0.25rem",
              backgroundColor: "var(--ef-primary-container)",
              color: "var(--ef-on-secondary)",
              fontFamily: "var(--font-hanken-grotesk)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--ef-primary)")
            }
            onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor =
              "var(--ef-primary-container)")
            }
          >
            {submittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    )
  }

  /* ─── Loading State ─── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--ef-background)" }}>
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: "var(--ef-primary)" }}
          />
          <p className="mt-4" style={{ color: "var(--ef-on-surface-variant)", fontFamily: "var(--font-hanken-grotesk)" }}>
            Loading product...
          </p>
        </div>
      </div>
    )
  }

  /* ─── Not Found State ─── */
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--ef-background)" }}>
        <div className="text-center">
          <h1
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--ef-on-surface)", fontFamily: "var(--font-playfair-display)" }}
          >
            Product Not Found
          </h1>
          <Link href="/shop">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  /* ─── Data Preparation ─── */
  const sortedImages = [...(product.images || [])].sort((a, b) => a.sort_order - b.sort_order)
  const reviews = reviewsList
  const averageRating = reviewsList.length > 0
    ? reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length
    : 0
  const reviewCount = reviewsList.length

  const categoryName = product.category?.name || "Products"

  // Extract attribute specs for the Specifications accordion
  const specItems = product.attributes?.map((attr) => ({
    label: attr.attribute?.name || "Spec",
    value: attr.value_text || (attr.value_number != null ? String(attr.value_number) : "—"),
  })) || []

  // Variant sizes (if available)
  const variants = product.variants || []

  // Color swatches (from the reference design - using static colors as placeholder)
  const colorSwatches = [
    { hex: "#114734", name: "Forest Green" },
    { hex: "#403e3a", name: "Charcoal" },
    { hex: "#e4e2df", name: "Natural" },
  ]

  return (
    <div
      className="min-h-screen ef-scrollbar"
      style={{
        background: "var(--ef-background)",
        color: "var(--ef-on-surface)",
        fontFamily: "var(--font-hanken-grotesk)",
      }}
    >
      {/* Main Content */}
      <main
        className="mx-auto"
        style={{
          maxWidth: "var(--ef-container-max)",
          padding: `var(--ef-section-padding) var(--ef-container-padding-x)`,
        }}
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-5">
          <Link
            href="/shop"
            className="uppercase hover:underline"
            style={{
              fontFamily: "var(--font-hanken-grotesk)",
              fontSize: "11px",
              lineHeight: "1",
              letterSpacing: "2px",
              fontWeight: 600,
              color: "var(--ef-on-surface-variant)",
            }}
          >
            Products
          </Link>
          <span style={{ color: "var(--ef-on-surface-variant)" }}>/</span>
          <span
            className="uppercase"
            style={{
              fontFamily: "var(--font-hanken-grotesk)",
              fontSize: "11px",
              lineHeight: "1",
              letterSpacing: "2px",
              fontWeight: 600,
              color: "var(--ef-primary)",
            }}
          >
            {product.name}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row" style={{ gap: "var(--ef-stack-lg)" }}>
          {/* ─── Left Column: Images (55%) ─── */}
          <div className="w-full lg:w-[55%] flex flex-col" style={{ gap: "var(--ef-stack-md)" }}>
            {/* Main Image */}
            <div
              className="aspect-[4/5] lg:aspect-auto lg:h-[calc(100vh-150px)] overflow-hidden"
              style={{
                background: "var(--ef-surface-container-low)",
                borderRadius: "0.25rem",
                border: "1px solid var(--ef-outline-variant)",
              }}
            >
              {mainImage ? (
                isVideoUrl(mainImage) ? (
                  <video
                    src={mainImage}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    style={{ mixBlendMode: "multiply" }}
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <MIcon name="image" size={64} className="text-[var(--ef-outline-variant)]" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {sortedImages.length > 0 && (
              <div className="grid grid-cols-4" style={{ gap: "var(--ef-stack-sm)" }}>
                {sortedImages.map((img, idx) => (
                  <div
                    key={img.id}
                    className={`aspect-square overflow-hidden cursor-pointer transition-all ${idx === activeThumbIdx ? "ef-active-thumb" : ""
                      }`}
                    style={{
                      background: "var(--ef-surface-container)",
                      borderRadius: "0.125rem",
                      border: idx === activeThumbIdx
                        ? "1px solid var(--ef-primary)"
                        : "1px solid transparent",
                    }}
                    onClick={() => handleThumbClick(img, idx)}
                    onMouseEnter={(e) => {
                      if (idx !== activeThumbIdx) {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--ef-outline)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (idx !== activeThumbIdx) {
                        (e.currentTarget as HTMLElement).style.borderColor = "transparent"
                      }
                    }}
                  >
                    {isVideoUrl(img.image_url) ? (
                      <div className="relative w-full h-full">
                        <video
                          src={img.image_url}
                          muted
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <MIcon name="play_circle" size={24} className="text-white opacity-80" />
                        </div>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img.image_url}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── Right Column: Info (45%) ─── */}
          <div
            className="w-full lg:w-[45%] lg:sticky lg:top-[96px] h-fit flex flex-col"
            style={{ gap: "var(--ef-stack-lg)" }}
          >
            {/* Title & Price */}
            <div className="flex flex-col" style={{ gap: "var(--ef-stack-sm)" }}>
              <h1
                className="text-[40px] lg:text-[56px]"
                style={{
                  fontFamily: "var(--font-playfair-display)",
                  lineHeight: "1.1",
                  letterSpacing: "-0.02em",
                  fontWeight: 400,
                  color: "var(--ef-on-surface)",
                }}
              >
                {product.name}
              </h1>

              {/* Rating block */}
              <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity mb-2"
                onClick={() => {
                  reviewsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {averageRating > 0 ? (
                  <>
                    <StarRating rating={averageRating} />
                    <span
                      style={{
                        fontFamily: "var(--font-hanken-grotesk)",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--ef-primary)",
                      }}
                    >
                      {averageRating.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
                    </span>
                  </>
                ) : (
                  <span
                    style={{
                      fontFamily: "var(--font-hanken-grotesk)",
                      fontSize: "13px",
                      fontWeight: 300,
                      color: "var(--ef-on-surface-variant)",
                    }}
                  >
                    No reviews yet. Be the first to write one!
                  </span>
                )}
              </div>

              <p
                style={{
                  fontFamily: "var(--font-playfair-display)",
                  fontSize: "20px",
                  lineHeight: "1.4",
                  fontWeight: 500,
                  color: "var(--ef-secondary)",
                }}
              >
                {product.sale_price && product.sale_price < product.base_price ? (
                  <>
                    <span>Rs. {product.sale_price.toLocaleString()}</span>
                    <span
                      className="ml-3 line-through"
                      style={{ color: "var(--ef-outline)", fontSize: "16px" }}
                    >
                      Rs. {product.base_price.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span>Rs. {product.base_price.toLocaleString()}</span>
                )}
              </p>
            </div>

            {/* Color Selector */}
            <div className="flex flex-col" style={{ gap: "var(--ef-stack-sm)" }}>
              <span
                className="uppercase"
                style={{
                  fontFamily: "var(--font-hanken-grotesk)",
                  fontSize: "11px",
                  lineHeight: "1",
                  letterSpacing: "2px",
                  fontWeight: 600,
                  color: "var(--ef-on-surface-variant)",
                }}
              >
                Selected Color: {colorSwatches[selectedColor]?.name}
              </span>
              <div className="flex" style={{ gap: "var(--ef-stack-sm)" }}>
                {colorSwatches.map((swatch, idx) => (
                  <button
                    key={swatch.hex}
                    className="w-8 h-8 rounded-full transition-all"
                    style={{
                      backgroundColor: swatch.hex,
                      border:
                        idx === selectedColor
                          ? "2px solid var(--ef-primary)"
                          : "1px solid var(--ef-outline-variant)",
                      boxShadow:
                        idx === selectedColor
                          ? "0 0 0 2px var(--ef-surface), 0 0 0 4px transparent"
                          : undefined,
                    }}
                    onClick={() => setSelectedColor(idx)}
                  />
                ))}
              </div>
            </div>

            {/* Size / Variant Selector */}
            <div className="flex flex-col" style={{ gap: "var(--ef-stack-sm)" }}>
              <span
                className="uppercase"
                style={{
                  fontFamily: "var(--font-hanken-grotesk)",
                  fontSize: "11px",
                  lineHeight: "1",
                  letterSpacing: "2px",
                  fontWeight: 600,
                  color: "var(--ef-on-surface-variant)",
                }}
              >
                Frame Size
              </span>
              <div className="flex" style={{ gap: "var(--ef-stack-sm)" }}>
                {variants.length > 0 ? (
                  variants.map((variant, idx) => (
                    <button
                      key={variant.id}
                      className="px-6 py-2 transition-all uppercase"
                      style={{
                        borderRadius: "0.25rem",
                        fontFamily: "var(--font-hanken-grotesk)",
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "2px",
                        border:
                          idx === selectedSize
                            ? "1px solid var(--ef-primary)"
                            : "1px solid var(--ef-outline-variant)",
                        backgroundColor:
                          idx === selectedSize
                            ? "var(--ef-primary-container)"
                            : "transparent",
                        color:
                          idx === selectedSize
                            ? "var(--ef-on-primary-container)"
                            : "var(--ef-on-surface)",
                      }}
                      onClick={() => setSelectedSize(idx)}
                    >
                      {variant.variant_sku || `Variant ${idx + 1}`}
                    </button>
                  ))
                ) : (
                  <>
                    <button
                      className="px-6 py-2 transition-all uppercase"
                      style={{
                        borderRadius: "0.25rem",
                        fontFamily: "var(--font-hanken-grotesk)",
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "2px",
                        border:
                          selectedSize === 0
                            ? "1px solid var(--ef-primary)"
                            : "1px solid var(--ef-outline-variant)",
                        backgroundColor:
                          selectedSize === 0 ? "var(--ef-primary-container)" : "transparent",
                        color:
                          selectedSize === 0
                            ? "var(--ef-on-primary-container)"
                            : "var(--ef-on-surface)",
                      }}
                      onClick={() => setSelectedSize(0)}
                    >
                      STANDARD
                    </button>
                    <button
                      className="px-6 py-2 transition-all uppercase"
                      style={{
                        borderRadius: "0.25rem",
                        fontFamily: "var(--font-hanken-grotesk)",
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "2px",
                        border:
                          selectedSize === 1
                            ? "1px solid var(--ef-primary)"
                            : "1px solid var(--ef-outline-variant)",
                        backgroundColor:
                          selectedSize === 1 ? "var(--ef-primary-container)" : "transparent",
                        color:
                          selectedSize === 1
                            ? "var(--ef-on-primary-container)"
                            : "var(--ef-on-surface)",
                      }}
                      onClick={() => setSelectedSize(1)}
                    >
                      EXTENDED
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col pt-4" style={{ gap: "var(--ef-stack-md)" }}>
              {/* Quantity Selector */}
              <div
                className="flex items-center w-fit"
                style={{
                  border: "1px solid var(--ef-outline-variant)",
                  borderRadius: "0.25rem",
                }}
              >
                <button
                  className="px-4 py-3 transition-colors"
                  style={{ color: "var(--ef-on-surface)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "var(--ef-primary)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "var(--ef-on-surface)")
                  }
                  onClick={() => updateQty(-1)}
                >
                  <MIcon name="remove" size={18} />
                </button>
                <span
                  className="w-12 text-center"
                  style={{
                    fontFamily: "var(--font-hanken-grotesk)",
                    fontSize: "15px",
                    fontWeight: 300,
                  }}
                >
                  {quantity}
                </span>
                <button
                  className="px-4 py-3 transition-colors"
                  style={{ color: "var(--ef-on-surface)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "var(--ef-primary)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "var(--ef-on-surface)")
                  }
                  onClick={() => updateQty(1)}
                >
                  <MIcon name="add" size={18} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                className="w-full py-4 uppercase transition-colors duration-300"
                style={{
                  borderRadius: "0.25rem",
                  backgroundColor: "var(--ef-primary-container)",
                  color: "var(--ef-on-secondary)",
                  fontFamily: "var(--font-hanken-grotesk)",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "3px",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--ef-primary)")
                }
                onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  "var(--ef-primary-container)")
                }
                onClick={() => addToCart(product.id, quantity, [])}
              >
                Add to Cart
              </button>

              {/* Save to Wishlist Button */}
              <button
                className="w-full py-4 uppercase transition-colors duration-300 flex items-center justify-center gap-2"
                style={{
                  borderRadius: "0.25rem",
                  border: "1px solid var(--ef-outline-variant)",
                  color: "var(--ef-on-surface)",
                  fontFamily: "var(--font-hanken-grotesk)",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "3px",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = "var(--ef-primary)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = "var(--ef-outline-variant)")
                }
              >
                <MIcon name="favorite" size={18} />
                Save to Wishlist
              </button>
            </div>

            {/* ─── Accordions ─── */}
            <div
              className="flex flex-col mt-4"
              style={{ borderTop: "1px solid var(--ef-outline-variant)" }}
            >
              <Accordion type="multiple" className="w-full">
                {/* Product Description */}
                <AccordionItem
                  value="description"
                  className="border-b"
                  style={{ borderColor: "var(--ef-outline-variant)" }}
                >
                  <AccordionTrigger
                    className="py-4 uppercase hover:no-underline"
                    style={{
                      fontFamily: "var(--font-hanken-grotesk)",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "2px",
                      color: "var(--ef-on-surface)",
                    }}
                  >
                    Product Description
                  </AccordionTrigger>
                  <AccordionContent>
                    <div
                      className="leading-relaxed"
                      style={{
                        color: "var(--ef-on-surface-variant)",
                        fontFamily: "var(--font-hanken-grotesk)",
                        fontSize: "15px",
                        fontWeight: 300,
                        lineHeight: "1.6",
                      }}
                    >
                      {product.description || "No description available."}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Specifications */}
                <AccordionItem
                  value="specifications"
                  className="border-b"
                  style={{ borderColor: "var(--ef-outline-variant)" }}
                >
                  <AccordionTrigger
                    className="py-4 uppercase hover:no-underline"
                    style={{
                      fontFamily: "var(--font-hanken-grotesk)",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "2px",
                      color: "var(--ef-on-surface)",
                    }}
                  >
                    Specifications
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {specItems.length > 0 ? (
                        specItems.map((spec, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between pb-2"
                            style={{
                              borderBottom:
                                idx < specItems.length - 1
                                  ? "1px solid var(--ef-outline-variant)"
                                  : "none",
                            }}
                          >
                            <span
                              className="uppercase"
                              style={{
                                fontFamily: "var(--font-hanken-grotesk)",
                                fontSize: "11px",
                                lineHeight: "1",
                                letterSpacing: "2px",
                                fontWeight: 600,
                                color: "var(--ef-on-surface-variant)",
                              }}
                            >
                              {spec.label}
                            </span>
                            <span
                              style={{
                                fontFamily: "var(--font-hanken-grotesk)",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                fontWeight: 300,
                              }}
                            >
                              {spec.value}
                            </span>
                          </div>
                        ))
                      ) : (
                        <>
                          <div
                            className="flex justify-between pb-2"
                            style={{ borderBottom: "1px solid var(--ef-outline-variant)" }}
                          >
                            <span
                              className="uppercase"
                              style={{
                                fontFamily: "var(--font-hanken-grotesk)",
                                fontSize: "11px",
                                lineHeight: "1",
                                letterSpacing: "2px",
                                fontWeight: 600,
                                color: "var(--ef-on-surface-variant)",
                              }}
                            >
                              Stock
                            </span>
                            <span
                              style={{
                                fontFamily: "var(--font-hanken-grotesk)",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                fontWeight: 300,
                              }}
                            >
                              {product.stock_quantity} available
                            </span>
                          </div>
                          <div className="flex justify-between pb-2">
                            <span
                              className="uppercase"
                              style={{
                                fontFamily: "var(--font-hanken-grotesk)",
                                fontSize: "11px",
                                lineHeight: "1",
                                letterSpacing: "2px",
                                fontWeight: 600,
                                color: "var(--ef-on-surface-variant)",
                              }}
                            >
                              SKU
                            </span>
                            <span
                              style={{
                                fontFamily: "var(--font-hanken-grotesk)",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                fontWeight: 300,
                              }}
                            >
                              {product.sku || "—"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        {/* ─── Reviews Section Below Fold ─── */}
        <section
          ref={reviewsSectionRef}
          className="transition-all duration-700 opacity-0 translate-y-10"
          style={{
            marginTop: "var(--ef-section-padding)",
            paddingTop: "var(--ef-section-padding)",
            borderTop: "1px solid var(--ef-outline-variant)",
          }}
        >
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: "var(--ef-stack-lg)" }}>
              {/* Rating Summary */}
              <div className="lg:col-span-4 flex flex-col" style={{ gap: "var(--ef-stack-md)" }}>
                <div className="flex flex-col" style={{ gap: "var(--ef-stack-sm)" }}>
                  <h2
                    className="uppercase"
                    style={{
                      fontFamily: "var(--font-hanken-grotesk)",
                      fontSize: "11px",
                      lineHeight: "1",
                      letterSpacing: "2px",
                      fontWeight: 600,
                      color: "var(--ef-on-surface-variant)",
                    }}
                  >
                    Reviews
                  </h2>
                  <div className="flex items-baseline gap-4">
                    <span
                      className="text-[64px]"
                      style={{
                        fontFamily: "var(--font-playfair-display)",
                        lineHeight: "1.1",
                        fontWeight: 400,
                        color: "var(--ef-primary)",
                      }}
                    >
                      {averageRating > 0 ? averageRating.toFixed(1) : "—"}
                    </span>
                    <div className="flex flex-col">
                      {averageRating > 0 && (
                        <StarRating rating={averageRating} className="text-[var(--ef-primary)]" />
                      )}
                      <span
                        style={{
                          fontFamily: "var(--font-hanken-grotesk)",
                          fontSize: "15px",
                          lineHeight: "1.6",
                          fontWeight: 300,
                          color: "var(--ef-on-surface-variant)",
                        }}
                      >
                        Based on {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Write a Review Form */}
                {renderReviewForm()}
              </div>

              {/* Review Cards */}
              <div className="lg:col-span-8" style={{ display: "flex", flexDirection: "column", gap: "var(--ef-stack-md)" }}>
                {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review: ProductReview) => (
                  <div
                    key={review.id}
                    className="transition-all"
                    style={{
                      padding: "var(--ef-stack-lg)",
                      background: "var(--ef-surface-container-lowest)",
                      border: "1px solid var(--ef-outline-variant)",
                      borderRadius: "0.5rem",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.borderColor = "var(--ef-primary)")
                    }
                    onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor =
                      "var(--ef-outline-variant)")
                    }
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p
                          className="uppercase"
                          style={{
                            fontFamily: "var(--font-hanken-grotesk)",
                            fontSize: "13px",
                            fontWeight: 600,
                            letterSpacing: "2px",
                            color: "var(--ef-on-surface)",
                          }}
                        >
                          {review.full_name}
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "var(--ef-on-surface-variant)",
                          }}
                        >
                          Verified Buyer •{" "}
                          {formatDistanceToNow(new Date(review.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <div className="flex text-[16px]" style={{ color: "var(--ef-primary)" }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <MIcon
                            key={i}
                            name="star"
                            filled={i < review.rating}
                            className={
                              i < review.rating
                                ? "text-[var(--ef-primary)]"
                                : "text-[var(--ef-outline-variant)]"
                            }
                            size={16}
                          />
                        ))}
                      </div>
                    </div>
                    <p
                      className="italic"
                      style={{
                        fontFamily: "var(--font-hanken-grotesk)",
                        fontSize: "15px",
                        lineHeight: "1.6",
                        fontWeight: 300,
                        color: "var(--ef-on-surface)",
                      }}
                    >
                      &ldquo;{review.review}&rdquo;
                    </p>
                  </div>
                ))}

                {reviewCount > 3 && (
                  <button
                    className="transition-all hover:underline uppercase self-start"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    style={{
                      fontFamily: "var(--font-hanken-grotesk)",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "3px",
                      color: "var(--ef-primary)",
                    }}
                  >
                    {showAllReviews ? "Show less reviews" : `View all ${reviewCount} reviews`}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center" style={{ gap: "var(--ef-stack-lg)" }}>
              {/* Premium Empty State Column */}
              <div className="lg:col-span-5 flex flex-col gap-5 text-left py-6">
                <div
                  className="flex items-center justify-center w-14 h-14 rounded-full"
                  style={{
                    background: "var(--ef-surface-container-low)",
                    border: "1px solid var(--ef-outline-variant)",
                  }}
                >
                  <MIcon name="rate_review" size={28} className="text-[var(--ef-primary)]" />
                </div>
                <div className="flex flex-col gap-2">
                  <h2
                    style={{
                      fontFamily: "var(--font-playfair-display)",
                      fontSize: "32px",
                      lineHeight: "1.2",
                      color: "var(--ef-on-surface)",
                    }}
                  >
                    Customer Reviews
                  </h2>
                  <p
                    style={{
                      fontFamily: "var(--font-hanken-grotesk)",
                      fontSize: "15px",
                      fontWeight: 300,
                      lineHeight: "1.6",
                      color: "var(--ef-on-surface-variant)",
                    }}
                  >
                    There are no reviews for this product yet. Share your experience to help other buyers make informed choices and let us know what you think!
                  </p>
                </div>
              </div>

              {/* Form Column */}
              <div className="lg:col-span-7">
                {renderReviewForm()}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
