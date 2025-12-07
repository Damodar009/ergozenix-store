"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

export type ProductItem = {
  id: number | string
  name: string
  description: string
  price: string | number
  imageUrl: string
  alt: string
}

export function ProductCard({ product }: { product: ProductItem }) {
  const price = typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price

  return (
    <Card className="group relative flex flex-col rounded-xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link href={`/product/${product.id}`} className="block">
        <div className="overflow-hidden">
          <img className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-300" alt={product.alt} src={product.imageUrl} />
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-lg font-semibold text-card-foreground">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
          <p className="text-lg font-bold text-primary mt-4">{price}</p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <Button 
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary text-white h-10 text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors"
          onClick={(e) => {
            e.preventDefault()
            // TODO: Implement add to cart functionality
            console.log('Add to cart:', product.id)
          }}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </Card>
  )
}


