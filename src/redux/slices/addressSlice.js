import { createSlice } from "@reduxjs/toolkit";

const EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes

// 🔹 Load from sessionStorage safely
const loadAddressFromSession = () => {
  if (typeof window === "undefined") return [];

  const expiry = sessionStorage.getItem("address_expiry");
  const now = new Date().getTime();

  if (expiry && now > parseInt(expiry)) {
    sessionStorage.removeItem("address");
    sessionStorage.removeItem("address_expiry");
    return [];
  }

  const stored = sessionStorage.getItem("address");
  return stored ? JSON.parse(stored) : [];
};

const initialState = {
  address: loadAddressFromSession(),
  loading: false,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
      state.loading = false;

      // Save fresh address list
      sessionStorage.setItem("address", JSON.stringify(action.payload));

      const expiryTime = new Date().getTime() + EXPIRY_TIME;
      sessionStorage.setItem("address_expiry", expiryTime.toString());
    },

    clearAddress: (state) => {
      state.address = [];
      sessionStorage.removeItem("address");
      sessionStorage.removeItem("address_expiry");
    }
  },
});

export const { setAddress, clearAddress } = addressSlice.actions;
export default addressSlice.reducer;
