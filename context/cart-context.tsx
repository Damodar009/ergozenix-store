"use client"

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { supabase } from "@/services/supabase"
import { retrieveId } from "@/lib/cookieUtils"
import { initDeviceSession } from "@/lib/deviceSession"
import { CartService, type CartItem as ServiceCartItem } from "@/services/cart-service"
import { useToast } from "@/hooks/use-toast"

export interface CartItem extends ServiceCartItem {}

interface CartContextType {
  items: CartItem[]
  isLoading: boolean
  addToCart: (productId: string | number, quantity?: number, attributes?: { name: string; value: string }[]) => Promise<void>
  removeFromCart: (cartItemId: number) => Promise<void> // changed to number to match ID
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void> // changed to number
  clearCart: () => Promise<void>
  cartTotal: number
  itemCount: number
  userId: string | null
  sessionId: string | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const { toast } = useToast()

  // Initialize Session ID from device session cookie
  useEffect(() => {
    const sid = retrieveId('session_id')
    if (sid) {
      setSessionId(sid)
    } else {
      console.warn('Session ID not found in cookies – cart operations may fail')
    }
  }, [])

  // Initialize Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load Cart
  const loadCart = useCallback(async () => {
    if (!sessionId) return
    
    setIsLoading(true)
    try {
      const dbItems = await CartService.getCartItems(sessionId, userId || undefined)
      setItems(dbItems)
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, userId])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const addToCart = useCallback(async (
    productId: string | number,
    quantity: number = 1,
    attributes: { name: string; value: string }[] = []
  ) => {
    // Initialise device session to ensure session_id exists in DB
    await initDeviceSession();
    const sid = retrieveId('session_id');
    if (!sid) {
      console.warn('Session ID still missing after init');
      return;
    }
    setSessionId(sid);

    try {
      await CartService.addToCart(
        sid,
        Number(productId),
        quantity,
        attributes,
        userId || undefined
      );

      // Optionally refresh cart list
      // await loadCart();

      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
        duration: 2000,
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  }, [userId, loadCart, toast]);

  const removeFromCart = useCallback(async (cartItemId: number) => {
    try {
      await CartService.removeFromCart(cartItemId)
      setItems(prev => prev.filter(item => item.id !== cartItemId))
    } catch (error) {
      console.error('Remove from cart error:', error)
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }, [toast])

  const updateQuantity = useCallback(async (cartItemId: number, quantity: number) => {
    try {
      if (quantity < 1) return
      
      // Optimistic update
      setItems(prev => prev.map(item => 
        item.id === cartItemId ? { ...item, quantity } : item
      ))

      await CartService.updateCartItemQuantity(cartItemId, quantity)
    } catch (error) {
      console.error('Update quantity error:', error)
      // Revert on error (could fetch full cart)
      loadCart()
    }
  }, [loadCart])

  const clearCart = useCallback(async () => {
    if (!sessionId) return
    try {
      await CartService.clearCart(sessionId, userId || undefined)
      setItems([])
    } catch (error) {
      console.error('Clear cart error:', error)
    }
  }, [sessionId, userId])

  const cartTotal = useMemo(() => {
    return items.reduce((total, item) => {
      const price = item.price || item.product?.price || 0
      return total + (price * item.quantity)
    }, 0)
  }, [items])

  const itemCount = useMemo(() => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }, [items])

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        isLoading, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        cartTotal,
        itemCount,
        userId,
        sessionId
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
