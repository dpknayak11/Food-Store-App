import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      // ✅ Save in localStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;

      // ❌ Remove from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("cartItems");
      sessionStorage.removeItem("menu");
      sessionStorage.removeItem("menu_expiry");
       sessionStorage.removeItem("address");
    sessionStorage.removeItem("address_expiry");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
