import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Playfair_Display, Hanken_Grotesk } from "next/font/google"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/providers/theme-provider"
import "./globals.css"
import { Header } from "@/components/header"
import { CartProvider } from "@/context/cart-context"
import { WishlistProvider } from "@/context/wishlist-context"
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
    default: "ErgoZenix | Premium Standing Desks & Ergonomic Office Furniture",
    template: "%s | ErgoZenix",
  },
  description: "ErgoZenix is Nepal's premier store for professional ergonomic office solutions. Discover high-quality height-adjustable standing desks, ergonomic chairs, mechanical keyboards, monitor arms, and desk accessories designed for comfort, productivity, and health.",

  keywords: [
    "standing desk", "adjustable height desk", "ergonomic office chair",
    "mechanical split keyboard", "ergonomic keyboard", "desk accessories",
    "monitor arms", "ergonomic office furniture", "posture correction chair",
    "workspace accessories", "ergonomic setup", "home office furniture Nepal",
    "standing desk Kathmandu", "ergonomics products"
  ],

  metadataBase: new URL("https://ergozenix.com"),
  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "ErgoZenix | Premium Standing Desks & Ergonomic Office Furniture",
    description: "Shop premium height-adjustable standing desks, ergonomic chairs, mechanical split keyboards, monitor arms, and workspace accessories in Nepal.",
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
    title: "ErgoZenix | Premium Standing Desks & Ergonomic Office Furniture",
    description: "Discover standing desks, ergonomic chairs, split keyboards, monitor arms, and workspace accessories in Nepal.",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  if (theme === 'light') {
                    theme = 'dark';
                    localStorage.setItem('theme', 'dark');
                  }
                  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "ErgoZenix",
              "image": "https://ergozenix.com/logo_v2.1.png",
              "@id": "https://ergozenix.com/#store",
              "url": "https://ergozenix.com",
              "telephone": "+977-9760682990",
              "priceRange": "NPR",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Basundhara, Chakrapath Ring Road",
                "addressLocality": "Kathmandu",
                "postalCode": "44600",
                "addressCountry": "NP"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 27.741013,
                "longitude": 85.335037
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "09:00",
                "closes": "18:00"
              },
              "sameAs": [
                "https://www.facebook.com/ergozenix",
                "https://www.instagram.com/ergozenix"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ErgoZenix",
              "url": "https://ergozenix.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://ergozenix.com/shop?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`font-sans antialiased ${playfairDisplay.variable} ${hankenGrotesk.variable}`}>
        <ThemeProvider>
          <CartProvider>
            <WishlistProvider>
              <DeviceSessionTracker />
              <Header />
              {children}
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
