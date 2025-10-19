"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Pagination() {
  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center">
      <Link className="relative inline-flex items-center rounded-l-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700" href="#" aria-label="Previous Page">
        <span className="sr-only">Previous</span>
        <ChevronLeft className="h-5 w-5" />
      </Link>
      <Link aria-current="page" className="relative z-10 inline-flex items-center border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary" href="#">1</Link>
      <Link className="relative inline-flex items-center border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700" href="#">2</Link>
      <Link className="relative hidden items-center border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 md:inline-flex" href="#">3</Link>
      <span className="relative inline-flex items-center border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">...</span>
      <Link className="relative hidden items-center border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 md:inline-flex" href="#">8</Link>
      <Link className="relative inline-flex items-center rounded-r-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700" href="#" aria-label="Next Page">
        <span className="sr-only">Next</span>
        <ChevronRight className="h-5 w-5" />
      </Link>
    </nav>
  )
}


