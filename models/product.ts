/**
 * Product-related type definitions matching the Supabase schema
 */

export interface Brand {
  id: number
  name: string
  slug: string | null
  website: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface Category {
  id: number
  name: string
  slug: string | null
  parent_id: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ProductImage {
  id: number
  product_id: number
  image_url: string
  is_primary: boolean
  sort_order: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ProductVariant {
  id: number
  product_id: number
  variant_sku: string | null
  variant_price: number | null
  variant_stock: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ProductAttribute {
  id: number
  name: string
  slug: string | null
  input_type: 'text' | 'number' | 'dropdown' | 'boolean' | 'file' | null
  unit: string | null
  is_multiple: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ProductAttributeValue {
  id: number
  product_id: number
  attribute_id: number
  value_text: string | null
  value_number: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ProductReview {
  id: number
  product_id: number
  user_id: number
  rating: number
  review: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

/**
 * Base Product interface matching the products table
 */
export interface Product {
  id: number
  name: string
  slug: string | null
  sku: string | null
  description: string | null
  brand_id: number | null
  category_id: number | null
  base_price: number
  sale_price: number | null
  stock_quantity: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  deleted_at: string | null
}

/**
 * Product with all related data (for detailed views)
 */
export interface ProductWithDetails extends Product {
  brand?: Brand | null
  category?: Category | null
  images?: ProductImage[]
  variants?: ProductVariant[]
  attributes?: (ProductAttributeValue & { attribute?: ProductAttribute })[]
  reviews?: ProductReview[]
  average_rating?: number
  review_count?: number
}

/**
 * Simplified product for display in lists/cards (featured products, etc.)
 */
export interface ProductCard {
  id: number
  name: string
  slug: string | null
  description: string | null
  base_price: number
  sale_price: number | null
  stock_quantity: number
  status: 'active' | 'inactive'
  primary_image: string | null
  brand_name: string | null
  category_name: string | null
  average_rating?: number
  review_count?: number
}

/**
 * Helper type for product queries
 */
export interface ProductFilters {
  category_id?: number
  brand_id?: number
  min_price?: number
  max_price?: number
  status?: 'active' | 'inactive'
  search?: string
  in_stock?: boolean
}

export interface ProductSortOptions {
  field: 'name' | 'base_price' | 'created_at' | 'updated_at'
  ascending?: boolean
}
