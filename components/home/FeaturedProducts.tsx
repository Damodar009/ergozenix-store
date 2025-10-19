"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export type Product = {
  name: string
  description: string
  price: string
  imageUrl: string
  alt: string
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-16 sm:py-24" id="products">
      <h2 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-8 text-center">
        Featured Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
        {products.map((product) => (
          <Card
            key={product.name}
            className="flex flex-col gap-4 pb-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border-none"
          >
            <div
              className="w-full bg-center bg-no-repeat aspect-square bg-cover"
              data-alt={product.alt}
              style={{ backgroundImage: `url("${product.imageUrl}")` }}
              aria-label={product.alt}
            />
            <CardContent className="p-4 flex flex-col flex-1">
              <p className="text-gray-900 dark:text-white text-lg font-medium leading-normal">{product.name}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal mt-1">
                {product.description}
              </p>
              <p className="text-gray-800 dark:text-gray-200 text-lg font-semibold leading-normal mt-2">
                {product.price}
              </p>
              <Button className="w-full mt-4 h-10 px-4 text-sm font-bold hover:opacity-90 bg-primary/20 text-primary">
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}


