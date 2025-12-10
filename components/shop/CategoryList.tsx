"use client"

import type { ComponentType } from "react"
import { cn } from "@/lib/utils"

export type Category = {
  id?: string | number
  name: string
  icon?: ComponentType<{ className?: string }>
  href?: string
}

interface CategoryListProps {
  categories: Category[]
  selectedCategory: string | number | null
  onSelectCategory: (id: string | number | null) => void
}

export function CategoryList({ categories, selectedCategory, onSelectCategory }: CategoryListProps) {
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left",
          selectedCategory === null
            ? "bg-primary/10 dark:bg-primary/20 text-primary"
            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
        )}
      >
        <div className="w-5 h-5 flex items-center justify-center font-bold">A</div>
        <p className="text-sm font-medium">All Products</p>
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id || cat.name}
          onClick={() => onSelectCategory(cat.id || null)}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left",
            selectedCategory === (cat.id || null)
              ? "bg-primary/10 dark:bg-primary/20 text-primary"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
          )}
        >
          {cat.icon ? <cat.icon className="w-5 h-5" /> : <div className="w-5 h-5" />}
          <p className="text-sm font-medium">{cat.name}</p>
        </button>
      ))}
    </div>
  )
}


