"use client"

import React, { useEffect, useState, useCallback, useRef } from "react"
import { ProductCard } from "@/components/shop/ProductCard"
import { Pagination } from "@/components/shop/Pagination"
import { ProductService } from "@/services/product-service"
import type { ProductCard as ProductCardType } from "@/models/product"
import { Category } from "@/components/shop/CategoryList"

/* ─── Helper: Material Icon ─── */
function MIcon({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`} style={{ fontSize: `${size}px` }}>
      {name}
    </span>
  )
}

/* ─── Filter Dropdown Button ─── */
function FilterDropdown({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors"
        style={{
          border: "1px solid var(--ef-outline-variant)",
          backgroundColor: "var(--ef-surface-container-lowest)",
          color: "var(--ef-on-surface)",
          fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "2px",
          textTransform: "uppercase" as const,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ef-surface-container)" }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--ef-surface-container-lowest)" }}
      >
        {label}
        <MIcon name="keyboard_arrow_down" size={16} />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-50 min-w-[200px] shadow-lg"
          style={{
            backgroundColor: "var(--ef-surface-container-lowest)",
            border: "1px solid var(--ef-outline-variant)",
            borderRadius: "4px",
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

/* ─── Filter Option Item ─── */
function FilterOption({
  label,
  active,
  onClick,
}: {
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2.5 transition-colors cursor-pointer"
      style={{
        fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
        fontSize: "13px",
        fontWeight: active ? 600 : 300,
        color: active ? "var(--ef-primary)" : "var(--ef-on-surface)",
        backgroundColor: active ? "var(--ef-primary-fixed)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = "var(--ef-surface-container)"
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = "transparent"
      }}
    >
      {label}
    </button>
  )
}

/* ─── Price Range Options ─── */
const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: 150000 },
  { label: "Under Rs 5,000", min: 0, max: 5000 },
  { label: "Rs 5,000 – Rs 15,000", min: 5000, max: 15000 },
  { label: "Rs 15,000 – Rs 50,000", min: 15000, max: 50000 },
  { label: "Rs 50,000 – Rs 100,000", min: 50000, max: 100000 },
  { label: "Over Rs 100,000", min: 100000, max: 150000 },
]

/* ─── Sort Options ─── */
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A-Z", value: "name-asc" },
]

/* ═══════════════════════════════════════════════════════
   SHOP PAGE
   ═══════════════════════════════════════════════════════ */
export default function ShopPage() {
  // Data State
  const [products, setProducts] = useState<ProductCardType[]>([])
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedPriceRange, setSelectedPriceRange] = useState(0) // index into PRICE_RANGES
  const [sortBy, setSortBy] = useState("newest")



  // Pagination State
  const [page, setPage] = useState(1)
  const [limit] = useState(9)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch Categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await ProductService.getAllCategories()
        setCategories(cats.map(c => ({ id: c.id, name: c.name })))
      } catch (err) {
        console.error("Failed to load categories")
      }
    }
    fetchCategories()
  }, [])

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Parse sort option
      let sortOption: { field: 'name' | 'base_price' | 'created_at' | 'updated_at'; ascending: boolean } | undefined

      if (sortBy === "price-asc") {
        sortOption = { field: "base_price", ascending: true }
      } else if (sortBy === "price-desc") {
        sortOption = { field: "base_price", ascending: false }
      } else if (sortBy === "name-asc") {
        sortOption = { field: "name", ascending: true }
      } else {
        sortOption = undefined // newest — default created_at desc
      }

      const priceRange = PRICE_RANGES[selectedPriceRange]

      const data = await ProductService.getProducts(
        {
          category_id: selectedCategory || undefined,
          min_price: priceRange.min,
          max_price: priceRange.max,
          in_stock: undefined,
        },
        sortOption,
        limit,
        (page - 1) * limit,
      )

      setProducts(data)
      // Estimate total pages (if we get a full page, there might be more)
      if (data.length < limit) {
        setTotalPages(page)
        setTotalCount((page - 1) * limit + data.length)
      } else {
        // At least one more page possible
        setTotalPages(page + 1)
        setTotalCount(page * limit + 1) // approximate
      }
    } catch (err) {
      setError("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, selectedPriceRange, sortBy, page, limit])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchProducts])

  // Handlers
  const handleCategoryChange = (id: number | null) => {
    setSelectedCategory(id)
    setPage(1)
  }

  const handlePriceChange = (index: number) => {
    setSelectedPriceRange(index)
    setPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setPage(1)
  }

  // Derive category name for header
  const selectedCatName = selectedCategory
    ? categories.find(c => c.id === selectedCategory)?.name || "Products"
    : "All Products"

  return (
    <main
      className="pb-[var(--ef-section-padding)]"
      style={{
        backgroundColor: "var(--ef-surface)",
        color: "var(--ef-on-surface)",
        fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
      }}
    >
      {/* ─── Page Title Section ─── */}
      {/* <section
        className="py-[var(--ef-stack-lg)] px-8 md:px-12 lg:px-16"
        style={{
          borderBottom: "1px solid var(--ef-outline-variant)",
          backgroundColor: "var(--ef-surface-container-lowest)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-[var(--ef-stack-sm)]">
          <div>
            <span
              className="block mb-2"
              style={{
                fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "var(--ef-secondary)",
              }}
            >
              Collections
            </span>
            <h1
              style={{
                fontFamily: "var(--font-playfair-display), 'Playfair Display', serif",
                fontSize: "clamp(32px, 4vw, 40px)",
                lineHeight: "1.2",
                fontWeight: 400,
                color: "var(--ef-on-surface)",
              }}
            >
              {selectedCatName}
            </h1>
          </div>
          <div
            style={{
              fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
              fontSize: "15px",
              lineHeight: "1.6",
              fontWeight: 300,
              color: "var(--ef-on-surface-variant)",
            }}
          >
            {loading ? "Loading…" : `${products.length} products`}
          </div>
        </div>
      </section> */}

      {/* ─── Filter Bar ─── */}
      <section
        className="sticky top-[64px] z-40 backdrop-blur-sm py-[var(--ef-stack-md)] px-8 md:px-12 lg:px-16 flex flex-wrap items-center justify-between gap-[var(--ef-stack-md)] mb-[var(--ef-stack-lg)]"
        style={{
          backgroundColor: "rgba(253, 249, 243, 0.95)", // ef-surface with opacity
          borderBottom: "1px solid var(--ef-outline-variant)",
        }}
      >
        <div className="flex flex-wrap items-center gap-[var(--ef-stack-md)]">
          {/* Category Filter */}
          <FilterDropdown label="Category">
            <FilterOption
              label="All Categories"
              active={selectedCategory === null}
              onClick={() => handleCategoryChange(null)}
            />
            {categories.map(cat => (
              <FilterOption
                key={cat.id}
                label={cat.name}
                active={selectedCategory === cat.id}
                onClick={() => handleCategoryChange(cat.id)}
              />
            ))}
          </FilterDropdown>

          {/* Price Filter */}
          <FilterDropdown label="Price">
            {PRICE_RANGES.map((range, idx) => (
              <FilterOption
                key={idx}
                label={range.label}
                active={selectedPriceRange === idx}
                onClick={() => handlePriceChange(idx)}
              />
            ))}
          </FilterDropdown>

          {/* Sort By */}
          <FilterDropdown label="Sort By">
            {SORT_OPTIONS.map(opt => (
              <FilterOption
                key={opt.value}
                label={opt.label}
                active={sortBy === opt.value}
                onClick={() => handleSortChange(opt.value)}
              />
            ))}
          </FilterDropdown>
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
              className="animate-pulse overflow-hidden"
              style={{
                borderRadius: "6px",
                border: "1px solid var(--ef-outline-variant)",
                backgroundColor: "var(--ef-surface-container-lowest)",
                maxWidth: "320px",
              }}
            >
              <div
                className="aspect-square"
                style={{ backgroundColor: "var(--ef-surface-container)" }}
              />
              <div className="p-3 space-y-2">
                <div className="h-4 rounded" style={{ backgroundColor: "var(--ef-surface-container-high)", width: "70%" }} />
                <div className="h-3 rounded" style={{ backgroundColor: "var(--ef-surface-container)", width: "40%" }} />
                <div className="h-3 rounded" style={{ backgroundColor: "var(--ef-surface-container)", width: "100%" }} />
              </div>
            </div>
          ))}
        </section>
      ) : error ? (
        /* Error State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span
            className="material-symbols-outlined mb-4"
            style={{ fontSize: 48, color: "var(--ef-error)" }}
          >
            error_outline
          </span>
          <p
            className="mb-2"
            style={{
              fontFamily: "var(--font-playfair-display), 'Playfair Display', serif",
              fontSize: "20px",
              fontWeight: 500,
              color: "var(--ef-on-surface)",
            }}
          >
            Something went wrong
          </p>
          <p
            className="mb-4"
            style={{
              fontSize: "15px",
              fontWeight: 300,
              color: "var(--ef-on-surface-variant)",
            }}
          >
            {error}
          </p>
          <button
            onClick={fetchProducts}
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
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span
            className="material-symbols-outlined mb-4"
            style={{ fontSize: 48, color: "var(--ef-on-surface-variant)" }}
          >
            inventory_2
          </span>
          <p
            className="mb-2"
            style={{
              fontFamily: "var(--font-playfair-display), 'Playfair Display', serif",
              fontSize: "20px",
              fontWeight: 500,
              color: "var(--ef-on-surface)",
            }}
          >
            No Products Found
          </p>
          <p
            className="mb-4"
            style={{
              fontSize: "15px",
              fontWeight: 300,
              color: "var(--ef-on-surface-variant)",
            }}
          >
            Try adjusting your filters or price range.
          </p>
          <button
            onClick={() => {
              setSelectedCategory(null)
              setSelectedPriceRange(0)
              setSortBy("newest")
              setPage(1)
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
            Clear All Filters
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
