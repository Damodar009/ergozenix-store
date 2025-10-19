"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { StarRating } from "@/components/home/StarRating"

export type ProductSpec = {
  label: string
  value: string
}

export function ProductDetails({ 
  title, 
  rating, 
  reviewCount, 
  price, 
  description, 
  specifications 
}: {
  title: string
  rating: number
  reviewCount: number
  price: string
  description: string
  specifications: ProductSpec[]
}) {
  return (
    <div>
      <h1 className="text-[#111718] dark:text-white tracking-tight text-3xl md:text-4xl font-bold leading-tight">
        {title}
      </h1>
      
      <div className="flex items-center gap-2 mt-4">
        <StarRating rating={rating} />
        <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
          ({reviewCount} Reviews)
        </p>
      </div>
      
      <p className="text-3xl font-bold text-[#111718] dark:text-white mt-4">{price}</p>
      
      <p className="text-gray-600 dark:text-gray-400 mt-4 text-base leading-relaxed">
        {description}
      </p>
      
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Button className="w-full sm:w-auto flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
        <Button variant="outline" className="w-full sm:w-auto flex-1">
          Buy Now
        </Button>
      </div>
      
      <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8">
        <h3 className="text-lg font-semibold text-[#111718] dark:text-white">Specifications</h3>
        <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
          {specifications.map((spec, index) => (
            <li key={index} className="flex justify-between">
              <span>{spec.label}:</span>
              <span className="font-medium text-right text-[#111718] dark:text-gray-300">
                {spec.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
