import { supabase } from '@/lib/supabase/client'
import type {
  Product,
  ProductWithDetails,
  ProductCard,
  ProductFilters,
  ProductSortOptions,
  Brand,
  Category,
  ProductImage,
  ProductReview,
} from '@/models/product'

export class ProductService {
  /**
   * Get featured products with images, brand, and category info
   * Returns simplified ProductCard objects for easy display
   */
  static async getFeaturedProducts(limit: number = 6): Promise<ProductCard[]> {
    try {
      // Fetch products with related data
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          brands:brand_id (
            id,
            name,
            slug
          ),
          categories:category_id (
            id,
            name,
            slug
          ),
          product_images (
            id,
            image_url,
            is_primary,
            sort_order
          )
        `)
        .eq('status', 'active')
        .is('deleted_at', null)
        .gt('stock_quantity', 0)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (productsError) {
        console.error('Error fetching featured products:', productsError)
        throw productsError
      }

      if (!products || products.length === 0) {
        return []
      }

      // Get review stats for these products
      const productIds = products.map(p => p.id)
      const { data: reviews } = await supabase
        .from('product_reviews')
        .select('product_id, rating')
        .in('product_id', productIds)
        .is('deleted_at', null)

      // Calculate average ratings and review counts
      const reviewStats = new Map<number, { average: number; count: number; total?: number }>()
      if (reviews) {
        reviews.forEach(review => {
          const stats = reviewStats.get(review.product_id) || { average: 0, count: 0, total: 0 }
          reviewStats.set(review.product_id, {
            average: stats.average,
            count: stats.count + 1,
            total: (stats.total || 0) + review.rating,
          })
        })
        
        // Calculate averages
        reviewStats.forEach((stats, productId) => {
          reviewStats.set(productId, {
            average: (stats.total || 0) / stats.count,
            count: stats.count,
          })
        })
      }

      // Transform to ProductCard format
      return products.map(product => {
        const images = product.product_images || []
        const primaryImage = images.find((img: ProductImage) => img.is_primary)
        const firstImage = images.sort((a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order)[0]
        const stats = reviewStats.get(product.id)

        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          base_price: product.base_price,
          sale_price: product.sale_price,
          stock_quantity: product.stock_quantity,
          status: product.status,
          primary_image: primaryImage?.image_url || firstImage?.image_url || null,
          brand_name: product.brands?.name || null,
          category_name: product.categories?.name || null,
          average_rating: stats?.average,
          review_count: stats?.count,
        } as ProductCard
      })
    } catch (error) {
      console.error('Error in getFeaturedProducts:', error)
      throw error
    }
  }

  /**
   * Get a single product with all details
   */
  static async getProductById(id: number): Promise<ProductWithDetails | null> {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          brands:brand_id (*),
          categories:category_id (*),
          product_images (*),
          product_variants (*),
          product_reviews (*)
        `)
        .eq('id', id)
        .is('deleted_at', null)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
        return null
      }

      // Calculate review stats
      const reviews = product.product_reviews || []
      const validReviews = reviews.filter((r: ProductReview) => !r.deleted_at)
      const average_rating = validReviews.length > 0
        ? validReviews.reduce((sum: number, r: ProductReview) => sum + r.rating, 0) / validReviews.length
        : undefined

