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
    <div className="mt-16">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav aria-label="Tabs" className="-mb-px flex space-x-8">
          <button className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-primary border-primary">
            Customer Reviews
          </button>
          <button className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 border-transparent">
            Details
          </button>
        </nav>
      </div>
      <div className="py-8">
        <div className="flex flex-wrap gap-x-12 gap-y-8">
          <div className="flex flex-col gap-2">
            <p className="text-[#111718] dark:text-white text-5xl font-black leading-tight tracking-[-0.033em]">
              {averageRating}
            </p>
            <div className="flex gap-0.5">
              {Array.from({ length: fullStars }).map((_, i) => (
                <Star key={`full-star-${i}`} className="h-5 w-5 text-primary fill-primary" />
              ))}
              {hasHalfStar && <StarHalf className="h-5 w-5 text-primary fill-primary" />}
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
                  <div className="rounded-full bg-primary" style={{ width: `${percent}%` }}></div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal text-right">
                  {percent}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
