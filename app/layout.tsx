import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Playfair_Display, Hanken_Grotesk } from "next/font/google"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/providers/theme-provider"
import "./globals.css"
import { Header } from "@/components/header"
import { CartProvider } from "@/context/cart-context"
import DeviceSessionTracker from "@/components/DeviceSessionTracker"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-playfair-display",
  display: "swap",
})

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-hanken-grotesk",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "ErgoZenix",
    template: "%s | ErgoZenix",
  },
  description: "ErgoZenix - Your premium destination for ergonomic office furniture and accessories. Discover high-quality ergonomic chairs, standing desks, and workspace solutions designed for comfort, productivity, and long-term health.",

  keywords: [
    "ergonomic chair", "standing desk", "ergonomic office furniture",
    "workspace accessories", "ergonomic setup", "office health",
  ],

  metadataBase: new URL("https://ergozenix.com"),
  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "ErgoZenix – Premium Ergonomic Furniture",
    description: "High-quality ergonomic chairs, standing desks, and workspace solutions for comfort and productivity.",
    url: "https://ergozenix.com",
    siteName: "ErgoZenix",
    images: [
      {
        url: "/logo_v2.1.png",
        width: 2400,      // ← increased
        height: 1260,     // ← increased 
        alt: "ErgoZenix – Ergonomic Office Furniture",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ErgoZenix – Premium Ergonomic Furniture",
    description: "Discover ergonomic chairs, standing desks, and workspace solutions.",
    images: ["/logo_v2.1.png"],
  },

  icons: {
    icon: "/logo_v2.1.png",
    shortcut: "/logo_v2.1.png",
    apple: "/logo_v2.1.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
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
      <body className={`font-sans antialiased ${playfairDisplay.variable} ${hankenGrotesk.variable}`}>
        <ThemeProvider>
          <CartProvider>
            <DeviceSessionTracker />
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
