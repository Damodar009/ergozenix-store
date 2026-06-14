"use client"

import { useEffect, useState, useRef, use } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ProductService } from "@/services/product-service"
import { ReviewService } from "@/services/review-service"
import type { ProductWithDetails, ProductImage, ProductReview } from "@/models/product"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
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
  style,
}: {
  name: string
  filled?: boolean
  className?: string
  size?: number
  style?: React.CSSProperties
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: filled
          ? "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24"
          : undefined,
        fontSize: size ? `${size}px` : undefined,
        ...style,
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
  const { isWishlisted, toggleWishlist } = useWishlist()
  const [addingToCart, setAddingToCart] = useState(false)
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
      <Card className="transition-all bg-card border border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="font-label-caps text-label-caps text-foreground">
            Write a Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
            {/* Name field */}
            <div className="flex flex-col gap-2">
              <Label variant="ef-caps">Name</Label>
              <Input
                type="text"
                placeholder="Your full name"
                value={newReviewName}
                onChange={(e) => setNewReviewName(e.target.value)}
                required
                className="bg-background"
              />
            </div>

            {/* Email field */}
            <div className="flex flex-col gap-2">
              <Label variant="ef-caps">Email Address</Label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={newReviewEmail}
                onChange={(e) => setNewReviewEmail(e.target.value)}
                required
                className="bg-background"
              />
            </div>

            {/* Rating Selector */}
            <div className="flex flex-col gap-2">
              <Label variant="ef-caps">Rating</Label>
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
                      className={(newReviewHoverRating || newReviewRating) >= star ? "text-primary" : "text-border"}
                      size={20}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review text */}
            <div className="flex flex-col gap-2">
              <Label variant="ef-caps">Message</Label>
              <Textarea
                placeholder="Share your thoughts about this product..."
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                required
                rows={3}
                className="bg-background resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={submittingReview}
              size="ef"
              className="w-full mt-2"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </CardContent>
      </Card>
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
            className="font-label-caps text-label-caps text-muted-foreground hover:underline"
          >
            Products
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-label-caps text-label-caps text-primary">
            {product.name}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row" style={{ gap: "var(--ef-stack-lg)" }}>
          {/* ─── Left Column: Images (55%) ─── */}
          <div className="w-full lg:w-[55%] flex flex-col" style={{ gap: "var(--ef-stack-md)" }}>
            {/* Main Image */}
            <div className="aspect-[4/5] lg:aspect-auto lg:h-[calc(100vh-150px)] overflow-hidden bg-accent rounded-[6px] border border-border">
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
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <MIcon name="image" size={64} className="text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {sortedImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {sortedImages.map((img, idx) => (
                  <div
                    key={img.id}
                    className={`aspect-square overflow-hidden cursor-pointer transition-all bg-accent rounded-[2px] border ${idx === activeThumbIdx ? "border-primary" : "border-transparent hover:border-border"}`}
                    onClick={() => handleThumbClick(img, idx)}
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
            <div className="flex flex-col gap-[var(--ef-stack-sm)]">
              <h1 className="text-[40px] lg:text-[56px] font-headline-section leading-[1.1] tracking-[-0.02em] text-foreground">
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
                    <span className="font-body-main text-[13px] font-semibold text-primary">
                      {averageRating.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
                    </span>
                  </>
                ) : (
                  <span className="font-body-main text-[13px] font-light text-muted-foreground">
                    No reviews yet. Be the first to write one!
                  </span>
                )}
              </div>

              <p className="font-headline-section text-[20px] leading-[1.4] font-medium text-secondary">
                {product.sale_price && product.sale_price < product.base_price ? (
                  <>
                    <span>Rs. {product.sale_price.toLocaleString()}</span>
                    <span className="ml-3 line-through text-muted-foreground text-[16px]">
                      Rs. {product.base_price.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span>Rs. {product.base_price.toLocaleString()}</span>
                )}
              </p>
            </div>

            {/* Color Selector */}
            <div className="flex flex-col gap-[var(--ef-stack-sm)]">
              <span className="font-label-caps text-label-caps text-muted-foreground">
                Selected Color: {colorSwatches[selectedColor]?.name}
              </span>
              <div className="flex gap-[var(--ef-stack-sm)]">
                {colorSwatches.map((swatch, idx) => (
                  <button
                    key={swatch.hex}
                    className="w-8 h-8 rounded-full transition-all"
                    style={{
                      backgroundColor: swatch.hex,
                      border: idx === selectedColor
                        ? "2px solid hsl(var(--primary))"
                        : "1px solid hsl(var(--border))",
                      boxShadow: idx === selectedColor
                        ? "0 0 0 2px hsl(var(--background)), 0 0 0 4px transparent"
                        : undefined,
                    }}
                    onClick={() => setSelectedColor(idx)}
                  />
                ))}
              </div>
            </div>

            {/* Size / Variant Selector */}
            <div className="flex flex-col gap-[var(--ef-stack-sm)]">
              <span className="font-label-caps text-label-caps text-muted-foreground">
                Frame Size
              </span>
              <div className="flex gap-[var(--ef-stack-sm)]">
                {variants.length > 0 ? (
                  variants.map((variant, idx) => (
                    <button
                      key={variant.id}
                      className={`px-6 py-2 transition-all font-label-caps text-[12px] font-semibold tracking-[2px] rounded ${idx === selectedSize ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-foreground border-border border"}`}
                      onClick={() => setSelectedSize(idx)}
                    >
                      {variant.variant_sku || `Variant ${idx + 1}`}
                    </button>
                  ))
                ) : (
                  <>
                    <button
                      className={`px-6 py-2 transition-all font-label-caps text-[12px] font-semibold tracking-[2px] rounded ${selectedSize === 0 ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-foreground border-border border"}`}
                      onClick={() => setSelectedSize(0)}
                    >
                      STANDARD
                    </button>
                    <button
                      className={`px-6 py-2 transition-all font-label-caps text-[12px] font-semibold tracking-[2px] rounded ${selectedSize === 1 ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-foreground border-border border"}`}
                      onClick={() => setSelectedSize(1)}
                    >
                      EXTENDED
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col pt-4 gap-[var(--ef-stack-md)]">
              {/* Quantity Selector */}
              <div className="flex items-center w-fit border border-border rounded">
                <button
                  className="px-4 py-3 transition-colors text-foreground hover:text-primary"
                  onClick={() => updateQty(-1)}
                >
                  <MIcon name="remove" size={18} />
                </button>
                <span className="w-12 text-center font-body-main text-[15px] font-light">
                  {quantity}
                </span>
                <button
                  className="px-4 py-3 transition-colors text-foreground hover:text-primary"
                  onClick={() => updateQty(1)}
                >
                  <MIcon name="add" size={18} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                className="w-full flex items-center justify-center gap-2"
                size="ef"
                disabled={addingToCart}
                onClick={async () => {
                  setAddingToCart(true)
                  try {
                    await addToCart(product.id, quantity, [])
                  } catch (e) {
                    console.error(e)
                  } finally {
                    setAddingToCart(false)
                  }
                }}
              >
                {addingToCart ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-1"></span>
                    Adding...
                  </>
                ) : (
                  "Add to Cart"
                )}
              </Button>

              {/* Save to Wishlist Button */}
              <Button
                variant="outline"
                className="w-full font-label-caps tracking-[3px] cursor-pointer"
                size="ef"
                onClick={() => toggleWishlist(product.id, product.name)}
              >
                <MIcon
                  name="favorite"
                  size={18}
                  className="mr-2"
                  filled={isWishlisted(product.id)}
                  style={{ color: isWishlisted(product.id) ? "red" : undefined }}
                />
                {isWishlisted(product.id) ? "Saved to Wishlist" : "Save to Wishlist"}
              </Button>
            </div>

            {/* ─── Accordions ─── */}
            <div className="flex flex-col mt-4 border-t border-border">
              <Accordion type="multiple" className="w-full">
                {/* Product Description */}
                <AccordionItem value="description" className="border-b border-border">
                  <AccordionTrigger className="py-4 font-label-caps text-[12px] tracking-[2px] font-semibold text-foreground hover:no-underline">
                    Product Description
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="leading-relaxed text-muted-foreground font-body-main text-[15px] font-light">
                      {product.description || "No description available."}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Specifications */}
                <AccordionItem value="specifications" className="border-b border-border">
                  <AccordionTrigger className="py-4 font-label-caps text-[12px] tracking-[2px] font-semibold text-foreground hover:no-underline">
                    Specifications
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {specItems.length > 0 ? (
                        specItems.map((spec, idx) => (
                          <div
                            key={idx}
                            className={`flex justify-between pb-2 ${idx < specItems.length - 1 ? "border-b border-border" : ""}`}
                          >
                            <span className="font-label-caps text-[11px] tracking-[2px] font-semibold text-muted-foreground">
                              {spec.label}
                            </span>
                            <span className="font-body-main text-[15px] leading-[1.6] font-light text-foreground">
                              {spec.value}
                            </span>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex justify-between pb-2 border-b border-border">
                            <span className="font-label-caps text-[11px] tracking-[2px] font-semibold text-muted-foreground">
                              Stock
                            </span>
                            <span className="font-body-main text-[15px] leading-[1.6] font-light text-foreground">
                              {product.stock_quantity} available
                            </span>
                          </div>
                          <div className="flex justify-between pb-2">
                            <span className="font-label-caps text-[11px] tracking-[2px] font-semibold text-muted-foreground">
                              SKU
                            </span>
                            <span className="font-body-main text-[15px] leading-[1.6] font-light text-foreground">
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
          className="transition-all duration-700 opacity-0 translate-y-10 mt-[var(--ef-section-padding)] pt-[var(--ef-section-padding)] border-t border-border"
        >
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--ef-stack-lg)]">
              {/* Rating Summary */}
              <div className="lg:col-span-4 flex flex-col gap-[var(--ef-stack-md)]">
                <div className="flex flex-col gap-[var(--ef-stack-sm)]">
                  <h2 className="font-label-caps text-label-caps text-muted-foreground">
                    Reviews
                  </h2>
                  <div className="flex items-baseline gap-4">
                    <span className="text-[64px] font-headline-section leading-[1.1] font-normal text-primary">
                      {averageRating > 0 ? averageRating.toFixed(1) : "—"}
                    </span>
                    <div className="flex flex-col">
                      {averageRating > 0 && (
                        <StarRating rating={averageRating} className="text-primary" />
                      )}
                      <span className="font-body-main text-[15px] leading-[1.6] font-light text-muted-foreground">
                        Based on {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Write a Review Form */}
                {renderReviewForm()}
              </div>

              {/* Review Cards */}
              <div className="lg:col-span-8 flex flex-col gap-[var(--ef-stack-md)]">
                {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review: ProductReview) => (
                  <Card key={review.id} className="transition-all hover:border-primary">
                    <CardContent className="p-[var(--ef-stack-lg)]">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-label-caps text-label-caps text-foreground">
                            {review.full_name}
                          </p>
                          <p className="text-[12px] text-muted-foreground">
                            Verified Buyer •{" "}
                            {formatDistanceToNow(new Date(review.created_at), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        <div className="flex text-[16px] text-primary">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <MIcon
                              key={i}
                              name="star"
                              filled={i < review.rating}
                              className={
                                i < review.rating
                                  ? "text-primary"
                                  : "text-border"
                              }
                              size={16}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="italic font-body-main text-[15px] leading-[1.6] font-light text-foreground">
                        &ldquo;{review.review}&rdquo;
                      </p>
                    </CardContent>
                  </Card>
                ))}

                {reviewCount > 3 && (
                  <button
                    className="transition-all hover:underline font-label-caps text-[11px] tracking-[3px] font-semibold text-primary self-start"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                  >
                    {showAllReviews ? "Show less reviews" : `View all ${reviewCount} reviews`}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-[var(--ef-stack-lg)]">
              {/* Premium Empty State Column */}
              <div className="lg:col-span-5 flex flex-col gap-5 text-left py-6">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-secondary text-secondary-foreground">
                  <MIcon name="rate_review" size={28} className="text-secondary-foreground" />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="font-headline-section text-[32px] leading-[1.2] font-normal text-foreground">
                    Customer Reviews
                  </h2>
                  <p className="font-body-main text-[15px] font-light leading-[1.6] text-muted-foreground">
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
