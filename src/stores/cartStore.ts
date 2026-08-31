import { create } from "zustand";
import {
  addLinesToCart,
  createCart,
  fetchCart,
  removeCartLines,
  updateCartLines,
  type CartLine,
  type ShopifyCart,
  type ShopifyProduct,
} from "@/lib/shopify";

const CART_ID_KEY = "urbancart_cart_id";

export interface CartItem {
  lineId: string;
  variantId: string;
  variantTitle: string;
  quantity: number;
  price: { amount: string; currencyCode: string };
  product: ShopifyProduct;
  selectedOptions: Array<{ name: string; value: string }>;
}

function cartToItems(cart: ShopifyCart): CartItem[] {
  return cart.lines.edges.map(({ node }) => ({
    lineId: node.id,
    variantId: node.merchandise.id,
    variantTitle: node.merchandise.title,
    quantity: node.quantity,
    price: node.merchandise.price,
    selectedOptions: node.merchandise.selectedOptions,
    product: {
      node: {
        id: node.merchandise.product.id,
        title: node.merchandise.product.title,
        handle: node.merchandise.product.handle,
        description: "",
        priceRange: { minVariantPrice: node.merchandise.price },
        images: node.merchandise.product.images,
        variants: { edges: [] },
        options: [],
      },
    },
  }));
}

interface CartState {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  totalAmount: { amount: string; currencyCode: string } | null;
  isLoading: boolean;
  addItem: (item: {
    product: ShopifyProduct;
    variantId: string;
    variantTitle: string;
    price: { amount: string; currencyCode: string };
    quantity: number;
    selectedOptions: Array<{ name: string; value: string }>;
  }) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  syncCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => {
  const applyCart = (cart: ShopifyCart | null) => {
    if (!cart) {
      localStorage.removeItem(CART_ID_KEY);
      set({ items: [], cartId: null, checkoutUrl: null, totalAmount: null });
      return;
    }
    localStorage.setItem(CART_ID_KEY, cart.id);
    set({
      items: cartToItems(cart),
      cartId: cart.id,
      checkoutUrl: cart.checkoutUrl,
      totalAmount: cart.cost.totalAmount,
    });
  };

  return {
    items: [],
    cartId: null,
    checkoutUrl: null,
    totalAmount: null,
    isLoading: false,

    addItem: async (item) => {
      set({ isLoading: true });
      try {
        const { cartId } = get();
        const lines = [{ merchandiseId: item.variantId, quantity: item.quantity }];
        const cart = cartId ? await addLinesToCart(cartId, lines) : await createCart(lines);
        applyCart(cart);
      } catch (e) {
        console.error("Failed to add item to cart", e);
        const { toast } = await import("sonner");
        toast.error("Could not add to cart. Please try again.");
      } finally {
        set({ isLoading: false });
      }
    },

    updateQuantity: async (lineId, quantity) => {
      const { cartId } = get();
      if (!cartId) return;
      set({ isLoading: true });
      try {
        const cart =
          quantity <= 0
            ? await removeCartLines(cartId, [lineId])
            : await updateCartLines(cartId, [{ id: lineId, quantity }]);
        applyCart(cart);
      } catch (e) {
        console.error("Failed to update cart", e);
      } finally {
        set({ isLoading: false });
      }
    },

    removeItem: async (lineId) => {
      const { cartId } = get();
      if (!cartId) return;
      set({ isLoading: true });
      try {
        applyCart(await removeCartLines(cartId, [lineId]));
      } catch (e) {
        console.error("Failed to remove item", e);
      } finally {
        set({ isLoading: false });
      }
    },

    syncCart: async () => {
      const cartId = localStorage.getItem(CART_ID_KEY);
      if (!cartId) return;
      try {
        const cart = await fetchCart(cartId);
        if (!cart) {
          localStorage.removeItem(CART_ID_KEY);
          set({ items: [], cartId: null, checkoutUrl: null, totalAmount: null });
          return;
        }
        applyCart(cart);
      } catch (e) {
        console.error("Failed to sync cart", e);
      }
    },
  };
});

export function useCartCount() {
  return useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
}

export type { CartLine };
