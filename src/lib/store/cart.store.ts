import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface CartItem {
  product_id: string
  variant_id: string | null
  name: string
  variant_name: string | null
  image_url: string | null
  sku: string
  price: number
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

const TAX_RATE = 0.19 // 19% TVA Romania

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
          // Add new item
          set({ items: [...items, { ...item, quantity: item.quantity || 1 }] })
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
        return get().getSubtotal() * TAX_RATE
      },

      getTotal: () => {
        return get().getSubtotal() + get().getTax()
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
