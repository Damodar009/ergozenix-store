"use client"

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
          <p className="text-gray-600 dark:text-gray-400">
            More than just furniture, we are building a foundation for better living through thoughtful design and responsible practices.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors duration-300 border border-transparent hover:border-primary/20">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">accessibility_new</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Human-Centered Design</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Every curve and contour is engineered to support the human body. We prototype relentlessly to ensure optimal comfort.
            </p>
          </div>
          <div className="group p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors duration-300 border border-transparent hover:border-primary/20">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">eco</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Sustainable by Design</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We minimize impact by using eco-friendly materials and recyclable packaging. Sustainability is built into our blueprint.
            </p>
          </div>
          <div className="group p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors duration-300 border border-transparent hover:border-primary/20">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">science</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Innovation Driven</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We don't settle for "good enough." We constantly research new materials and mechanisms to redefine comfort.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}


