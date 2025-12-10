"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuantitySelectorProps {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  className?: string
}

export function QuantitySelector({ 
  quantity, 
  onIncrease, 
  onDecrease,
  className 
}: QuantitySelectorProps) {
  return (
    <div className={`flex items-center border border-gray-200 dark:border-gray-800 rounded-md h-12 ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        className="h-full px-3 hover:bg-transparent text-gray-500 hover:text-foreground"
        onClick={onDecrease}
        disabled={quantity <= 1}
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <span className="flex-1 text-center font-bold text-lg w-12 text-foreground">
        {quantity}
      </span>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-full px-3 hover:bg-transparent text-gray-500 hover:text-foreground"
        onClick={onIncrease}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
