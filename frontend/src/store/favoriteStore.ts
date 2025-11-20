import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface FavoriteState {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (product) => {
        const { favorites } = get();
        if (!favorites.find((item) => item.id === product.id)) {
          set({ favorites: [...favorites, product] });
        }
      },

      removeFavorite: (productId) => {
        set((state) => ({
          favorites: state.favorites.filter((item) => item.id !== productId),
        }));
      },

      isFavorite: (productId) => {
        return get().favorites.some((item) => item.id === productId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'favorite-storage',
    }
  )
);
