"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

export type BreadcrumbItem = {
  label: string
  href?: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="flex flex-wrap gap-2 py-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link
              className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary"
              href={item.href}
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#111718] dark:text-white text-sm font-medium leading-normal">
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          )}
        </div>
      ))}
    </div>
  )
}
