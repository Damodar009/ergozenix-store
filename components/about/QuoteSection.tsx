"use client"

import { Quote } from "lucide-react"

export default function QuoteSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <Quote className="text-primary w-12 h-12 mx-auto mb-6 fill-current" />
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
          "We believe that a healthy workspace is not a luxury, but a <span className="text-primary decoration-4 underline-offset-4 decoration-primary underline">necessity</span> for productivity, creativity, and overall happiness."
        </h2>
      </div>
    </section>
  )
}
