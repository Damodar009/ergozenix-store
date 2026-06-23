"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

type LogoIconProps = {
  className?: string
}

export function LogoIcon({ className }: LogoIconProps) {
  return (
    <Image
      src="/logo_v2.1.png"
      alt="ErgoZenix Store"
      width={24}
      height={24}
      className={cn("object-contain mix-blend-multiply dark:mix-blend-normal", className)}
    />
  )
}


