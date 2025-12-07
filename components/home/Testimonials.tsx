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
      <h2 className="text-foreground text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        {testimonials.map((t) => (
          <Card key={t.name} className="bg-card p-8 rounded-xl shadow-sm border-none">
            <div className="flex items-center mb-4">
              <img alt={`Photo of ${t.name}`} className="w-12 h-12 rounded-full mr-4 object-cover" src={t.imageUrl} />
              <div>
                <p className="font-semibold text-card-foreground">{t.name}</p>
                <StarRating rating={t.rating} />
              </div>
            </div>
            <p className="text-muted-foreground">"{t.quote}"</p>
          </Card>
        ))}
      </div>
    </section>
  )
}


