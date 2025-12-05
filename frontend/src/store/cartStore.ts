import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  savedForLater: CartItem[];
  selectedItems: string[]; // Product IDs selected for checkout
  voucherCode: string;
  voucherDiscount: number; // Discount percentage (0-100)
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  toggleSelectItem: (productId: string) => void;
  selectAllItems: () => void;
  deselectAllItems: () => void;
  moveToSavedForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeSavedItem: (productId: string) => void;
  applyVoucher: (code: string) => boolean;
  removeVoucher: () => void;
  getSelectedTotal: () => number;
  getDiscountedTotal: () => number;
  clearSelectedItems: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedForLater: [],
      selectedItems: [],
      voucherCode: '',
      voucherDiscount: 0,

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.product.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { product, quantity }],
            selectedItems: [...get().selectedItems, product.id], // Auto-select new items
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
          selectedItems: get().selectedItems.filter((id) => id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [], selectedItems: [], voucherCode: '', voucherDiscount: 0 }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      toggleSelectItem: (productId) => {
        const selectedItems = get().selectedItems;
        if (selectedItems.includes(productId)) {
          set({ selectedItems: selectedItems.filter((id) => id !== productId) });
        } else {
          set({ selectedItems: [...selectedItems, productId] });
        }
      },

      selectAllItems: () => {
        set({ selectedItems: get().items.map((item) => item.product.id) });
      },

      deselectAllItems: () => {
        set({ selectedItems: [] });
      },

      moveToSavedForLater: (productId) => {
        const item = get().items.find((item) => item.product.id === productId);
        if (item) {
          set({
            items: get().items.filter((item) => item.product.id !== productId),
            savedForLater: [...get().savedForLater, item],
            selectedItems: get().selectedItems.filter((id) => id !== productId),
          });
        }
      },

      moveToCart: (productId) => {
        const item = get().savedForLater.find((item) => item.product.id === productId);
        if (item) {
          set({
            savedForLater: get().savedForLater.filter((item) => item.product.id !== productId),
            items: [...get().items, item],
            selectedItems: [...get().selectedItems, productId],
          });
        }
      },

      removeSavedItem: (productId) => {
        set({
          savedForLater: get().savedForLater.filter((item) => item.product.id !== productId),
        });
      },

      applyVoucher: (code: string) => {
        // Simple voucher validation - you can expand this
        const vouchers: { [key: string]: number } = {
          YULING10: 10,
          YULING20: 20,
          YULING30: 30,
          GIAMGIA15: 15,
          KHAITRUONG: 25,
        };

        const discount = vouchers[code.toUpperCase()];
        if (discount) {
          set({ voucherCode: code.toUpperCase(), voucherDiscount: discount });
          return true;
        }
        return false;
      },

      removeVoucher: () => {
        set({ voucherCode: '', voucherDiscount: 0 });
      },

      getSelectedTotal: () => {
        const selectedItems = get().selectedItems;
        return get()
          .items.filter((item) => selectedItems.includes(item.product.id))
          .reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      getDiscountedTotal: () => {
        const selectedTotal = get().getSelectedTotal();
        const discount = get().voucherDiscount;
        return selectedTotal - (selectedTotal * discount) / 100;
      },

      clearSelectedItems: () => {
        const selectedIds = get().selectedItems;
        set({
          items: get().items.filter((item) => !selectedIds.includes(item.product.id)),
          selectedItems: [],
          voucherCode: '',
          voucherDiscount: 0,
        });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
