"use client"

import { useEffect, useState, use } from "react"
import { ProductService } from "@/services/product-service"
import type { ProductWithDetails, ProductAttributeValue, ProductAttribute } from "@/models/product"
import { Breadcrumbs, type BreadcrumbItem } from "@/components/product/Breadcrumbs"
import { ProductGallery, type ProductImage } from "@/components/product/ProductGallery"
import { ProductDetails } from "@/components/product/ProductDetails"
import { CategorizedSpecifications, getCategoryIcon, type SpecificationCategory, type ProductSpec } from "@/components/product/CategorizedSpecifications"
import { ReviewSummary, type RatingDistribution } from "@/components/product/ReviewSummary"
import { RelatedProducts, type RelatedProduct } from "@/components/product/RelatedProducts"
import { ProductTabs } from "@/components/product/ProductTabs"
import { ReviewForm } from "@/components/product/ReviewForm"
import { ReviewList } from "@/components/product/ReviewList"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data for features not yet fully implemented
const mockRelatedProducts: RelatedProduct[] = []

// Category mapping for attribute classification
const CATEGORY_KEYWORDS = {
  'Dimensions & Weight': ['width', 'depth', 'height', 'weight', 'thickness', 'range', 'size', 'dimension'],
  'Performance': ['motor', 'speed', 'noise', 'power', 'capacity', 'load', 'lift', 'duty'],
  'Materials & Finish': ['material', 'finish', 'color', 'coating', 'base'],
  'Features': ['control', 'preset', 'collision', 'lock', 'accessories', 'mechanism', 'feature', 'system'],
  'General Info': ['warranty', 'sku', 'brand', 'category', 'stock']
}

