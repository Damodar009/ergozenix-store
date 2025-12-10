import { supabase } from '@/lib/supabase/client'

export interface CartAttribute {
  id?: number
  cart_item_id?: number
  attribute_name: string
  attribute_value: string
}

export interface CartItem {
  id: number
  cart_id: number
  product_id: number
  quantity: number
  price: number
  created_at: string
  updated_at: string
  product?: {
    id: number
    name: string
    description: string | null
    price: number
    image_url: string | null
    stock_quantity: number
    slug: string | null
  }
  attributes?: CartAttribute[]
}

export class CartService {
  /**
   * Get active cart for session or user
   */
  static async getCart(sessionId: string, userId?: string) {
    let query = supabase
      .from('carts')
      .select('*')
      .eq('status', 'active')

    if (userId) {
      query = query.eq('user_id', userId)
    } else {
      query = query.eq('session_id', sessionId)
    }

    const { data, error } = await query.maybeSingle()

    if (error) {
      console.error('Error fetching cart:', error)
      throw error
    }

    return data
  }

  /**
   * Create a new cart
   */
  static async createCart(sessionId: string, userId?: string) {
    const { data, error } = await supabase
      .from('carts')
      .insert({
        session_id: sessionId,
        user_id: userId || null,
        status: 'active'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Get all cart items
   */
  static async getCartItems(sessionId: string, userId?: string): Promise<CartItem[]> {
    // 1. Get the cart first
    const cart = await this.getCart(sessionId, userId)
    if (!cart) return []

    // 2. Get items with product details and attributes
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products (
          id,
          name,
          description,
          base_price,
          stock_quantity,
          slug,
          images:product_images (
            image_url,
            is_primary
          )
        ),
        attributes:cart_item_attributes (
          id,
          attribute_name,
          attribute_value
        )
      `)
      .eq('cart_id', cart.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching cart items:', error)
      throw error
    }

    // Map DB product response to expected format
    return (data || []).map((item: any) => {
      // Find primary image or first image
      const productImages = item.product?.images || []
      const primaryImage = productImages.find((img: any) => img.is_primary) || productImages[0]

      return {
        ...item,
        product: item.product ? {
          ...item.product,
          price: item.product.base_price,
          image_url: primaryImage?.image_url || null
        } : undefined
      }
    })
  }

  /**
   * Add item to cart
   */
  static async addToCart(
    sessionId: string,
    userId: string | undefined,
    productId: number,
    quantity: number = 1,
    attributes: { name: string; value: string }[] = []
  ) {
    // 1. Get or create cart

    let cart = await this.getCart(sessionId, userId)
    if (!cart) {
      cart = await this.createCart(sessionId, userId)
    }

    // // 2. Fetch product price to ensure integrity
    const { data: product } = await supabase
      .from('products')
      .select('base_price')
      .eq('id', productId)
      .single()


    if (!product) throw new Error('Product not found')
    const price = product.base_price

    // // 3. Check for existing item
    let existingItem
    if (attributes.length === 0) {
      const { data } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cart.id)
        .eq('product_id', productId)
        .maybeSingle()
      existingItem = data
    }
    console.log("existingItem", existingItem)

    if (existingItem) {
      // Update
      const { error } = await supabase
        .from('cart_items')
        .update({
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)

      if (error) throw error
    } else {
      // Insert
      const { data: newItem, error } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: productId,
          quantity,
          price: price
        })
        .select()
        .single()

      if (error) throw error

      // 4. Insert Attributes
      if (attributes.length > 0 && newItem) {
        const attrInserts = attributes.map(a => ({
          cart_item_id: newItem.id,
          attribute_name: a.name,
          attribute_value: a.value
        }))

        const { error: attrError } = await supabase
          .from('cart_item_attributes')
          .insert(attrInserts)

        if (attrError) throw attrError
      }
    }
  }

  static async updateCartItemQuantity(itemId: number, quantity: number) {
    if (quantity <= 0) throw new Error('Quantity must be > 0')
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('id', itemId)
    if (error) throw error
  }

  static async removeFromCart(itemId: number) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
    if (error) throw error
  }

  static async clearCart(sessionId: string, userId?: string) {
    const cart = await this.getCart(sessionId, userId)
    if (cart) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id)
      if (error) throw error
    }
  }
}
