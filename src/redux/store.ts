import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth.slice";
import productReducer from "./features/product/product.slice";
import cartReducer from "./features/cart/cart.slice";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer
  },
});

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch = typeof store.dispatch;