function categorizeAttribute(attributeName: string): string {
  const lowerName = attributeName.toLowerCase()
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return category
    }
  }
  
  return 'General Info'
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [product, setProduct] = useState<ProductWithDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await ProductService.getProductBySlug(slug)
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Convert product images to component format
  const productImages: ProductImage[] = product.images?.map((img, index) => ({
    url: img.image_url,
    alt: product.name,
    primary: img.is_primary || index === 0
  })) || []

  // Categorize attributes
  const categoryMap = new Map<string, Map<string, string[]>>()
  const allSpecs = new Map<string, string>() // Flattened specs for key specs extraction
  
  if (product.attributes && product.attributes.length > 0) {
    product.attributes.forEach((attrValue: ProductAttributeValue & { attribute?: ProductAttribute }) => {
      const attr = attrValue.attribute
      if (!attr) return
      
      const value = attrValue.value_text || 
                   (attrValue.value_number !== null ? `${attrValue.value_number}${attr.unit ? ' ' + attr.unit : ''}` : null)
      
      if (value) {
        // Add to category map
        const category = categorizeAttribute(attr.name)
        if (!categoryMap.has(category)) {
          categoryMap.set(category, new Map())
        }
        const categoryAttrs = categoryMap.get(category)!
        if (!categoryAttrs.has(attr.name)) {
          categoryAttrs.set(attr.name, [])
        }
        categoryAttrs.get(attr.name)!.push(value)

        // Add to allSpecs flattened map (combine multiples)
        if (allSpecs.has(attr.name)) {
          allSpecs.set(attr.name, `${allSpecs.get(attr.name)}, ${value}`)
        } else {
          allSpecs.set(attr.name, value)
        }
      }
    })
  }

  // Extract Key Specs (Material, Weight, Dimensions)
  const keySpecs: ProductSpec[] = []
  
  // Helper to find spec by loose matching
  const findSpec = (keywords: string[]) => {
    for (const [key, value] of allSpecs.entries()) {
      if (keywords.some(k => key.toLowerCase().includes(k))) {
        return { label: key, value }
      }
    }
    return null
  }

  const materialSpec = findSpec(['material', 'finish'])
  const weightSpec = findSpec(['product weight', 'item weight', 'weight'])
  const dimensionSpec = findSpec(['dimension', 'size', 'width'])

  if (materialSpec) keySpecs.push(materialSpec)
  if (weightSpec) keySpecs.push(weightSpec)
  if (dimensionSpec) keySpecs.push(dimensionSpec)

  // Add basic product info to General Info category if needed
  if (!categoryMap.has('General Info')) {
    categoryMap.set('General Info', new Map())
  }
  const generalInfo = categoryMap.get('General Info')!
  generalInfo.set('SKU', [product.sku || 'N/A'])
  generalInfo.set('Brand', [product.brand?.name || 'N/A'])
  generalInfo.set('Category', [product.category?.name || 'N/A'])

  // Convert to SpecificationCategory format
  const categories: SpecificationCategory[] = []
  const categoryOrder = ['Dimensions & Weight', 'Performance', 'Materials & Finish', 'Features', 'General Info']
  
  categoryOrder.forEach(categoryName => {
    if (categoryMap.has(categoryName)) {
      const specs: ProductSpec[] = []
      const attrs = categoryMap.get(categoryName)!
      
      attrs.forEach((values, label) => {
        specs.push({
          label,
          value: values.join(', ')
        })
      })
      
      if (specs.length > 0) {
        categories.push({
          name: categoryName,
          icon: getCategoryIcon(categoryName),
          specs
        })
      }
    }
  })

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: product.category?.name || "Products", href: `/shop?category=${product.category_id}` },
    { label: product.name },
  ]

  // Format price
  const formatPrice = (price: number) => {
    return `$${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)}` // Using $ as per design image request, can revert to Rs if user insists on previous req
  }
  
  // Reverting to previous currency requirement (NPR) as per project context, 
  // ignoring "copy design" strictly for currency symbol unless explicitly asked to change currency.
  // Actually, user said "ignore the theme. just copy the design". 
  // Design has $. Previous context had Rs. 
  // Usually "design" implies layout/visuals. "Currency" is data/locale. 
  // I will keep Rs (NPR) to be consistent with previous work unless corrected,
  // BUT I will style it like the design (Bold/Large).
  
  const formatPriceNPR = (price: number) => {
    return `Rs ${new Intl.NumberFormat('ne-NP', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)}`
  }

  const displayPrice = product.sale_price && product.sale_price < product.base_price
    ? formatPriceNPR(product.sale_price)
    : formatPriceNPR(product.base_price)

  // Calculate Rating Distribution
  const ratingDistribution: RatingDistribution[] = [5, 4, 3, 2, 1].map(star => {
    const count = product.reviews?.filter(r => r.rating === star).length || 0
    const total = product.reviews?.length || 0
    return {
      rating: star,
      percent: total > 0 ? Math.round((count / total) * 100) : 0
    }
  })

  return (
    <div className="bg-background min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
              <Breadcrumbs items={breadcrumbItems} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
                {/* Left Column: Gallery */}
                <ProductGallery images={productImages} />
                
                {/* Right Column: Details */}
                <ProductDetails
                  title={product.name}
                  rating={product.average_rating || 0}
                  reviewCount={product.review_count || 0}
                  price={displayPrice}
                  basePrice={product.base_price}
                  salePrice={product.sale_price}
                  description={product.description || 'No description available.'}
                  keySpecs={keySpecs}
                  productId={product.id}
                />
              </div>
              
              {/* Tabs Section for Reviews & Specifications */}
              <ProductTabs 
                reviewsContent={
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                      {/* Left: Summary & Stats */}
                      <div className="lg:col-span-5">
                        <ReviewSummary
                          averageRating={product.average_rating || 0}
                          totalReviews={product.review_count || 0}
                          ratingDistribution={ratingDistribution}
                        />
                      </div>
                      
                      {/* Right: Write Review Form */}
                      <div className="lg:col-span-7">
                        <ReviewForm productId={product.id} />
                      </div>
                    </div>
                    
                    {/* List of Reviews */}
                    <ReviewList reviews={product.reviews} />
                  </div>
                }
                detailsContent={
                  <CategorizedSpecifications categories={categories} />
                }
              />
              
              {mockRelatedProducts.length > 0 && (
                <RelatedProducts products={mockRelatedProducts} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

