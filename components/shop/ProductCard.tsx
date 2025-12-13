"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

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
}

import { useCart } from "@/context/cart-context"

export function ProductCard({ product }: { product: ProductItem }) {
  // Price Logic
  const hasSale = product.salePrice && product.salePrice < (product.basePrice || 0)
  
  const formatPrice = (p: number) => `Rs. ${p.toLocaleString()}`
  
  const priceDisplay = hasSale ? (
    <div className="flex items-center gap-2 mt-4">
      <p className="text-lg font-bold text-primary">{formatPrice(product.salePrice!)}</p>
      <p className="text-sm text-muted-foreground line-through">{formatPrice(product.basePrice!)}</p>
    </div>
  ) : (
    <p className="text-lg font-bold text-primary mt-4">
        {typeof product.price === 'number' ? formatPrice(product.price) : product.price}
    </p>
  )

  const { addToCart } = useCart()

  return (
    <Card className="group relative flex flex-col rounded-xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product.slug || product.id}`} className="block">
        <div className="overflow-hidden">
          <img className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-300" alt={product.alt} src={product.imageUrl} />
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-lg font-semibold text-card-foreground line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
          {priceDisplay}
        </div>
      </Link>
      <div className="p-4 pt-0">
        <Button 
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground h-10 text-sm font-bold leading-normal tracking-wide transition-colors"
          onClick={(e) => {
            e.preventDefault()
            addToCart(product.id, 1, [])
          }}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </Card>
  )
}


