import { create } from 'zustand';
import api from '../lib/api';
import { useAuthStore } from './authStore';

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

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  isLoading: false,
  total: 0,
  itemCount: 0,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  fetchCart: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) return;
    set({ isLoading: true });
    try {
      const res = await api.get('/cart');
      const items = res.data.items || [];
      set({ items, total: calculateTotal(items), itemCount: calculateCount(items), isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, variantId, quantity = 1) => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) throw new Error('Please log in to add items to cart');
    const res = await api.post('/cart/items', { productId, variantId, quantity });
    const items = res.data.items || [];
    set({ items, total: calculateTotal(items), itemCount: calculateCount(items) });
  },

  updateQuantity: async (itemId, quantity) => {
    const res = await api.put(`/cart/items/${itemId}`, { quantity });
    const items = res.data.items || [];
    set({ items, total: calculateTotal(items), itemCount: calculateCount(items) });
  },

  removeItem: async (itemId) => {
    const res = await api.delete(`/cart/items/${itemId}`);
    const items = res.data.items || [];
    set({ items, total: calculateTotal(items), itemCount: calculateCount(items) });
  },

  clearCart: async () => {
    await api.delete('/cart');
    set({ items: [], total: 0, itemCount: 0 });
  },

  clearLocal: () => {
    set({ items: [], total: 0, itemCount: 0 });
  },
}));
