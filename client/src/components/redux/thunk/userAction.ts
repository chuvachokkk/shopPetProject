import { createAsyncThunk } from "@reduxjs/toolkit";
import $api, { setAccessToken } from "../../../services/api-instance";
import { User } from "../../../types/userTypes";
import axios, { AxiosError } from "axios";

interface ErrorResponse {
  success: boolean;
  errors: string | { field: string; message: string }[];
}

export const signinUser = createAsyncThunk<
  User,
  { email: string; password: string; captchaToken: string },
  { rejectValue: ErrorResponse }
>("User/signin", async ({ email, password, captchaToken }, thunkAPI) => {
  try {
    const { data } = await $api.post(`/user/signin`, {
      email,
      password,
      captchaToken,
    });
    console.log("🚀 ~ > ~ data:", data);

    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      return thunkAPI.rejectWithValue({
        success: false,
        errors: error.response.data.errors,
      });
    }
  }
});

export const signupUser = createAsyncThunk<
  User,
  { email: string; password: string; captchaToken: string },
  { rejectValue: ErrorResponse }
>("User/signup", async ({ email, password, captchaToken }, thunkAPI) => {
  try {
    const { data } = await $api.post(`/user/signup`, {
      email,
      password,
      captchaToken,
    });

    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      return thunkAPI.rejectWithValue({
        success: false,
        errors: error.response.data.errors,
      });
    }
  }
});

export const signoutUser = createAsyncThunk("User/signout", async () => {
  await $api.get(`/user/signout`);
  return;
});

export const checkAuth = createAsyncThunk<User | null>(
  "User/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await $api.get("/verify");

      if (data.user) {
        setAccessToken(data.user.accessToken);
        return data.user;
      } else {
        return null;
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Ошибка авторизации");
    }
  }
);

export const updateUser = createAsyncThunk<
  User | null,
  {
    email?: string;
    name?: string;
    lastname?: string;
    surname?: string;
    address?: string;
    phone?: string;
  }
>("User/update", async (userData, thunkAPI) => {
  try {
    const { data } = await $api.patch("/api/user/", userData);

    if (data) {
      return {
        ...userData,
      };
    } else {
      return false;
    }
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Ошибка авторизации"
    );
  }
});
