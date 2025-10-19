"use client"

import Link from "next/link"
import type { ComponentType } from "react"

export type Category = {
  name: string
  icon: ComponentType<{ className?: string }>
  href: string
  active?: boolean
}

export function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <div className="flex flex-col gap-2">
      {categories.map((cat) => (
        <Link
          key={cat.name}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            cat.active
              ? "bg-primary/10 dark:bg-primary/20 text-primary"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
          }`}
          href={cat.href}
        >
          <cat.icon className="w-5 h-5" />
          <p className="text-sm font-medium">{cat.name}</p>
        </Link>
      ))}
    </div>
  )
}


