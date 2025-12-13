"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { StarRating } from "@/components/home/StarRating"
import { QuantitySelector } from "./QuantitySelector"
import { useState } from "react"
import { useCart } from "@/context/cart-context"

export type ProductSpec = {
  label: string
  value: string
}

import { useRouter } from "next/navigation"

export function ProductDetails({ 
  title, 
  rating, 
  reviewCount, 
  price, 
  basePrice,
  salePrice,
  description,
  keySpecs,
  productId
}: {
  title: string
  rating: number
  reviewCount: number
  price: string
  basePrice?: number
  salePrice?: number | null
  description: string
  keySpecs?: ProductSpec[]
  productId: number
}) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const router = useRouter()

  const handleBuyNow = async () => {
    await addToCart(productId, quantity, [])
    router.push("/cart")
  }

  const formatPrice = (p: number) => `Rs. ${p.toLocaleString()}`
  const hasSale = salePrice && basePrice && salePrice < basePrice

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-[#111718] dark:text-white tracking-tight text-3xl md:text-4xl font-black leading-tight mb-2">
        {title}
      </h1>
      
      <div className="flex items-center gap-2 mb-4">
        <StarRating rating={rating} />
        <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
          ({reviewCount} Reviews)
        </p>
      </div>
      
      {hasSale ? (
        <div className="flex items-center gap-3 mb-6">
           <p className="text-4xl font-black text-[#111718] dark:text-white tracking-tight">
             {formatPrice(salePrice!)}
           </p>
           <p className="text-xl text-gray-500 line-through font-medium">
             {formatPrice(basePrice!)}
           </p>
        </div>
      ) : (
        <p className="text-4xl font-black text-[#111718] dark:text-white mb-6 tracking-tight">{price}</p>
      )}
      
      <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-8">
        {description}
      </p>
      
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex gap-4">
          <QuantitySelector 
            quantity={quantity}
            onIncrease={() => setQuantity(q => q + 1)}
            onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
            className="w-32 flex-shrink-0"
          />
          <Button 
            className="flex-1 h-12 bg-[#00B5D8] hover:bg-[#00A3C4] text-white font-bold text-base rounded-md"
            onClick={() => addToCart(productId, quantity, [])}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
        <Button 
          className="w-full h-12 bg-[#D0EDF5] hover:bg-[#C0E3ED] text-[#008CA3] font-bold text-base border-none rounded-md"
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </div>

      {keySpecs && keySpecs.length > 0 && (
        <div className="mt-auto">
          <h3 className="text-lg font-bold text-[#111718] dark:text-white mb-4">Specifications</h3>
          <div className="space-y-3">
            {keySpecs.map((spec, index) => (
              <div key={index} className="flex justify-between items-end">
                <span className="text-gray-600 dark:text-gray-400 text-base">{spec.label}:</span>
                <span className="text-[#111718] dark:text-white font-bold text-base text-right">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

