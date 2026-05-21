import HeroSection from "@/components/about/HeroSection";
import QuoteSection from "@/components/about/QuoteSection";
import HistorySection from "@/components/about/HistorySection";
import ValuesSection from "@/components/about/ValuesSection";
import { Testimonials, type Testimonial } from "@/components/home/Testimonials"
import { ReviewService } from "@/services/review-service"
import { ProductReview } from "@/models/product"

// Fallback data with Nepali names
const fallbackTestimonials: Testimonial[] = [
  {
    name: "Rohan Shahi",
    quote:
      "The ErgoChair Pro has been a game-changer for my home office. My back pain is gone, and I can focus for longer periods. Highly recommended!",
    rating: 5,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDwaojhpWg7VPf-XaUif0Pox7evceyfbawiSK2ZkM3XutmbJAWJwzSEpDP6MIrOrmJRy18rHyiGQpm-xRzdI6Y9iRMcc2Sd0I9CJaoBZQMGvLkDIOM_HuznVlVkWw7fW_5gxWzuNZqHrwS--lMQkBKwiPRFTWsQd4ii0b8Nm1GwHVH1CKYj9GibsF80X_2HJ8oRWEgtIGWw5L94_rZ3C0OKF0XmWQibtuNzokX1Cr8Gmo10pFioVb_ZtsBwFH6MJVi0cqMpsfpPMZou",
  },
  {
    name: "Suman Rasaili",
    quote:
      "I love my new standing desk! The quality is excellent, and it was easy to assemble. It's made a huge difference in my energy levels throughout the day.",
    rating: 4.5,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwqNdbibNUFmrcaAJIBfzyOgv0-VwGFf63QOjTZiRwO3kMLnuMEP0Gy9bWCvUtW8X2j00zjv92v-iDhfN3Dzs5Ml6ZvwxjnTVLWWmUpHz0g19gHYmSBRHlnTcEz2oQnBiKk1FqsQVdhauLuKYjV87xmrWlWwZxaKsDXYlZ0hPJgcCdhJSc7iGd_MwwltHHxzKns97Vt43UwHlcpEufyYEoul8kN-kLUwQVYGF6KbDpNexftQA-5GEUelJ6ZQxrLvHvsVDqUTkDJ6QG",
  },
  {
    name: "Sagar Thapa Shrestha",
    quote:
      "The vertical mouse is so comfortable. I had some wrist pain from my old mouse, but this one has completely solved the issue. Great product.",
    rating: 5,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjptnbViQ_X9Z9NSpvYVFqVBolcvRI8ikWEPWfhUHsT6CR4sCcdqtWddisydb59r6ptIwtMMtv-3fN4u9sXV59p98ltsxZcJrGdl44VU94apRgpsjAAJZrPuwfqAdcbIuggI8nBPq_kyoAx7Jo07pfE3NIOdJMRmUvZI_7nBTjh3XUruL6bViF1ivcQB9NvtXVNOkxGcO1ArPm7I2FYSlj7l-hmSk0hwstkEVB6cIa-Ka4J9ikujZsQDveFERKObTl0EtaYpiIAsoR",
  },
]

export default async function AboutPage() {
  // Fetch real 5-star reviews
  const realReviews = await ReviewService.getTopReviews(3)

  // Transform real reviews to Testimonial format
  const realTestimonials: Testimonial[] = realReviews.map((review: ProductReview) => ({
    name: review.full_name || "Verified Customer",
    quote: review.review || "Great product!",
    rating: review.rating,
    imageUrl: null, // We don't have user avatars in DB yet, Testimonials component should handle null/placeholder
  }))

  // Combine real reviews with fallbacks to ensure we show at least 3
  const displayTestimonials = [...realTestimonials, ...fallbackTestimonials].slice(0, 3)
  return (
    <div className="bg-background min-h-screen">
      <main className="flex flex-col">
        <HeroSection />
        <QuoteSection />
        <HistorySection />
        <ValuesSection />
        <Testimonials testimonials={displayTestimonials} />
      </main>
    </div>
  );
}
