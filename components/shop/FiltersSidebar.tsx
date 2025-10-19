"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CategoryList, type Category } from "@/components/shop/CategoryList"

export function FiltersSidebar({ categories }: { categories: Category[] }) {
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
            <CategoryList categories={categories} />
          </div>

          <div className="w-full h-px bg-gray-200 dark:bg-gray-800" />

          <div className="@container">
            <div className="relative flex w-full flex-col items-start gap-3">
              <p className="text-base font-medium leading-normal text-[#111718] dark:text-white w-full">Price Range</p>
              <div className="flex h-[38px] w-full pt-1.5">
                <div className="flex h-1 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                  <div className="relative w-1/4">
                    <div className="absolute -left-2 -top-1.5 flex flex-col items-center gap-1">
                      <div className="size-4 rounded-full bg-primary ring-2 ring-white dark:ring-background-dark cursor-pointer" />
                      <p className="text-sm font-normal leading-normal text-gray-600 dark:text-gray-400">$250</p>
                    </div>
                  </div>
                  <div className="h-1 flex-1 bg-primary" />
                  <div className="relative w-1/4">
                    <div className="absolute -right-2 -top-1.5 flex flex-col items-center gap-1">
                      <div className="size-4 rounded-full bg-primary ring-2 ring-white dark:ring-background-dark cursor-pointer" />
                      <p className="text-sm font-normal leading-normal text-gray-600 dark:text-gray-400">$750</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button className="h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
            Clear All Filters
          </Button>
        </Card>
      </div>
    </aside>
  )
}


