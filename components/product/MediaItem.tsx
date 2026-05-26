// MediaItem component for image/video preview
"use client"

import { X } from "lucide-react"

export type Media = {
  url: string
  type: "image" | "video"
}

interface MediaItemProps {
  media: Media
  isPrimary?: boolean
  onRemove?: () => void
}

export function MediaItem({ media, isPrimary = false, onRemove }: MediaItemProps) {
  return (
    <div className="relative group aspect-square rounded-md overflow-hidden">
      {media.type === "video" ? (
        <video
          src={media.url}
          controls
          muted
          className="object-cover w-full h-full"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={media.url} alt="media" className="object-cover w-full h-full" />
      )}
      {isPrimary && (
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-1 text-xs font-bold rounded">
          Primary
        </div>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
