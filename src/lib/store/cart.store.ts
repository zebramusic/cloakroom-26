import { create } from "zustand"
import { persist, createJSONStorage, StateStorage } from "zustand/middleware"

// Safe storage that works during SSR
const createStorage = (): StateStorage => {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }
  }
  return localStorage
}

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
  updateQuantity: (variantId: string, quantity: number) => void
  removeItem: (variantId: string) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
  getTax: () => number
  getTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items
        const existingIndex = items.findIndex(
          (i) => i.variant_id === item.variant_id || i.product_id === item.product_id
        )

        if (existingIndex > -1) {
          // Update quantity if item exists
          const newItems = [...items]
          newItems[existingIndex].quantity += item.quantity || 1
          set({ items: newItems })
        } else {
          // Add new item with default tax rate if not provided
          set({ items: [...items, { ...item, tax_rate: item.tax_rate || 0.21, quantity: item.quantity || 1 }] })
        }
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }

        const items = get().items
        const newItems = items.map((item) =>
          item.variant_id === variantId || item.product_id === variantId
            ? { ...item, quantity }
            : item
        )
        set({ items: newItems })
      },

      removeItem: (variantId) => {
        const items = get().items
        const newItems = items.filter(
          (item) => item.variant_id !== variantId && item.product_id !== variantId
        )
        set({ items: newItems })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getTax: () => {
        // Calculate tax based on each product's individual tax rate
        return get().items.reduce((total, item) => {
          const itemSubtotal = item.price * item.quantity
          const itemTax = itemSubtotal * (item.tax_rate || 0.21)
          return total + itemTax
        }, 0)
      },

      getTotal: () => {
        return get().getSubtotal() + get().getTax()
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(createStorage),
    }
  )
)
