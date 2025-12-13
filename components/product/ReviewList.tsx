"use client"

import { Star } from "lucide-react"
import { ProductReview } from "@/models/product"
import { formatDistanceToNow } from "date-fns" // Optional: for relative time, or just standard date

export function ReviewList({ reviews }: { reviews?: ProductReview[] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-12 text-center border-t border-gray-200 dark:border-gray-800 mt-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">No reviews yet. Be the first to review!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 border-t border-gray-200 dark:border-gray-800 mt-12 pt-12">
      <h3 className="text-xl font-bold text-[#111718] dark:text-white">Customer Reviews</h3>
      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-4">
            {/* Avatar Placeholder */}
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold">
              {/* Initials or Icon - Assuming we don't have user name in ProductReview interface yet? Let's check model. 
                  ProductReview has user_id. We might need joined data or just hardcode "User". 
                  Wait, interface ProductReview in models/product.ts (Step 586) has: 
                  id, product_id, user_id, rating, review, created_at. 
                  It DOES NOT have user name. 
                  User asked to "show all the review with NAME". 
                  I might need to update the model/query to include user name or assume it's fetched. 
                  For now I will use "Verified User" or mock it if the data isn't there. 
                  Or maybe the user expects me to add the field to the DB?
                  I'll use a placeholder "User" or "Verified Customer" for now and note it.
              */}
              U
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#111718] dark:text-white">{review.full_name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                </span>
              </div>
              
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < review.rating ? "text-primary fill-primary" : "text-gray-300 dark:text-gray-600"}`} 
                  />
                ))}
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {review.review}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
