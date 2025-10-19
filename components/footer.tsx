"use client"

import Link from "next/link"
import { LogoIcon } from "@/components/logo-icon"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { Link as UiLink } from "@/components/ui/link"
import { socialLinks } from "@/lib/social-links"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <LogoIcon className="size-6 text-primary" />
              <h2 className="text-xl font-bold">ErgoFlex Store</h2>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Comfort for a better life.</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-4">
              {["Home", "Products", "About Us", "Contact"].map((label) => {
                const href = `/${label.toLowerCase().replace(" ", "-")}`
                return (
                  <li key={`footer-${label}`}>
                    <UiLink className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" href={href}>
                      {label}
                    </UiLink>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">Contact Info</h3>
            <ul className="mt-4 space-y-4 text-base text-gray-500 dark:text-gray-400">
              <li>support@ergoflex.com</li>
              <li>(123) 456-7890</li>
              <li>123 Ergonomic Ave, Comfort City</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">Follow Us</h3>
            <div className="flex mt-4 gap-3">
              {socialLinks.map(({ name, href, Icon }) => (
                <Button key={name} variant="outline" size="icon" className="rounded-full" asChild>
                  <Link href={href} aria-label={name}>
                    <Icon className="h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Separator className="mt-8" />
        <div className="pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2024 ErgoFlex Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}


