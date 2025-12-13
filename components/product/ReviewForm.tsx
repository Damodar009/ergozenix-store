import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
// import { useToast } from "@/components/ui/use-toast" // or hooks/use-toast
import { ReviewService } from "@/services/review-service"
import { useRouter } from "next/navigation"

export function ReviewForm({ productId }: { productId: number }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const reviewData = {
      product_id: productId,
      user_id: 1, // Placeholder: Schema requires INT. Auth uses UUID. Needs resolution.
      full_name: formData.get("name") as string || "Anonymous",
      phone_or_email: formData.get("contact") as string,
      rating: rating,
      review: formData.get("review") as string
    }

    try {
      await ReviewService.createReview(reviewData)
      alert("Review submitted successfully!") // Simple alert for now, or use toast
      setRating(0)
      ;(e.target as HTMLFormElement).reset()
      router.refresh() // Refresh to show new review
    } catch (error) {
      console.error("Failed to submit review", error)
      alert("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
      <h3 className="text-xl font-bold text-[#111718] dark:text-white">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Rating Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star 
                  className={cn(
                    "h-8 w-8 transition-colors",
                    (hoverRating || rating) >= star 
                      ? "fill-[#00B5D8] text-[#00B5D8]" 
                      : "fill-transparent text-gray-300 dark:text-gray-600"
                  )} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Name (Optional)
          </label>
          <Input 
            id="name" 
            name="name" 
            placeholder="Your name or alias" 
            className="bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700 focus-visible:ring-[#00B5D8]"
          />
        </div>

        {/* Email/Phone Field */}
        <div className="space-y-2">
          <label htmlFor="contact" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email or Phone Number
          </label>
          <Input 
            id="contact" 
            name="contact" 
            placeholder="Enter your email or phone" 
            className="bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700 focus-visible:ring-[#00B5D8]"
            required
          />
        </div>

        {/* Review Field */}
        <div className="space-y-2">
          <label htmlFor="review" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Review
          </label>
          <Textarea 
            id="review" 
            name="review" 
            placeholder="Share your experience with the ErgoZenix Pro..." 
            className="min-h-[120px] bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700 focus-visible:ring-[#00B5D8] resize-y"
            required
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting || rating === 0}
          className="w-full sm:w-auto self-start bg-[#00B5D8] hover:bg-[#00A3C4] text-white font-bold h-11 px-8 rounded-lg transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  )
}
