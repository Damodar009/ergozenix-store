"use client"

import { useEffect, useState } from "react"
import { ProductService, type Product } from "@/services/product-service"
import { Header } from "@/components/header"
import { Breadcrumbs, type BreadcrumbItem } from "@/components/product/Breadcrumbs"
import { ProductGallery, type ProductImage } from "@/components/product/ProductGallery"
import { ProductDetails, type ProductSpec } from "@/components/product/ProductDetails"
import { ReviewSummary, type RatingDistribution } from "@/components/product/ReviewSummary"
import { RelatedProducts, type RelatedProduct } from "@/components/product/RelatedProducts"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data for features not yet in database
const mockRelatedProducts: RelatedProduct[] = [
  {
    name: "ErgoFlex Standing Desk",
    price: "599",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTl-qekC5Ld-PdI8o2jyRao0wJ6NqBig-kv1AH0IHGNUYAsHCKi9y4gMIq0aCqH7lrP87bFtacwtKiMgXwid5p61WMp14hMPApAaaLKirCuI3PQ90QT-v_Al2SpeD5ndIsERPiGx3QaQqsm-ULraoQEYfB8jtCxaAzOa-AHU_Rg4UeYU2E_TPxq20sIZMKRN-8VBb9InJ3KMRICEYkzK8KMCnqmSCBAV-3gNcBdWpU43L8glhXlP6q2bUL38bEKRCoFZJQ4VQdWwl0",
    altText: "A standing desk with a laptop on it",
    href: "/product/standing-desk",
  },
  {
    name: "ErgoFlex Lumbar Pillow",
    price: "49",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHaji760C3q8BeLR2Rsem9zzrG2xD-Yl5qwuM_lCdlTfF-1tISo3AdvkPa1vM3zB1ZEyliM4ExtBXyurDU28kFwr_30Y950ZWc7fTbg-4H6FJZTfbpvTcpehEHT9m_HSDIobvqZS9i5aGYlxJdF7o6LdoMvfqh8JuUaA1W9iltsxLpKNqDvgTIjCkpVMEjL-FOJbh54WTuBgKXmAjYU8s6VQ2-OGEh2Xj2kpp0yQP-YaB-TU8noDnF1jfZWWP9uKr-lLl45joQz2MB",
    altText: "A lumbar support pillow on a chair",
    href: "/product/lumbar-pillow",
  },
]

const mockRatingDistribution: RatingDistribution[] = [
  { rating: 5, percent: 70 },
  { rating: 4, percent: 15 },
  { rating: 3, percent: 8 },
  { rating: 2, percent: 4 },
  { rating: 1, percent: 3 },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await ProductService.getProductById(params.id)
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

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

  // Convert product data to component format
  const productImages: ProductImage[] = product.image_url
    ? [{ url: product.image_url, alt: product.name, primary: true }]
    : []

  const specifications: ProductSpec[] = [
    { label: "Stock", value: `${product.stock_quantity} available` },
    { label: "Product ID", value: product.id.substring(0, 8) + "..." },
  ]

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: product.name },
  ]

  return (
    <div className="bg-background min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
              <Breadcrumbs items={breadcrumbItems} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
                <ProductGallery images={productImages} />
                <ProductDetails
                  title={product.name}
                  rating={4.5}
                  reviewCount={125}
                  price={product.price.toString()}
                  description={product.description || 'No description available.'}
                  specifications={specifications}
                />
              </div>
              
              <ReviewSummary
                averageRating={4.5}
                totalReviews={125}
                ratingDistribution={mockRatingDistribution}
              />
              
              <RelatedProducts products={mockRelatedProducts} />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
