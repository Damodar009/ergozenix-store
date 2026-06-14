import { supabase } from '@/services/supabase'

export interface WishlistItem {
  id: number
  session_id: string
  product_id: number
  created_at: string
  product?: {
    id: number
    name: string
    slug: string | null
    base_price: number
    sale_price: number | null
    description: string | null
    primary_image: string | null
  }
}

export class WishlistService {
  /**
   * Get all wishlist items for a session, joined with product info
   */
  static async getWishlist(sessionId: string): Promise<WishlistItem[]> {
    const { data, error } = await supabase
      .from('wishlists')
      .select(`
        id,
        session_id,
        product_id,
        created_at,
        product:products (
          id,
          name,
          slug,
          base_price,
          sale_price,
          description,
          images:product_images (
            image_url,
            is_primary,
            sort_order
          )
        )
      `)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching wishlist:', error)
      throw error
    }

    // Flatten primary image onto product
    return (data || []).map((item: any) => {
      const images = item.product?.images || []
      const primary = images.find((img: any) => img.is_primary) ||
        [...images].sort((a: any, b: any) => a.sort_order - b.sort_order)[0]
      return {
        ...item,
        product: item.product
          ? { ...item.product, primary_image: primary?.image_url || null }
          : undefined,
      }
    })
  }

  /**
   * Add a product to the wishlist (idempotent)
   */
  static async addToWishlist(sessionId: string, productId: number): Promise<void> {
    // Check if already exists first
    const { data: existing } = await supabase
      .from('wishlists')
      .select('id')
      .eq('session_id', sessionId)
      .eq('product_id', productId)
      .maybeSingle()

    if (existing) return // already in wishlist

    const { error } = await supabase
      .from('wishlists')
      .insert({ session_id: sessionId, product_id: productId })

    if (error) {
      console.error('Error adding to wishlist:', error)
      throw error
    }
  }

  /**
   * Remove a product from the wishlist
   */
  static async removeFromWishlist(sessionId: string, productId: number): Promise<void> {
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('session_id', sessionId)
      .eq('product_id', productId)

    if (error) {
      console.error('Error removing from wishlist:', error)
      throw error
    }
  }

  /**
   * Check if a product is in the wishlist
   */
  static async isInWishlist(sessionId: string, productId: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('wishlists')
      .select('id')
      .eq('session_id', sessionId)
      .eq('product_id', productId)
      .maybeSingle()

    if (error) return false
    return !!data
  }

  /**
   * Get just the product IDs in the wishlist (lightweight check)
   */
  static async getWishlistProductIds(sessionId: string): Promise<number[]> {
    const { data, error } = await supabase
      .from('wishlists')
      .select('product_id')
      .eq('session_id', sessionId)

    if (error) return []
    return (data || []).map((r: any) => r.product_id)
  }
}
