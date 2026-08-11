import { create } from "zustand";
import toast from "react-hot-toast";

import api from "../lib/axios";
import { useAuthStore } from "./authStore";

const GUEST_CART_KEY = "verve_guest_cart";

const readGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
  } catch {
    return [];
  }
};

const writeGuestCart = (cart) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
};

export const useCartStore = create((set, get) => ({
  cart: [],
  isLoading: false,

  fetchCart: async () => {
    const user = useAuthStore.getState().user;

    if (!user) {
      set({
        cart: readGuestCart(),
        isLoading: false,
      });

      return;
    }

    set({ isLoading: true });

    try {
      const response = await api.get("/cart");

      set({
        cart: response.data.cart || [],
      });
    } catch (error) {
      console.error("Failed to fetch cart:", error);

      set({
        cart: [],
      });
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  syncGuestCartOnLogin: async () => {
    const guestCart = readGuestCart();

    if (guestCart.length === 0) {
      return get().fetchCart();
    }

    try {
      const items = guestCart.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));

      const response = await api.post("/cart/sync", { items });

      set({
        cart: response.data.cart || [],
      });

      localStorage.removeItem(GUEST_CART_KEY);
    } catch (error) {
      console.error("Failed to sync guest cart:", error);

      toast.error("Could not merge your cart, but you're logged in");
    }
  },

  addItem: async (product, quantity = 1) => {
    const user = useAuthStore.getState().user;

    if (!user) {
      const cart = readGuestCart();

      const existing = cart.find((item) => item.product._id === product._id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        const addons = [];

        if (product.preCheckedAddon?.enabled) {
          addons.push({
            name: product.preCheckedAddon.name,
            priceCents: product.preCheckedAddon.priceCents,
          });
        }

        cart.push({
          product,
          quantity,
          addons,
        });
      }

      writeGuestCart(cart);

      set({ cart });

      toast.success(`${product.name} added to cart`);

      return;
    }

    try {
      const response = await api.post("/cart", {
        productId: product._id,
        quantity,
      });

      set({
        cart: response.data.cart || [],
      });

      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error("Add to cart failed:", error);

      toast.error(error.response?.data?.message || "Could not add to cart");
    }
  },

  updateQuantity: async (productId, quantity) => {
    const user = useAuthStore.getState().user;

    if (!user) {
      let cart = readGuestCart();

      if (quantity <= 0) {
        cart = cart.filter((item) => item.product._id !== productId);
      } else {
        const item = cart.find((item) => item.product._id === productId);

        if (item) {
          item.quantity = quantity;
        }
      }

      writeGuestCart(cart);

      set({ cart });

      return;
    }

    try {
      const response = await api.put(`/cart/${productId}`, { quantity });

      set({
        cart: response.data.cart || [],
      });
    } catch (error) {
      console.error("Update cart failed:", error);

      toast.error(error.response?.data?.message || "Could not update cart");
    }
  },

  removeItem: async (productId) => {
    const user = useAuthStore.getState().user;

    if (!user) {
      const cart = readGuestCart().filter(
        (item) => item.product._id !== productId,
      );

      writeGuestCart(cart);

      set({ cart });

      return;
    }

    try {
      const response = await api.delete(`/cart/${productId}`);

      set({
        cart: response.data.cart || [],
      });
    } catch (error) {
      console.error("Remove cart item failed:", error);

      toast.error(error.response?.data?.message || "Could not remove item");
    }
  },
}));
