"use client"

import { Star, StarHalf } from "lucide-react"

export type RatingDistribution = {
  rating: number
  percent: number
}

export function ReviewSummary({ 
  averageRating, 
  totalReviews, 
  ratingDistribution 
}: {
  averageRating: number
  totalReviews: number
  ratingDistribution: RatingDistribution[]
}) {
  const fullStars = Math.floor(averageRating)
  const hasHalfStar = averageRating % 1 !== 0

  return (
    <div className="py-8">
      <div className="flex flex-wrap gap-x-12 gap-y-8">
        <div className="flex flex-col gap-2">
          <p className="text-[#111718] dark:text-white text-5xl font-black leading-tight tracking-[-0.033em]">
            {averageRating}
          </p>
          <div className="flex gap-0.5">
            {Array.from({ length: fullStars }).map((_, i) => (
              <Star key={`full-star-${i}`} className="h-5 w-5 text-[#00B5D8] fill-[#00B5D8]" />
            ))}
            {hasHalfStar && <StarHalf className="h-5 w-5 text-[#00B5D8] fill-[#00B5D8]" />}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
            Based on {totalReviews} reviews
          </p>
        </div>

        <div className="grid min-w-[240px] max-w-[400px] flex-1 grid-cols-[20px_1fr_40px] items-center gap-y-3">
          {ratingDistribution.map(({ rating, percent }) => (
            <div key={rating} className="contents">
              <p className="text-[#111718] dark:text-gray-300 text-sm font-normal leading-normal">
                {rating}
              </p>
              <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div 
                  className="rounded-full bg-[#00B5D8]" 
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal text-right">
                {percent}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
