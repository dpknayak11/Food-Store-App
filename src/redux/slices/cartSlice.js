import { createSlice } from "@reduxjs/toolkit";

// 🔹 Function to load cart data from localStorage when app starts
const loadCartFromStorage = () => {
  if (typeof window === "undefined") return []; // Prevent SSR error

  const storedCart = localStorage.getItem("cartItems");
  return storedCart ? JSON.parse(storedCart) : [];
};

// 🔹 Initial Redux state
const initialState = {
  items: loadCartFromStorage(), // Load saved cart items
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ➕ Add product to cart
    addToCart: (state, action) => {
      const item = action.payload;

      // Check if item already exists in cart
      const existingItem = state.items.find((i) => i._id === item._id);

      if (existingItem) {
        existingItem.qty += 1; // Increase quantity
      } else {
        state.items.push({ ...item, qty: 1 }); // Add new item
      }

      // Save updated cart to localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    // ➖ Decrease product quantity
    decreaseQty: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);

      if (item && item.qty > 1) {
        item.qty -= 1; // Reduce quantity
      }

      // Update localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    // ❌ Remove item completely from cart
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);

      // Update localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    // 🧹 Clear entire cart
    clearCart: (state) => {
      state.items = [];

      // Remove from localStorage
      localStorage.removeItem("cartItems");
    },
  },
});

// Export actions
export const { addToCart, decreaseQty, removeFromCart, clearCart } =
  cartSlice.actions;

// Export reducer
export default cartSlice.reducer;
