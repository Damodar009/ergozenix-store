import type { ComponentType } from "react"
import { Facebook, Instagram, Twitter } from "lucide-react"

export type SocialLink = {
  name: string
  href: string
  Icon: ComponentType<{ className?: string }>
}

export const socialLinks: SocialLink[] = [
  { name: "Facebook", href: "#", Icon: Facebook },
  { name: "Instagram", href: "#", Icon: Instagram },
  { name: "Twitter", href: "#", Icon: Twitter },
]


