import { supabase } from '@/services/supabase'
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
  ProductAttribute,
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
          product_variants (
            *,
            product_variant_option_values (option_value_id)
          ),
          product_options (
            *,
            product_option_values (*)
          ),
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
        options: (product.product_options || []).map((o: any) => ({
          ...o,
          values: (o.product_option_values || []).sort((a: any, b: any) => a.id - b.id)
        })).sort((a: any, b: any) => a.position - b.position),
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
          product_variants (
            *,
            product_variant_option_values (option_value_id)
          ),
          product_options (
            *,
            product_option_values (*)
          ),
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
        options: (product.product_options || []).map((o: any) => ({
          ...o,
          values: (o.product_option_values || []).sort((a: any, b: any) => a.id - b.id)
        })).sort((a: any, b: any) => a.position - b.position),
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

  /**
   * Get all product attributes
   */
  static async getAllAttributes(): Promise<ProductAttribute[]> {
    const { data, error } = await supabase
      .from('product_attributes')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching attributes:', error)
      throw error
    }

    return data || []
  }

  /**
   * Create a new product in the database along with its images, attributes, and variants.
   * Performs all insertions and rolls back (deletes the product) if any child table insert fails.
   */
  static async createProduct(data: {
    name: string
    slug?: string
    sku?: string
    description?: string
    base_price: number
    sale_price?: number | null
    stock_quantity?: number
    status?: 'active' | 'inactive'
    brand_id?: number | null
    category_id?: number | null
    images?: { image_url: string; is_primary: boolean; sort_order: number }[]
    attributes?: { attribute_id: number; value_text?: string; value_number?: number }[]
    options?: {
      name: string
      position: number
      values: {
        value: string
        image_url: string | null
        price_offset: number
        stock_override: number | null
      }[]
    }[]
    variants?: {
      variant_sku: string
      variant_price: number
      variant_stock: number
      variant_url?: string | null
      combinationValues: { optionName: string; valueName: string }[]
    }[]
  }): Promise<Product> {
    let createdProductId: number | null = null
    try {
      // Generate slug if not provided
      const slug = data.slug || data.name
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `product-${Date.now()}`

      // Insert main product
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert({
          name: data.name,
          slug,
          sku: data.sku || null,
          description: data.description || null,
          brand_id: data.brand_id || null,
          category_id: data.category_id || null,
          base_price: Number(data.base_price) || 0,
          sale_price: data.sale_price ? Number(data.sale_price) : null,
          stock_quantity: Number(data.stock_quantity) || 0,
          status: data.status || 'active',
        })
        .select()
        .single()

      if (productError) {
        console.error('Error inserting product:', productError)
        throw productError
      }

      if (!newProduct) {
        throw new Error('Product creation failed - no data returned')
      }

      createdProductId = newProduct.id

      // Insert images if provided
      if (data.images && data.images.length > 0) {
        const imageInserts = data.images.map((img) => ({
          product_id: createdProductId,
          image_url: img.image_url,
          is_primary: img.is_primary,
          sort_order: img.sort_order,
        }))

        const { error: imageError } = await supabase
          .from('product_images')
          .insert(imageInserts)

        if (imageError) {
          console.error('Error inserting product images:', imageError)
          throw new Error(`Failed to save images: ${imageError.message}`)
        }
      }

      // Insert dynamic attributes if provided
      if (data.attributes && data.attributes.length > 0) {
        const attributeInserts = data.attributes.map((attr) => ({
          product_id: createdProductId,
          attribute_id: attr.attribute_id,
          value_text: attr.value_text || null,
          value_number: attr.value_number !== undefined ? Number(attr.value_number) : null,
        }))

        const { error: attrError } = await supabase
          .from('product_attribute_values')
          .insert(attributeInserts)

        if (attrError) {
          console.error('Error inserting product attributes:', attrError)
          throw new Error(`Failed to save product specifications: ${attrError.message}`)
        }
      }

      // Insert product options and values if provided
      const optionMap = new Map<string, number>()
      const valueMap = new Map<string, number>()

      if (data.options && data.options.length > 0) {
        const optionInserts = data.options.map((opt) => ({
          product_id: createdProductId,
          name: opt.name,
          position: opt.position,
        }))

        const { data: insertedOptions, error: optionError } = await supabase
          .from('product_options')
          .insert(optionInserts)
          .select()

        if (optionError) {
          console.error('Error inserting product options:', optionError)
          throw new Error(`Failed to save options: ${optionError.message}`)
        }

        if (insertedOptions && insertedOptions.length > 0) {
          insertedOptions.forEach((o: any) => {
            optionMap.set(o.name, o.id)
          })

          const valueInserts: any[] = []
          data.options.forEach((opt) => {
            const dbOptionId = optionMap.get(opt.name)
            if (dbOptionId === undefined) return
            opt.values.forEach((v) => {
              valueInserts.push({
                option_id: dbOptionId,
                value: v.value,
                image_url: v.image_url || null,
                price_offset: Number(v.price_offset) || 0,
                stock_override: v.stock_override !== undefined && v.stock_override !== null ? Number(v.stock_override) : null,
              })
            })
          })

          if (valueInserts.length > 0) {
            const { data: insertedValues, error: valueError } = await supabase
              .from('product_option_values')
              .insert(valueInserts)
              .select()

            if (valueError) {
              console.error('Error inserting product option values:', valueError)
              throw new Error(`Failed to save option values: ${valueError.message}`)
            }

            if (insertedValues && insertedValues.length > 0) {
              insertedValues.forEach((v: any) => {
                const optName = data.options?.find(o => optionMap.get(o.name) === v.option_id)?.name
                if (optName) {
                  valueMap.set(`${optName}|${v.value}`, v.id)
                }
              })
            }
          }
        }
      }

      // Insert variants if provided
      if (data.variants && data.variants.length > 0) {
        const variantInserts = data.variants.map((v) => ({
          product_id: createdProductId,
          variant_sku: v.variant_sku,
          variant_price: Number(v.variant_price) || 0,
          variant_stock: Number(v.variant_stock) || 0,
          variant_url: v.variant_url || null,
        }))

        const { data: insertedVariants, error: variantError } = await supabase
          .from('product_variants')
          .insert(variantInserts)
          .select()

        if (variantError) {
          console.error('Error inserting product variants:', variantError)
          throw new Error(`Failed to save variants: ${variantError.message}`)
        }

        if (insertedVariants && insertedVariants.length > 0) {
          const junctionInserts: any[] = []
          data.variants.forEach((v) => {
            const dbVariant = insertedVariants.find((dv: any) => dv.variant_sku === v.variant_sku)
            if (!dbVariant) return

            v.combinationValues?.forEach((comb) => {
              const valId = valueMap.get(`${comb.optionName}|${comb.valueName}`)
              if (valId !== undefined) {
                junctionInserts.push({
                  variant_id: dbVariant.id,
                  option_value_id: valId,
                })
              }
            })
          })

          if (junctionInserts.length > 0) {
            const { error: junctionError } = await supabase
              .from('product_variant_option_values')
              .insert(junctionInserts)

            if (junctionError) {
              console.error('Error inserting variant option values junction mapping:', junctionError)
              throw new Error(`Failed to save variant mappings: ${junctionError.message}`)
            }
          }
        }
      }

      return newProduct as Product
    } catch (error) {
      console.error('Transaction failed. Rolling back created product:', error)
      if (createdProductId) {
        const { error: rollbackError } = await supabase
          .from('products')
          .delete()
          .eq('id', createdProductId)

        if (rollbackError) {
          console.error('Rollback deletion failed:', rollbackError)
        } else {
          console.log('Successfully rolled back product ID:', createdProductId)
        }
      }
      throw error
    }
  }

  /**
   * Get active Editor's Pick
   */
  static async getActiveEditorsPick(): Promise<{ editorsPick: any, product: ProductWithDetails } | null> {
    try {
      const { data: pick, error } = await supabase
        .from('editors_pick')
        .select(`
          *,
          products:product_id (
            *,
            brands:brand_id (*),
            categories:category_id (*),
            product_images (*),
            product_variants (
              *,
              product_variant_option_values (option_value_id)
            ),
            product_options (
              *,
              product_option_values (*)
            ),
            product_reviews (*)
          )
        `)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('Error fetching active editors pick:', error)
        return null
      }

      if (!pick || !pick.products) {
        return null
      }

      const product = pick.products
      const reviews = product.product_reviews || []
      const validReviews = reviews.filter((r: any) => !r.deleted_at)
      const average_rating = validReviews.length > 0
        ? validReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / validReviews.length
        : undefined

      const productWithDetails = {
        ...product,
        brand: product.brands,
        category: product.categories,
        images: product.product_images?.filter((img: any) => !img.deleted_at) || [],
        options: (product.product_options || []).map((o: any) => ({
          ...o,
          values: (o.product_option_values || []).sort((a: any, b: any) => a.id - b.id)
        })).sort((a: any, b: any) => a.position - b.position),
        variants: product.product_variants || [],
        reviews: validReviews,
        average_rating,
        review_count: validReviews.length,
      } as ProductWithDetails

      const { products, ...editorsPickData } = pick

      return {
        editorsPick: editorsPickData,
        product: productWithDetails
      }
    } catch (error) {
      console.error('Error in getActiveEditorsPick:', error)
      return null
    }
  }

  /**
   * Save or update Editor's Pick
   */
  static async saveEditorsPick(data: {
    product_id: number
    custom_title?: string | null
    badge_text?: string
    description_1?: string | null
    description_2?: string | null
    frame_spec?: string
    surface_spec?: string
    warranty_spec?: string
    is_active?: boolean
  }): Promise<any> {
    try {
      if (data.is_active !== false) {
        await supabase
          .from('editors_pick')
          .update({ is_active: false })
          .neq('product_id', data.product_id)
      }

      const { data: upsertedPick, error } = await supabase
        .from('editors_pick')
        .upsert({
          product_id: data.product_id,
          custom_title: data.custom_title || null,
          badge_text: data.badge_text || 'EDITOR\'S PICK',
          description_1: data.description_1 || null,
          description_2: data.description_2 || null,
          frame_spec: data.frame_spec || 'Forest Green Steel',
          surface_spec: data.surface_spec || 'Solid European Oak',
          warranty_spec: data.warranty_spec || '10 Years',
          is_active: data.is_active ?? true,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'product_id' })
        .select()
        .single()

      if (error) {
        console.error('Error saving editors pick:', error)
        throw error
      }

      return upsertedPick
    } catch (error) {
      console.error('Error in saveEditorsPick:', error)
      throw error
    }
  }

  /**
   * Get top best-selling products based on completed orders in the last 6 months.
   */
  static async getBestsellers(limit: number = 4): Promise<ProductCard[]> {
    try {
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      const sixMonthsAgoStr = sixMonthsAgo.toISOString()

      // 1. Fetch completed orders from the last 6 months
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id')
        .eq('order_status', 'COMPLETED')
        .gte('placed_at', sixMonthsAgoStr)

      if (ordersError) {
        console.error('Error fetching bestsellers orders:', ordersError)
        throw ordersError
      }

      const salesMap = new Map<number, number>()

      if (orders && orders.length > 0) {
        const orderIds = orders.map(o => o.id)

        // 2. Fetch order items for these completed orders
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select('product_id, quantity')
          .in('order_id', orderIds)

        if (itemsError) {
          console.error('Error fetching bestsellers items:', itemsError)
          throw itemsError
        }

        if (orderItems) {
          orderItems.forEach((item: any) => {
            const qty = Number(item.quantity) || 0
            const pid = Number(item.product_id)
            if (!isNaN(pid)) {
              salesMap.set(pid, (salesMap.get(pid) || 0) + qty)
            }
          })
        }
      }

      // Sort product IDs by quantity sold descending
      const sortedProductIds = Array.from(salesMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(entry => entry[0])

      // 3. Fetch products details for top product IDs
      let productsData: any[] = []
      if (sortedProductIds.length > 0) {
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            brands:brand_id (name),
            categories:category_id (name),
            product_images (image_url, is_primary, sort_order)
          `)
          .in('id', sortedProductIds)
          .is('deleted_at', null)
          .eq('status', 'active')

        if (productsError) {
          console.error('Error fetching bestseller products:', productsError)
          throw productsError
        }

        if (products) {
          // Keep sales rank order
          productsData = sortedProductIds
            .map(id => products.find(p => p.id === id))
            .filter(Boolean) as any[]
        }
      }

      // 4. Fallback if not enough products found (fill up to limit with active products)
      if (productsData.length < limit) {
        const needed = limit - productsData.length
        const excludeIds = productsData.map(p => p.id)
        
        let query = supabase
          .from('products')
          .select(`
            *,
            brands:brand_id (name),
            categories:category_id (name),
            product_images (image_url, is_primary, sort_order)
          `)
          .is('deleted_at', null)
          .eq('status', 'active')
          .limit(needed)
          
        if (excludeIds.length > 0) {
          query = query.not('id', 'in', `(${excludeIds.join(',')})`)
        }

        const { data: fallbackProducts } = await query
        if (fallbackProducts) {
          productsData = [...productsData, ...fallbackProducts]
        }
      }

      // 5. Transform to ProductCard format
      return productsData.map(product => {
        const images = product.product_images || []
        const primaryImage = images.find((img: any) => img.is_primary)
        const firstImage = images.sort((a: any, b: any) => a.sort_order - b.sort_order)[0]

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
      console.error('Error in getBestsellers:', error)
      return ProductService.getFeaturedProducts(limit)
    }
  }
}

