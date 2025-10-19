"use client"

import Link from "next/link"

export type RelatedProduct = {
  name: string
  price: string
  imageUrl: string
  altText: string
  href?: string
}

export function RelatedProducts({ products }: { products: RelatedProduct[] }) {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-[#111718] dark:text-white">
        Related Products
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <div key={product.name} className="group relative">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
              <img
                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                src={product.imageUrl}
                alt={product.altText}
              />
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-[#111718] dark:text-white">
                  <Link href={product.href || "#"}>
                    <span aria-hidden="true" className="absolute inset-0"></span>
                    {product.name}
                  </Link>
                </h3>
              </div>
              <p className="text-sm font-medium text-[#111718] dark:text-white">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
