import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WishlistItem {
  handle: string;
  title: string;
  image: string | null;
  price: { amount: string; currencyCode: string };
}

interface WishlistState {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  remove: (handle: string) => void;
  has: (handle: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        const exists = get().items.some((i) => i.handle === item.handle);
        set({
          items: exists
            ? get().items.filter((i) => i.handle !== item.handle)
            : [...get().items, item],
        });
      },
      remove: (handle) => set({ items: get().items.filter((i) => i.handle !== handle) }),
      has: (handle) => get().items.some((i) => i.handle === handle),
    }),
    { name: "urbancart-wishlist", storage: createJSONStorage(() => localStorage) },
  ),
);
