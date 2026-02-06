import { createSlice } from "@reduxjs/toolkit";

const EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes

// 🔹 Load from sessionStorage safely
const loadMenuFromSession = () => {
  if (typeof window === "undefined") return [];

  const expiry = sessionStorage.getItem("menu_expiry");
  const now = new Date().getTime();

  if (expiry && now > parseInt(expiry)) {
    // Expired → clear old data
    sessionStorage.removeItem("menu");
    sessionStorage.removeItem("menu_expiry");
    return [];
  }

  const stored = sessionStorage.getItem("menu");
  return stored ? JSON.parse(stored) : [];
};

const initialState = {
  menu: loadMenuFromSession(),
   loading: false,   // 🔥 loader state
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenu: (state, action) => {
      state.menu = action.payload;   
      state.loading = false; 
      // Save in sessionStorage
      sessionStorage.setItem("menu", JSON.stringify(action.payload));

      // Set expiry time
      const expiryTime = new Date().getTime() + EXPIRY_TIME;
      sessionStorage.setItem("menu_expiry", expiryTime.toString());
    },

    clearMenu: (state) => {
      state.menu = [];
      sessionStorage.removeItem("menu");
      sessionStorage.removeItem("menu_expiry");
    },
  },
});

export const { setMenu, clearMenu } = menuSlice.actions;
export default menuSlice.reducer;
