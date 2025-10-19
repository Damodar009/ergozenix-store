"use client"

import Link from "next/link"
import Image from "next/image"

type LogoIconProps = {
  className?: string
}

export function LogoIcon({ className }: LogoIconProps) {
  return (
    <Link href="/" className={className} aria-label="ErgoFlex Store Home">
      <Image src="/placeholder-logo.svg" alt="ErgoFlex Store" width={24} height={24} className="rounded" />
    </Link>
  )
}


