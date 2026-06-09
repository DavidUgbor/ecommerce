import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProductById } from '../lib/catalog';

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

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchWishlist: async () => {
        // Local wishlist — nothing to fetch.
      },

      toggle: async (productId) => {
        const inWishlist = get().isInWishlist(productId);
        if (inWishlist) {
          set((state) => ({
            items: state.items.filter((item) => item.productId !== productId),
          }));
          return;
        }
        const product = getProductById(productId);
        if (!product) throw new Error('Product not found');
        const item: WishlistItem = {
          id: `${productId}-${Date.now()}`,
          userId: 'local',
          productId,
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            comparePrice: product.comparePrice ?? null,
            avgRating: product.avgRating || 0,
            reviewCount: product.reviewCount || 0,
            images: product.images || [],
            category: product.category,
          },
        };
        set((state) => ({ items: [...state.items, item] }));
      },

      isInWishlist: (productId) => get().items.some((item) => item.productId === productId),

      clearLocal: () => set({ items: [] }),
    }),
    { name: 'nies-wishlist', partialize: (state) => ({ items: state.items }) }
  )
);
