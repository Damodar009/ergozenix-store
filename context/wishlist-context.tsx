"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { retrieveId } from "@/lib/cookieUtils"
import { initDeviceSession } from "@/lib/deviceSession"
import { WishlistService } from "@/services/wishlist-service"
import { useToast } from "@/hooks/use-toast"

interface WishlistContextType {
  wishlistIds: Set<number>
  isLoading: boolean
  isWishlisted: (productId: number) => boolean
  toggleWishlist: (productId: number, productName?: string) => Promise<void>
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set())
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Initialize session and load wishlist IDs
  useEffect(() => {
    async function init() {
      await initDeviceSession()
      const sid = retrieveId("session_id")
      if (!sid) { setIsLoading(false); return }
      setSessionId(sid)
      try {
        const ids = await WishlistService.getWishlistProductIds(sid)
        setWishlistIds(new Set(ids))
      } catch {
        // silently fail
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const isWishlisted = useCallback(
    (productId: number) => wishlistIds.has(productId),
    [wishlistIds]
  )

  const toggleWishlist = useCallback(
    async (productId: number, productName?: string) => {
      // Ensure session exists
      await initDeviceSession()
      const sid = retrieveId("session_id")
      if (!sid) {
        toast({ title: "Error", description: "Session not found", variant: "destructive" })
        return
      }
      setSessionId(sid)

      const alreadyIn = wishlistIds.has(productId)

      // Optimistic update
      setWishlistIds(prev => {
        const next = new Set(prev)
        if (alreadyIn) next.delete(productId)
        else next.add(productId)
        return next
      })

      try {
        if (alreadyIn) {
          await WishlistService.removeFromWishlist(sid, productId)
          toast({
            title: "Removed from wishlist",
            description: productName ? `${productName} removed` : "Item removed from your wishlist",
            duration: 2000,
          })
        } else {
          await WishlistService.addToWishlist(sid, productId)
          toast({
            title: "Added to wishlist",
            description: productName ? `${productName} saved` : "Item saved to your wishlist",
            duration: 2000,
          })
        }
      } catch {
        // Revert on error
        setWishlistIds(prev => {
          const next = new Set(prev)
          if (alreadyIn) next.add(productId)
          else next.delete(productId)
          return next
        })
        toast({ title: "Error", description: "Failed to update wishlist", variant: "destructive" })
      }
    },
    [wishlistIds, toast]
  )

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isLoading,
        isWishlisted,
        toggleWishlist,
        wishlistCount: wishlistIds.size,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider")
  return ctx
}
