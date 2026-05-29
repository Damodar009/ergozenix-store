"use client"

import { useState } from "react"
import { MediaItem, type Media } from "@/components/product/MediaItem"

interface MediaGalleryProps {
  media: Media[]
}

export function MediaGallery({ media }: MediaGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const activeMedia = media[activeIdx] || media[0]

  const thumbnailMedia = media.filter((_, idx) => idx !== activeIdx)

  return (
    <div className="space-y-4">
      {/* Large preview with size constraint */}
      <div className="max-w-md">
        <MediaItem media={activeMedia} isPrimary={activeIdx === 0} />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {thumbnailMedia.map((m, idx) => {
          const displayIdx = idx >= activeIdx ? idx + 1 : idx
          return (
            <div key={displayIdx} onClick={() => setActiveIdx(displayIdx)} className="cursor-pointer">
              <MediaItem media={m} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
