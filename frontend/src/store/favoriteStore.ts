import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

interface FavoriteState {
  currentUserId: string | null;
  favoritesByUser: Record<string, Product[]>;
  favorites: Product[];
  setCurrentUser: (userId: string | null) => void;
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      currentUserId: null,
      favoritesByUser: {},
      favorites: [],

      setCurrentUser: (userId) => {
        const favoritesByUser = get().favoritesByUser;
        const favorites = userId ? favoritesByUser[userId] || [] : [];
        set({ currentUserId: userId, favorites });
      },

      addFavorite: (product) => {
        const { currentUserId, favoritesByUser } = get();
        if (!currentUserId) return;

        const currentFavorites = favoritesByUser[currentUserId] || [];
        if (currentFavorites.find((item) => item.id === product.id)) return;

        const nextFavorites = [...currentFavorites, product];
        set({
          favorites: nextFavorites,
          favoritesByUser: {
            ...favoritesByUser,
            [currentUserId]: nextFavorites,
          },
        });
      },

      removeFavorite: (productId) => {
        const { currentUserId, favoritesByUser } = get();
        if (!currentUserId) return;

        const nextFavorites = (favoritesByUser[currentUserId] || []).filter(
          (item) => item.id !== productId,
        );

        set({
          favorites: nextFavorites,
          favoritesByUser: {
            ...favoritesByUser,
            [currentUserId]: nextFavorites,
          },
        });
      },

      isFavorite: (productId) => {
        return get().favorites.some((item) => item.id === productId);
      },

      clearFavorites: () => {
        const { currentUserId, favoritesByUser } = get();
        if (!currentUserId) {
          set({ favorites: [] });
          return;
        }

        set({
          favorites: [],
          favoritesByUser: {
            ...favoritesByUser,
            [currentUserId]: [],
          },
        });
      },
    }),
    {
      name: "favorite-storage",
      version: 2,
      migrate: (persistedState: any, version) => {
        if (!persistedState || version >= 2) {
          return persistedState;
        }

        return {
          ...persistedState,
          currentUserId: null,
          favoritesByUser: {},
          favorites: [],
        };
      },
    },
  ),
);
