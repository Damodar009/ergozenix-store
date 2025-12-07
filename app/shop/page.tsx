"use client"

import React from "react"
import { Header } from "@/components/header"
import { FiltersSidebar } from "@/components/shop/FiltersSidebar"
import { ProductCard, type ProductItem } from "@/components/shop/ProductCard"
import { SortSelect } from "@/components/shop/SortSelect"
import { Pagination } from "@/components/shop/Pagination"
import { Car, Monitor, Box, Mouse } from "lucide-react"
import type { Category } from "@/components/shop/CategoryList"

const productList: ProductItem[] = [
  {
    id: 1,
    name: "ErgoFlex Pro Chair",
    description: "Ultimate lumbar support for all-day comfort.",
    price: "$399.99",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqeP2jDX-1SyL1jJxZ2n74835k0B3w0tshNOhGL87barUvG20baIMCU87RbM4emPmpypHQ2B2mYNRsqYtxYr8dcDKHLXxxSMCmW-YKLRDh0VA3Leyz0bAomNJSgj2HawabJHBf7VUr2L0DkJRGaXdX2SdXBbocuhkLpSTsLp7pYNZZpOr-zFAK4PKxrJyMzW57rqpVzCyIpkQpuTZvqgXsYXZFoOrrSfHNSZB1XRb27MXNIpGFfEOz42bRLXcXHCrrb9qv8OllwtOt",
    alt: "ErgoFlex Pro Chair against a plain background",
  },
  {
    id: 2,
    name: "Sit-Stand Desk X1",
    description: "Adjustable height for perfect posture.",
    price: "$599.00",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC0OHcvnZwJCVEWkQwDn8fl0yKlGgfs-kex4L_aDBihO-wQinE46WYoAD63_KCUVmxHaZvVkwSk1Fen3JuHKPfLCRIK4V01fDyGPjbgZi7KfThQzbbHbHwyUR6VIb7fA3aazTH67aaO5XoJN-qnggnn84YRWzpXIrd-ZhjGyFySjxepW7E5vqhi5qnRT5K6yR9Z-tiPe8ibWDiBvtsTFvf8eX0FXUCbD_EaLXwMXIptQq9Y6LTMm-SW4vaG_JHhiE_TYDo9WcWJbT5K",
    alt: "Sit-Stand Desk X1 in a modern office setting",
  },
  {
    id: 3,
    name: "ErgoRest Footstool",
    description: "Elevate your feet, improve your circulation.",
    price: "$79.50",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAnsQHhU28Y6dyWIJMkkPE9ViJoFbsHN3-pImEccupjIQoIgnvB_ppDAp1GPPQ5-5j2F_9nf33oN0E-vIgNwAT03VvqK178bmj-FoIZhAU-vjlQ7vJj1KIkqL9aBZvL6a8sRCkPTzXCZXs7PzMdEyJxeDHTH9iLnzseIx84u2MB_WIw3sD-K1Gd4RKGVfIV-eidFFy779ZSUzD9vtG_EHSDcp8XeRGDLxsYsS96NTHM4m28Pdhs2anavW_V_KB0M4NS7Tn4MlsfMDde",
    alt: "ErgoRest Footstool with a textured fabric",
  },
  {
    id: 4,
    name: "Vertical Ergonomic Mouse",
    description: "Natural handshake position for less strain.",
    price: "$45.99",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCZWM3tYlKRbVB1pXyq1cOnE2dpRs4f1bHcqogKf0AW6ouA7IGhKlLIMnFIgU_jcklda7QmBSmaFD_OEeCI7wRdaDm77QiN8D1-Gzgph390pzZYZCAXHXZWSdw7LN-cSaadRKc2GkbxyxwoLXLBPWkFFNzZeHET-tuQycu2OY-yTFCfpsb0D0fm7GSCfzRSMvMBehnkHMJpp4BIzzfc9qZ9P8RWtVMk_sPwd2tRea_m2X-7Kmlce7kjcapzPLGZ3biIjZXdGLn70i3J",
    alt: "Vertical Ergonomic Mouse on a desk mat",
  },
  {
    id: 5,
    name: "Adjustable Laptop Stand",
    description: "Raise your screen to eye level.",
    price: "$65.00",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCB8lbO1G0XMmFSd0YqzWjgcEphVx7vNE1_pe78Hhhh0vtyCeNrx5eRXGoXs7V8N5sVYWTrz3HrpoCKRJ2ZUjbWyTWC5CxOH0jk4NQ1YM_Jhl8rYucxfWzYe0r5qXhzQpWjLAqqrwqGKkwZItOI0aVRESFOUumfigwaTSQwRq2zf61Lg17Xib-RvyjHt0URQalSNuVf5k7zUoSG6xsxU2cm3WSH9gCM7A6Hv250BEjGEiFzk15eJ1OJ_gcPuowrfN0I3Q0koj4GRNSO",
    alt: "Adjustable Laptop Stand holding a laptop",
  },
  {
    id: 6,
    name: "ErgoFlex Mesh Chair",
    description: "Breathable mesh for cool comfort.",
    price: "$289.99",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBvILZycOGp1iFIhYRqAjHe7AgHs9D0Bn433gFSZnvNfgyeJ2-Tpem2cfz4L7S5BX04Iw6bC1guhqEuV5lr2rWR4r-5yHastiARE3qAv7RhNDmGB82XIhaS0z-9EEZTQ4fb3UcAcwD6HX6K40BNgsR9syQRC9Ktjh5x5oVeM6L21HQqO8UUBM6QeFD3RS9dAfbxAfGD30O6sQUZBDz0MjVDzjapKh70emRqZ-ctJtl5zLa3PjgPw7pwux3Vs6_oy9HJGtmZzrPlSrSC",
    alt: "ErgoFlex Mesh Chair from the side",
  },
]

const categories: Category[] = [
  { name: "Chairs", icon: Car, href: "#", active: true },
  { name: "Desks", icon: Monitor, href: "#", active: false },
  { name: "Stands", icon: Box, href: "#", active: false },
  { name: "Accessories", icon: Mouse, href: "#", active: false },
]

export default function shop() {
  const [sortBy, setSortBy] = React.useState("newest")

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col w-full max-w-7xl">
          <div className="flex flex-wrap justify-between gap-4 items-center mb-8">
            <p className="text-3xl lg:text-4xl font-black leading-tight tracking-[-0.033em] text-foreground">
              Shop Our Ergonomic Products
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <FiltersSidebar categories={categories} />

            <div className="w-full lg:w-3/4">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <p className="text-sm text-muted-foreground">Showing 1-9 of 27 results</p>
                <div className="flex gap-3 flex-wrap">
                  <SortSelect value={sortBy} onChange={setSortBy} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {productList.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <Pagination />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


