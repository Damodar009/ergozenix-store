import { supabase } from '@/lib/supabase/client'

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product?: {
    id: string
    name: string
    description: string | null
    price: number
    image_url: string | null
    stock_quantity: number
  }
}

export class CartService {
  /**
   * Get all cart items for the current user
   */
  static async getCartItems(userId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products (
          id,
          name,
          description,
          price,
          image_url,
          stock_quantity
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching cart items:', error)
      throw error
    }

    return data || []
  }

  /**
   * Add item to cart or update quantity if it already exists
   */
  static async addToCart(userId: string, productId: string, quantity: number = 1): Promise<CartItem> {
    // First check if item already exists in cart
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single()

    if (existing) {
      // Update existing item quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ 
          quantity: existing.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating cart item:', error)
        throw error
      }

      return data
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding to cart:', error)
        throw error
      }

      return data
    }
  }

  /**
   * Update cart item quantity
   */
  static async updateCartItemQuantity(cartItemId: string, quantity: number): Promise<CartItem> {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0')
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ 
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', cartItemId)
      .select()
      .single()

    if (error) {
      console.error('Error updating cart item quantity:', error)
      throw error
    }

    return data
  }

  /**
   * Remove item from cart
   */
  static async removeFromCart(cartItemId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)

    if (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }

  /**
   * Clear all items from cart
   */
  static async clearCart(userId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)

    if (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }

  /**
   * Get cart total
   */
  static async getCartTotal(userId: string): Promise<number> {
    const items = await this.getCartItems(userId)
    return items.reduce((total, item) => {
      const price = item.product?.price || 0
      return total + (price * item.quantity)
    }, 0)
  }

  /**
   * Get cart item count
   */
  static async getCartItemCount(userId: string): Promise<number> {
    const items = await this.getCartItems(userId)
    return items.reduce((count, item) => count + item.quantity, 0)
  }
}
