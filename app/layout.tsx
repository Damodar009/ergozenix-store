import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/providers/theme-provider"
import "./globals.css"
import { Header } from "@/components/header"
import { CartProvider } from "@/context/cart-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ErgoZenix",
  description: "ErgoZenix - Your premium destination for ergonomic office furniture and accessories. Discover high-quality ergonomic chairs, standing desks, and workspace solutions designed for comfort, productivity, and long-term health. Shop now for the perfect ergonomic setup.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`font-sans antialiased`}>
        <ThemeProvider>
          <CartProvider>
            <Header/>
            {children}
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
