import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProductById } from '../lib/catalog';

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    images: { url: string; alt?: string }[];
  };
  variant: {
    id: string;
    type: string;
    value: string;
    priceModifier: number;
  } | null;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  total: number;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, variantId?: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearLocal: () => void;
}

const calculateTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => {
    const price = item.product.price + (item.variant?.priceModifier || 0);
    return sum + price * item.quantity;
  }, 0);

const calculateCount = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

const recompute = (items: CartItem[]) => ({
  items,
  total: calculateTotal(items),
  itemCount: calculateCount(items),
});

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,
      total: 0,
      itemCount: 0,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      fetchCart: async () => {
        // Local cart — keep totals in sync on load.
        set(recompute(get().items));
      },

      addItem: async (productId, variantId, quantity = 1) => {
        const product = getProductById(productId);
        if (!product) throw new Error('Product not found');

        const variant = variantId
          ? (product.variants || []).find((v: any) => v.id === variantId) || null
          : null;

        const items = [...get().items];
        const existing = items.find(
          (i) => i.productId === productId && i.variantId === (variantId || null)
        );

        if (existing) {
          existing.quantity += quantity;
        } else {
          items.push({
            id: `${productId}-${variantId || 'base'}-${Date.now()}`,
            cartId: 'local',
            productId,
            variantId: variantId || null,
            quantity,
            product: {
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              comparePrice: product.comparePrice ?? null,
              images: product.images || [],
            },
            variant: variant
              ? {
                  id: variant.id,
                  type: variant.type,
                  value: variant.value,
                  priceModifier: variant.priceModifier || 0,
                }
              : null,
          });
        }
        set(recompute(items));
      },

      updateQuantity: async (itemId, quantity) => {
        const items = get()
          .items.map((i) => (i.id === itemId ? { ...i, quantity } : i))
          .filter((i) => i.quantity > 0);
        set(recompute(items));
      },

      removeItem: async (itemId) => {
        set(recompute(get().items.filter((i) => i.id !== itemId)));
      },

      clearCart: async () => {
        set({ items: [], total: 0, itemCount: 0 });
      },

      clearLocal: () => {
        set({ items: [], total: 0, itemCount: 0 });
      },
    }),
    {
      name: 'nies-cart',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) Object.assign(state, recompute(state.items));
      },
    }
  )
);
