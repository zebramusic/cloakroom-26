"use client"

import { useEffect } from "react"
import { useCartStore } from "@/lib/store/cart.store"

export function CartStoreHydration() {
  useEffect(() => {
    // Hydrate cart from localStorage on client mount
    useCartStore.getState().hydrate()
  }, [])

  return null
}
