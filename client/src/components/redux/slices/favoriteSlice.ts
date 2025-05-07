import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Favorite } from "../../../types/userTypes";
import {
  addToFavorite,
  deleteFromFavorite,
  getAllFavorites,
} from "../thunk/favoriteAction";

interface ErrorResponse {
  success: boolean;
  errors: string | { field: string; message: string }[];
}

export interface IFavoriteState {
  favorite: Favorite[];
  loading: boolean;
  error: ErrorResponse | null;
}

const initialState: IFavoriteState = {
  favorite: [],
  loading: false,
  error: null,
};

const FavoriteSlice = createSlice({
  name: "Favorite",
  initialState,
  reducers: {
    clearFavorites(state) {
      state.favorite = [];
    },
  },
  extraReducers: (builder) => {
    //* Добавить в избранное

    builder.addCase(addToFavorite.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      addToFavorite.fulfilled,
      (state, action: PayloadAction<Favorite>) => {
        state.favorite?.push(action.payload);

        state.loading = false;
        state.error = null;
      }
    );

    builder.addCase(addToFavorite.rejected, (state) => {
      state.loading = false;
    });

    //* Удалить из избранного
    builder.addCase(deleteFromFavorite.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      deleteFromFavorite.fulfilled,
      (state, action: PayloadAction<Favorite>) => {
        state.favorite = state.favorite?.filter((item) => {
          return item.productId !== action.payload;
        });
        state.loading = false;
        state.error = null;
      }
    );

    builder.addCase(deleteFromFavorite.rejected, (state) => {
      state.loading = false;
    });

    //* Получить все товары избранного
    builder.addCase(getAllFavorites.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      getAllFavorites.fulfilled,
      (state, action: PayloadAction<Favorite>) => {
        state.favorite = action.payload;
        state.loading = false;
        state.error = null;
      }
    );

    builder.addCase(getAllFavorites.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default FavoriteSlice.reducer;
export const { clearFavorites } = FavoriteSlice.actions;
