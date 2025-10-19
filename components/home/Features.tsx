"use client"

import { Accessibility, StarHalf } from "lucide-react"

export function Features() {
  const primaryColor = "#11b4d4"
  const items = [
    {
      icon: Accessibility,
      title: "Improved Posture",
      description: "Our products are designed to support your body's natural alignment.",
    },
    { icon: StarHalf, title: "Reduced Strain", description: "Minimize discomfort and prevent long-term strain on your body." },
    { icon: StarHalf, title: "Increased Productivity", description: "A comfortable workspace allows you to focus and perform at your best." },
  ]

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-gray-900 rounded-xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-gray-900 dark:text-white text-3xl font-bold text-center mb-12">Feel the Difference</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {items.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center">
              <div
                className="flex items-center justify-center h-16 w-16 rounded-full text-3xl mb-4"
                style={{ backgroundColor: `${primaryColor}33`, color: primaryColor }}
              >
                <Icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


