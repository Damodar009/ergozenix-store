"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

export type ProductItem = {
  id: number
  name: string
  description: string
  price: string
  imageUrl: string
  alt: string
}

export function ProductCard({ product }: { product: ProductItem }) {
  return (
    <Card className="group relative flex flex-col rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="overflow-hidden">
        <img className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-300" alt={product.alt} src={product.imageUrl} />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold text-[#111718] dark:text-white">{product.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{product.description}</p>
        <p className="text-lg font-bold text-primary mt-4">{product.price}</p>
      </div>
      <div className="p-4 pt-0">
        <Button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary text-white h-10 text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors">
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </Card>
  )
}


