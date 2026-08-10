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
      set({ cart: readGuestCart() });
      return;
    }
    set({ isLoading: true });
    try {
      const res = await api.get("/cart");
      set({ cart: res.data.cart });
    } catch {
      // ignore -- if this fails the user just sees an empty cart
    } finally {
      set({ isLoading: false });
    }
  },

  // Called once, right after a successful login, to push the guest cart
  // (built while browsing without an account) into the newly authenticated
  // user's server-side cart.
  syncGuestCartOnLogin: async () => {
    const guestCart = readGuestCart();
    if (guestCart.length === 0) return get().fetchCart();

    try {
      const items = guestCart.map((i) => ({ productId: i.product._id, quantity: i.quantity }));
      const res = await api.post("/cart/sync", { items });
      set({ cart: res.data.cart });
      localStorage.removeItem(GUEST_CART_KEY);
    } catch {
      toast.error("Could not merge your cart, but you're logged in");
    }
  },

  addItem: async (product, quantity = 1) => {
    const user = useAuthStore.getState().user;

    if (!user) {
      const cart = readGuestCart();
      const existing = cart.find((i) => i.product._id === product._id);
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
        cart.push({ product, quantity, addons });
      }
      writeGuestCart(cart);
      set({ cart });
      toast.success(`${product.name} added to cart`);
      return;
    }

    try {
      const res = await api.post("/cart", { productId: product._id, quantity });
      set({ cart: res.data.cart });
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to cart");
    }
  },

  updateQuantity: async (productId, quantity) => {
    const user = useAuthStore.getState().user;

    if (!user) {
      let cart = readGuestCart();
      if (quantity <= 0) {
        cart = cart.filter((i) => i.product._id !== productId);
      } else {
        const item = cart.find((i) => i.product._id === productId);
        if (item) item.quantity = quantity;
      }
      writeGuestCart(cart);
      set({ cart });
      return;
    }

    try {
      const res = await api.put(`/cart/${productId}`, { quantity });
      set({ cart: res.data.cart });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update cart");
    }
  },

  removeItem: async (productId) => {
    const user = useAuthStore.getState().user;

    if (!user) {
      const cart = readGuestCart().filter((i) => i.product._id !== productId);
      writeGuestCart(cart);
      set({ cart });
      return;
    }

    try {
      const res = await api.delete(`/cart/${productId}`);
      set({ cart: res.data.cart });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not remove item");
    }
  },

  checkout: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      // Forced Action: guest checkout is intentionally not offered here --
      // the cart page surfaces an account-creation prompt instead. This is
      // a deliberate dark pattern for the extension to detect, not a real
      // limitation of the backend (which has no such restriction baked in).
      return null;
    }
    try {
      const res = await api.post("/cart/checkout");
      set({ cart: [] });
      return res.data.order;
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed");
      return null;
    }
  },
}));
