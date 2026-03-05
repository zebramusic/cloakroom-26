import { create } from "zustand"

export interface CartItem {
  product_id: string
  variant_id: string | null
  name: string
  variant_name: string | null
  image_url: string | null
  sku: string
  price: number
  tax_rate: number // VAT rate as decimal (0.21 = 21%)
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  updateQuantity: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
  getTax: () => number
  getTotal: () => number
  hydrate: () => void
}

// Helper functions for localStorage (client-side only)
const STORAGE_KEY = "cart-storage"

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const getStoredItems = (): CartItem[] => {
  if (!isBrowser) return []
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return parsed.state?.items || []
  } catch {
    return []
  }
}

const setStoredItems = (items: CartItem[]) => {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { items }, version: 0 }))
  } catch {
    // Silently fail if localStorage is not available
  }
}

const getCartItemKey = (item: Pick<CartItem, "product_id" | "variant_id">) =>
  item.variant_id ? `variant:${item.variant_id}` : `product:${item.product_id}`

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],

  hydrate: () => {
    const items = getStoredItems()
    set({ items })
  },

  addItem: (item) => {
    const items = get().items
    const incomingKey = getCartItemKey(item)
    const existingIndex = items.findIndex((existingItem) => getCartItemKey(existingItem) === incomingKey)

    let newItems: CartItem[]
    if (existingIndex > -1) {
      newItems = [...items]
      newItems[existingIndex].quantity += item.quantity || 1
    } else {
      newItems = [...items, { ...item, tax_rate: item.tax_rate || 0.21, quantity: item.quantity || 1 }]
    }
    
    set({ items: newItems })
    setStoredItems(newItems)
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId)
      return
    }

    const items = get().items
    const newItems = items.map((item) =>
      getCartItemKey(item) === itemId || item.product_id === itemId || item.variant_id === itemId
        ? { ...item, quantity }
        : item
    )
    
    set({ items: newItems })
    setStoredItems(newItems)
  },

  removeItem: (itemId) => {
    const items = get().items
    const newItems = items.filter(
      (item) =>
        getCartItemKey(item) !== itemId &&
        item.product_id !== itemId &&
        item.variant_id !== itemId
    )
    
    set({ items: newItems })
    setStoredItems(newItems)
  },

  clearCart: () => {
    set({ items: [] })
    setStoredItems([])
  },

  getItemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0)
  },

  getSubtotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
  },

  getTax: () => {
    return get().items.reduce((total, item) => {
      const itemSubtotal = item.price * item.quantity
      const itemTax = itemSubtotal * (item.tax_rate || 0.21)
      return total + itemTax
    }, 0)
  },

  getTotal: () => {
    return get().getSubtotal() + get().getTax()
  },
}))

