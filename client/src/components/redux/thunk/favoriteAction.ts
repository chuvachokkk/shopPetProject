import { createAsyncThunk } from "@reduxjs/toolkit";
import $api from "../../../services/api-instance";
import { AxiosError } from "axios";

type Favorite = {
  productId: number;
};

export const addToFavorite = createAsyncThunk(
  "Favorite/add",
  async ({ productId }: Favorite) => {
    try {
      const { data } = await $api.post("api/favorites/", {
        productId,
      });

      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return console.log(error);
      }
    }
  }
);

export const deleteFromFavorite = createAsyncThunk(
  "Favorite/delete",
  async ({ productId }: Favorite) => {
    try {
      const { data } = await $api.delete("api/favorites", {
        params: { productId },
      });

      return productId;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return console.log(error);
      }
    }
  }
);

export const getAllFavorites = createAsyncThunk(
  "Favorite/getAllFavorites",
  async () => {
    try {
      const { data } = await $api.get("api/favorites");

      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return console.log(error);
      }
    }
  }
);
