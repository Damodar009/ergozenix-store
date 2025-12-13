"use client"

import { Accessibility, Leaf, FlaskConical } from "lucide-react"

export default function ValuesSection() {
  const values = [
    {
      icon: Accessibility,
      title: "Human-Centered Design",
      description: "Every curve and contour is engineered to support the human body. We prototype relentlessly to ensure optimal comfort."
    },
    {
      icon: Leaf,
      title: "Sustainable by Design",
      description: "We minimize impact by using eco-friendly materials and recyclable packaging. Sustainability is built into our blueprint."
    },
    {
      icon: FlaskConical,
      title: "Innovation Driven",
      description: "We don't settle for \"good enough.\" We constantly research new materials and mechanisms to redefine comfort."
    }
  ]

  return (
    <section className="py-24 bg-white dark:bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
          <p className="text-gray-600 dark:text-gray-400">
            More than just furniture, we are building a foundation for better living through thoughtful design and responsible practices.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="group p-8 rounded-2xl bg-gray-50 dark:bg-slate-900 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors duration-300 border border-transparent hover:border-primary/20">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{value.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
