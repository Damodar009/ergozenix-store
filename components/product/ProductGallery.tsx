"use client"

import { useState } from "react"

export type ProductImage = {
  url: string
  alt: string
  primary?: boolean
}

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [activeImage, setActiveImage] = useState(0)
  const primaryImage = images.find(img => img.primary) || images[0]
  const thumbnailImages = images.filter(img => !img.primary)

  return (
    <div>
      <div
        className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl min-h-[400px] md:min-h-[500px]"
        style={{ backgroundImage: `url("${primaryImage?.url}")` }}
        aria-label={primaryImage?.alt}
      />
      <div className="grid grid-cols-4 gap-4 mt-4">
        {thumbnailImages.map((img, index) => (
          <div
            key={index}
            className={`w-full h-24 bg-center bg-no-repeat bg-cover rounded-lg transition-opacity cursor-pointer ${
              activeImage === index ? "border-2 border-primary" : "opacity-70 hover:opacity-100"
            }`}
            style={{ backgroundImage: `url("${img.url}")` }}
            aria-label={img.alt}
            onClick={() => setActiveImage(index)}
          />
        ))}
      </div>
    </div>
  )
}
