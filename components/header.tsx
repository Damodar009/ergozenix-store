"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoIcon } from "@/components/logo-icon"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/cart-context"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

export function Header() {
  const pathname = usePathname()
  const { itemCount } = useCart()

  return (
    <header className="bg-[var(--ef-surface-container-lowest)] sticky top-0 z-50 border-b border-[var(--ef-outline-variant)]">
      <div className="flex justify-between items-center h-[64px] w-full px-8 md:px-12 lg:px-16">
        <div className="flex-1 flex justify-start items-center">
          <Link href="/" className="flex items-center gap-2 text-[var(--ef-on-surface)] cursor-pointer">
            <LogoIcon className="w-6 h-6" />
            <div 
              className="font-semibold"
              style={{
                fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
                fontSize: "13px",
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              ErgoZenix
            </div>
          </Link>
        </div>
        
        <nav className="hidden md:flex flex-none justify-center gap-[var(--ef-stack-lg)] h-full items-center">
          <Link 
            href="/shop" 
            className={cn(
              "pb-1 cursor-pointer transition-colors duration-200 uppercase",
              pathname === "/shop" ? "text-[var(--ef-primary)] border-b-2 border-[var(--ef-primary)]" : "text-[var(--ef-on-surface-variant)] hover:text-[var(--ef-primary-container)]"
            )}
            style={{
              fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "2px",
            }}
          >
            Shop
          </Link>
          <Link 
            href="/contact" 
            className={cn(
              "pb-1 cursor-pointer transition-colors duration-200 uppercase",
              pathname === "/contact" ? "text-[var(--ef-primary)] border-b-2 border-[var(--ef-primary)]" : "text-[var(--ef-on-surface-variant)] hover:text-[var(--ef-primary-container)]"
            )}
            style={{
              fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "2px",
            }}
          >
            Contact
          </Link>
          <Link 
            href="/about" 
            className={cn(
              "pb-1 cursor-pointer transition-colors duration-200 uppercase",
              pathname === "/about" ? "text-[var(--ef-primary)] border-b-2 border-[var(--ef-primary)]" : "text-[var(--ef-on-surface-variant)] hover:text-[var(--ef-primary-container)]"
            )}
            style={{
              fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "2px",
            }}
          >
            About
          </Link>
        </nav>
        
        <div className="flex-1 flex justify-end items-center gap-[var(--ef-stack-sm)] md:gap-[var(--ef-stack-md)]">
          <Link href="/wishlist" className="relative text-[var(--ef-on-surface-variant)] cursor-pointer hover:text-[var(--ef-primary)] transition-colors flex items-center justify-center w-10 h-10">
            <span className="material-symbols-outlined">favorite</span>
          </Link>
          <Link href="/cart" className="relative text-[var(--ef-on-surface-variant)] cursor-pointer hover:text-[var(--ef-primary)] transition-colors flex items-center justify-center w-10 h-10">
            <span className="material-symbols-outlined">shopping_cart</span>
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-[var(--ef-primary)] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden flex items-center justify-center w-10 h-10 text-[var(--ef-on-surface-variant)] hover:text-[var(--ef-primary)] transition-colors">
                <span className="material-symbols-outlined">menu</span>
                <span className="sr-only">Toggle menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-6 flex flex-col h-full bg-[var(--ef-surface-container-lowest)] border-l border-[var(--ef-outline-variant)]">
              <SheetHeader className="mb-6 text-left">
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2 text-[var(--ef-on-surface)] cursor-pointer">
                    <LogoIcon className="w-6 h-6" />
                    <div 
                      className="font-semibold"
                      style={{
                        fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
                        fontSize: "13px",
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                      }}
                    >
                      ErgoZenix
                    </div>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col gap-1 flex-1 mt-4">
                {[
                  { href: "/shop", label: "Shop" },
                  { href: "/contact", label: "Contact" },
                  { href: "/about", label: "About" },
                ].map(({ href, label }) => (
                  <SheetClose key={href} asChild>
                    <Link
                      href={href}
                      className={cn(
                        "font-medium px-4 py-3 rounded-md transition-colors",
                        pathname === href ? "bg-[var(--ef-surface-container-highest)] text-[var(--ef-primary)]" : "text-[var(--ef-on-surface)] hover:bg-[var(--ef-surface-container)]"
                      )}
                      style={{
                        fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        fontSize: "13px",
                        fontWeight: 600
                      }}
                    >
                      {label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

