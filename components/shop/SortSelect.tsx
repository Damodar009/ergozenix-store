"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SortSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 shrink-0 w-[160px] bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
        <span className="text-sm font-medium leading-normal text-[#111718] dark:text-white">
          Sort by: <SelectValue placeholder="Newest" />
        </span>
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
        <SelectItem value="popular">Popular</SelectItem>
      </SelectContent>
    </Select>
  )
}


