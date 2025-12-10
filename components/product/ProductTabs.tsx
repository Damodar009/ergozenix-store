"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProductTabsProps {
  reviewsContent: React.ReactNode
  detailsContent: React.ReactNode
}

export function ProductTabs({ reviewsContent, detailsContent }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"reviews" | "details">("reviews")

  return (
    <div className="mt-16">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav aria-label="Tabs" className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("reviews")}
            className={cn(
              "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === "reviews"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
            )}
          >
            Customer Reviews
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={cn(
              "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === "details"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
            )}
          >
            Details
          </button>
        </nav>
      </div>
      <div className="py-8">
        {activeTab === "reviews" ? reviewsContent : detailsContent}
      </div>
    </div>
  )
}
