import { create } from 'zustand';
import api from '../lib/api';
import { useAuthStore } from './authStore';

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    avgRating: number;
    reviewCount: number;
    images: { url: string; alt?: string }[];
    category: { id: string; name: string; slug: string };
  };
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearLocal: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) return;
    set({ isLoading: true });
    try {
      const res = await api.get('/wishlist');
      set({ items: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  toggle: async (productId) => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) throw new Error('Please log in to manage wishlist');

    const inWishlist = get().isInWishlist(productId);
    if (inWishlist) {
      await api.delete(`/wishlist/${productId}`);
      set((state) => ({
        items: state.items.filter((item) => item.productId !== productId),
      }));
    } else {
      const res = await api.post(`/wishlist/${productId}`);
      set((state) => ({ items: [...state.items, res.data] }));
    }
  },

  isInWishlist: (productId) => {
    return get().items.some((item) => item.productId === productId);
  },

  clearLocal: () => {
    set({ items: [] });
  },
}));
