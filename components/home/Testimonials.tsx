"use client"

import { Card } from "@/components/ui/card"
import { StarRating } from "@/components/home/StarRating"

export type Testimonial = {
  name: string
  quote: string
  rating: number
  imageUrl: string
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="py-16 sm:py-24">
      <h2 className="text-gray-900 dark:text-white text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        {testimonials.map((t) => (
          <Card key={t.name} className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border-none">
            <div className="flex items-center mb-4">
              <img alt={`Photo of ${t.name}`} className="w-12 h-12 rounded-full mr-4 object-cover" src={t.imageUrl} />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
                <StarRating rating={t.rating} />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">"{t.quote}"</p>
          </Card>
        ))}
      </div>
    </section>
  )
}


