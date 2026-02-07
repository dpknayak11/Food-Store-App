import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'  
import cartReducer from './slices/cartSlice' 

import menuReducer from './slices/menuSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    cart: cartReducer,
  },
})

export default store