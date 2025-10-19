"use client"

import { Star, StarHalf } from "lucide-react"

export function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex text-primary">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-primary" />
      ))}
      {hasHalfStar && <StarHalf key="half" className="h-4 w-4 fill-primary" />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 stroke-primary" />
      ))}
    </div>
  )
}


