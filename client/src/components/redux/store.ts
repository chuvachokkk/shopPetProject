import { configureStore } from "@reduxjs/toolkit";
import CartSlice from "./slices/cartSlice";
import UserSlice from "./slices/userSlice";
import FavoriteSlice from "./slices/favoriteSlice";

export const store = configureStore({
  reducer: {
    CartSlice,
    UserSlice,
    FavoriteSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
