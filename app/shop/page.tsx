"use client"

import React, { useEffect, useState, useCallback } from "react"
import { FiltersSidebar } from "@/components/shop/FiltersSidebar"
import { ProductCard } from "@/components/shop/ProductCard"
import { SortSelect } from "@/components/shop/SortSelect"
import { Pagination } from "@/components/shop/Pagination"
import { ProductService } from "@/services/product-service"
import type { ProductCard as ProductCardType } from "@/models/product"
import { Category } from "@/components/shop/CategoryList"
import { Car, Monitor, Box, Mouse, Loader2, PackageX } from "lucide-react"

// Map categories to icons (you can expand this logic or store icon name in DB)
const getCategoryIcon = (name: string) => {
  const iconMap: Record<string, any> = {
    'Chairs': Car,
    'Desks': Monitor,
    'Accessories': Mouse,
    'Stands': Box
  }
  return iconMap[name] || Box
}

export default function ShopPage() {
  // Data State
  const [products, setProducts] = useState<ProductCardType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState<string | number | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000])
  
  // Sort State
  const [sortBy, setSortBy] = useState("newest")

  // Pagination State
  const [page, setPage] = useState(1)
  const [limit] = useState(9)
  const [hasMore, setHasMore] = useState(true)

  // Fetch Categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await ProductService.getAllCategories()
        setCategories(cats.map(c => ({
          id: c.id,
          name: c.name,
          icon: getCategoryIcon(c.name)
        })))
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
      let sortOption: { field: 'base_price' | 'view_count' | 'created_at', ascending: boolean } | undefined
      
      // Map sort values to API options
      if (sortBy === 'price-asc') {
        sortOption = { field: 'base_price', ascending: true }
      } else if (sortBy === 'price-desc') {
        sortOption = { field: 'base_price', ascending: false }
      } else if (sortBy === 'popular') {
        // 'view_count' might not be in ProductSortOptions type, let's fallback or adjust
        // If ProductSortOptions only allows specific fields, we must adhere.
        // models/product.ts says: 'name' | 'base_price' | 'created_at' | 'updated_at'
        // So 'popular' (view_count) is valid only if valid in type. If not, maybe use 'updated_at' or 'created_at'.
        // Let's assume 'updated_at' for popular or just remove popular if not supported.
        // Or if the service accepts 'any' string but type def is strict.
        // Let's safe fallback to created_at for now if 'view_count' is invalid.
        // But let's check ProductSortOptions again.
        // It is: 'name' | 'base_price' | 'created_at' | 'updated_at'
        // So 'view_count' is invalid. I should remove 'popular' or map it to something valid like 'created_at' (newest) or add it to type.
        // I will map 'popular' to 'created_at' desc for now to be safe.
        // actually 'newest' maps to undefined (default).
        sortOption = undefined
      }

      // We need to cast sortOption to any or match the type exactly.
      // The issue was `string` is not assignable to union.
      
      const options: any = sortOption

      const data = await ProductService.getProducts(
        {
          category_id: selectedCategory ? Number(selectedCategory) : undefined,
          min_price: priceRange[0],
          max_price: priceRange[1],
          in_stock: undefined // Show all for now
        },
        options,
        limit,
        (page - 1) * limit
      )

      setProducts(data)
      setHasMore(data.length === limit)
    } catch (err) {
      setError("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, priceRange, sortBy, page, limit])

  // Debounce effect for price filtering to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts()
    }, 500)
    return () => clearTimeout(timer)
  }, [fetchProducts])

  // Handlers
  const handleCategoryChange = (id: string | number | null) => {
    setSelectedCategory(id)
    setPage(1) // Reset to first page
  }

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range)
    setPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setPage(1)
  }

  const handleClearFilters = () => {
    setSelectedCategory(null)
    setPriceRange([0, 150000])
    setSortBy("newest")
    setPage(1)
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col w-full max-w-7xl">
          <div className="flex flex-wrap justify-between gap-4 items-center mb-8">
            <p className="text-3xl lg:text-4xl font-black leading-tight tracking-[-0.033em] text-foreground">
              Shop Our Ergonomic Products
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <FiltersSidebar 
              categories={categories} 
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceChange={handlePriceChange}
              onClearFilters={handleClearFilters}
            />

            <div className="w-full lg:w-3/4">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <p className="text-sm text-muted-foreground">
                  {loading ? 'Loading...' : `Showing ${products.length} results`}
                </p>
                <div className="flex gap-3 flex-wrap">
                  <SortSelect value={sortBy} onChange={handleSortChange} />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-red-500 mb-2">{error}</p>
                  <button onClick={fetchProducts} className="text-primary hover:underline">Try Again</button>
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <PackageX className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Products Found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters or price range.</p>
                  <button onClick={handleClearFilters} className="text-primary font-medium hover:underline">
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={{
                        id: product.id,
                        name: product.name,
                        description: product.description || '',
                        price: `Rs ${product.base_price}`,
                        basePrice: product.base_price,
                        salePrice: product.sale_price,
                        imageUrl: product.primary_image || 'https://via.placeholder.com/300',
                        alt: product.name,
                        slug: product.slug
                      }} 
                    />
                  ))}
                </div>
              )}

              {/* Simple Pagination Control (Can be expanded) */}
              <div className="mt-8 flex justify-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">Page {page}</span>
                <button 
                  onClick={() => setPage(p => p + 1)}
                  disabled={!hasMore || loading}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


