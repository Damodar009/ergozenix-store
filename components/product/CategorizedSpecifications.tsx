"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Ruler, Zap, Package, Sparkles, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface ProductSpec {
  label: string
  value: string
}

export interface SpecificationCategory {
  name: string
  icon?: React.ReactNode
  specs: ProductSpec[]
}

interface CategorizedSpecificationsProps {
  categories: SpecificationCategory[]
}

export function CategorizedSpecifications({ categories }: CategorizedSpecificationsProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map(cat => cat.name)) // All expanded by default
  )

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryName)) {
        next.delete(categoryName)
      } else {
        next.add(categoryName)
      }
      return next
    })
  }

  // Filter out empty categories
  const nonEmptyCategories = categories.filter(cat => cat.specs.length > 0)

  if (nonEmptyCategories.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">Detailed Specifications</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nonEmptyCategories.map((category) => {
          const isExpanded = expandedCategories.has(category.name)
          
          return (
            <Card key={category.name} className="overflow-hidden">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleCategory(category.name)}
              >
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    {category.icon && (
                      <span className="text-primary">{category.icon}</span>
                    )}
                    <span>{category.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      ({category.specs.length})
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </CardTitle>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {category.specs.map((spec, index) => (
                      <div 
                        key={index}
                        className="flex justify-between items-start py-2 border-b border-border last:border-0"
                      >
                        <span className="text-sm text-muted-foreground font-medium">
                          {spec.label}
                        </span>
                        <span className="text-sm text-foreground font-semibold text-right ml-4">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// Helper function to get icon for category
export function getCategoryIcon(categoryName: string): React.ReactNode {
  const name = categoryName.toLowerCase()
  
  if (name.includes('dimension') || name.includes('weight')) {
    return <Ruler className="h-5 w-5" />
  }
  if (name.includes('performance')) {
    return <Zap className="h-5 w-5" />
  }
  if (name.includes('material') || name.includes('finish')) {
    return <Package className="h-5 w-5" />
  }
  if (name.includes('feature')) {
    return <Sparkles className="h-5 w-5" />
  }
  return <Info className="h-5 w-5" />
}
