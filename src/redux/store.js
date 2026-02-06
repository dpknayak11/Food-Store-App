import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'  // default import hona chahiye

import menuReducer from './slices/menuSlice' // menu reducer import karna hoga
export const store = configureStore({
  reducer: {
    auth: authReducer, // reducer function yahan pass ho raha hai
    menu: menuReducer, // menu reducer bhi add karna hoga
  },
})

export default store