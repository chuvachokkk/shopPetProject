import { createAsyncThunk } from "@reduxjs/toolkit";
import $api from "../../../services/api-instance";
import { User } from "../../../types/userTypes";
import { CartItem } from "../../Cart/Cart";

export const cartPut = createAsyncThunk(
  "Cart/Put",
  async ({
    userId,
    id,
    size,
  }: {
    userId: number | undefined;
    id: number | undefined | string;
    size: string | undefined;
  }) => {
    const { data } = await $api.post("api/cart", {
      userId,
      productId: id,
      size,
    });
    return data;
  }
);

export const cartState = createAsyncThunk(
  "Cart/State",
  async (user: User | null) => {
    const { data } = await $api.get(`api/cart/${user?.id}`);

    return data;
  }
);

export const cartDel = createAsyncThunk("Cart/Del", async (item: CartItem) => {
  const { data } = await $api.delete(`/api/cart/${item.id}`);
  console.log(data)
  return data;
});

export const cartDelAll = createAsyncThunk("Cart/DelAll", async (user: User | null) => {
  const { data } = await $api.delete(`/api/cart/all/${user?.id}`);
  return data;
});