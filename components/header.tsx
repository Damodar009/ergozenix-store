"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { LogoIcon } from "@/components/logo-icon"
import CartButtons from "./cart-button"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // ✅ Prevent theme mismatch during hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const navLinkClass = (href: string, base?: string) =>
    cn(
      "text-sm font-medium leading-normal",
      base,
      pathname === href
        ? "text-primary"
        : "hover:text-primary dark:hover:text-primary"
    )

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 px-6 md:px-10 py-4 bg-white dark:bg-background sticky top-0 z-10">
      <div className="flex items-center gap-4 text-[#111718] dark:text-white">
        <LogoIcon />
        <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">
          ErgoFlex Store
        </h2>
      </div>

      <nav className="hidden md:flex items-center gap-9 text-gray-800 dark:text-gray-200">
        <Link className={navLinkClass("/")} href="/">
          Home
        </Link>
        <Link className={navLinkClass("/shop")} href="/shop">
          Shop
        </Link>
        <Link className={navLinkClass("/about")} href="/about">
          About
        </Link>
        <Link className={navLinkClass("/contact")} href="/contact">
          Contact
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        {/* ✅ Only render theme toggle after mounted */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        )}

        <CartButtons />
      </div>
    </header>
  )
}
