"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CategoryList, type Category } from "@/components/shop/CategoryList"
import { Slider } from "@/components/ui/slider"

interface FiltersSidebarProps {
  categories: Category[]
  selectedCategory: string | number | null
  onCategoryChange: (id: string | number | null) => void
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
  onClearFilters: () => void
}

export function FiltersSidebar({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  priceRange,
  onPriceChange,
  onClearFilters
}: FiltersSidebarProps) {
  return (
    <aside className="w-full lg:w-1/4">
      <div className="sticky top-20">
        <Card className="flex flex-col gap-6 p-6 rounded-lg bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex flex-col">
            <h3 className="text-lg font-medium leading-normal text-[#111718] dark:text-white">Filter by</h3>
            <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">Refine Your Search</p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-base font-medium text-[#111718] dark:text-white">Category</h4>
            <CategoryList 
              categories={categories} 
              selectedCategory={selectedCategory}
              onSelectCategory={onCategoryChange}
            />
          </div>

          <div className="w-full h-px bg-gray-200 dark:bg-gray-800" />

          <div className="@container">
            <div className="relative flex w-full flex-col items-start gap-4">
              <div className="flex justify-between w-full items-center">
                <p className="text-base font-medium leading-normal text-[#111718] dark:text-white">Price Range</p>
                <p className="text-sm font-medium text-primary">
                  Rs {priceRange[0]} - Rs {priceRange[1]}
                </p>
              </div>
              
              <Slider
                defaultValue={[0, 100000]}
                value={priceRange}
                max={150000}
                step={1000}
                onValueChange={(val) => onPriceChange(val as [number, number])}
                className="w-full py-2"
              />
              
              <div className="flex justify-between w-full text-xs text-muted-foreground mt-1">
                <span>Rs 0</span>
                <span>Rs 150k+</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={onClearFilters}
            variant="outline"
            className="h-10 px-4 w-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors border-primary/20"
          >
            Clear All Filters
          </Button>
        </Card>
      </div>
    </aside>
  )
}