      return {
        ...product,
        brand: product.brands,
        category: product.categories,
        images: product.product_images?.filter((img: ProductImage) => !img.deleted_at) || [],
        variants: product.product_variants || [],
        reviews: validReviews,
        average_rating,
        review_count: validReviews.length,
      } as ProductWithDetails
    } catch (error) {
      console.error('Error in getProductById:', error)
      return null
    }
  }

  /**
   * Get a single product by slug with all details including attributes
   */
  static async getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          brands:brand_id (*),
          categories:category_id (*),
          product_images (*),
          product_variants (*),
          product_reviews (*)
        `)
        .eq('slug', slug)
        .is('deleted_at', null)
        .single()

      if (error) {
        console.error('Error fetching product by slug:', error)
        return null
      }

      // Fetch product attributes with their definitions
      const { data: attributeValues, error: attrError } = await supabase
        .from('product_attribute_values')
        .select(`
          *,
          product_attributes (*)
        `)
        .eq('product_id', product.id)
        .is('deleted_at', null)

      if (attrError) {
        console.error('Error fetching product attributes:', attrError)
      }

      // Calculate review stats
      const reviews = product.product_reviews || []
      const validReviews = reviews.filter((r: ProductReview) => !r.deleted_at)
      const average_rating = validReviews.length > 0
        ? validReviews.reduce((sum: number, r: ProductReview) => sum + r.rating, 0) / validReviews.length
        : undefined

      return {
        ...product,
        brand: product.brands,
        category: product.categories,
        images: product.product_images?.filter((img: ProductImage) => !img.deleted_at) || [],
        variants: product.product_variants || [],
        attributes: attributeValues?.map(av => ({
          ...av,
          attribute: av.product_attributes
        })) || [],
        reviews: validReviews,
        average_rating,
        review_count: validReviews.length,
      } as ProductWithDetails
    } catch (error) {
      console.error('Error in getProductBySlug:', error)
      return null
    }
  }

  /**
   * Get products with filters and sorting
   */
  static async getProducts(
    filters?: ProductFilters,
    sort?: ProductSortOptions,
    limit?: number,
    offset?: number
  ): Promise<ProductCard[]> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          brands:brand_id (name),
          categories:category_id (name),
          product_images (image_url, is_primary, sort_order)
        `)
        .is('deleted_at', null)

      // Apply filters
      if (filters) {
        if (filters.category_id) {
          query = query.eq('category_id', filters.category_id)
        }
        if (filters.brand_id) {
          query = query.eq('brand_id', filters.brand_id)
        }
        if (filters.status) {
          query = query.eq('status', filters.status)
        }
        if (filters.min_price !== undefined) {
          query = query.gte('base_price', filters.min_price)
        }
        if (filters.max_price !== undefined) {
          query = query.lte('base_price', filters.max_price)
        }
        if (filters.search) {
          query = query.ilike('name', `%${filters.search}%`)
        }
        if (filters.in_stock) {
          query = query.gt('stock_quantity', 0)
        }
      }

      // Apply sorting
      if (sort) {
        query = query.order(sort.field, { ascending: sort.ascending ?? true })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      // Apply pagination
      if (limit) {
        query = query.limit(limit)
      }
      if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1)
      }

      const { data: products, error } = await query

      if (error) {
        console.error('Error fetching products:', error)
        throw error
      }

      if (!products || products.length === 0) {
        return []
      }

      // Transform to ProductCard format
      return products.map(product => {
        const images = product.product_images || []
        const primaryImage = images.find((img: ProductImage) => img.is_primary)
        const firstImage = images.sort((a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order)[0]

        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          base_price: product.base_price,
          sale_price: product.sale_price,
          stock_quantity: product.stock_quantity,
          status: product.status,
          primary_image: primaryImage?.image_url || firstImage?.image_url || null,
          brand_name: product.brands?.name || null,
          category_name: product.categories?.name || null,
        } as ProductCard
      })
    } catch (error) {
      console.error('Error in getProducts:', error)
      throw error
    }
  }

  /**
   * Get all categories
   */
  static async getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      throw error
    }

    return data || []
  }

  /**
   * Get all brands
   */
  static async getAllBrands(): Promise<Brand[]> {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching brands:', error)
      throw error
    }

    return data || []
  }

  /**
   * Search products by name or description
   */
  static async searchProducts(query: string, limit: number = 20): Promise<ProductCard[]> {
    return this.getProducts(
      { search: query, status: 'active' },
      { field: 'name', ascending: true },
      limit
    )
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(
    categoryId: number,
    limit?: number,
    offset?: number
  ): Promise<ProductCard[]> {
    return this.getProducts(
      { category_id: categoryId, status: 'active' },
      { field: 'created_at', ascending: false },
      limit,
      offset
    )
  }

  /**
   * Get products by brand
   */
  static async getProductsByBrand(
    brandId: number,
    limit?: number,
    offset?: number
  ): Promise<ProductCard[]> {
    return this.getProducts(
      { brand_id: brandId, status: 'active' },
      { field: 'created_at', ascending: false },
      limit,
      offset
    )
  }
}
