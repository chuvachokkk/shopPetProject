import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../types/userTypes";
import {
  signinUser,
  signoutUser,
  signupUser,
  checkAuth,
  updateUser,
} from "../thunk/userAction";

interface ErrorResponse {
  success: boolean;
  errors: string | { field: string; message: string }[];
}

export interface IUserState {
  user: User | null;
  loading: boolean;
  error: ErrorResponse | null;
}

const initialState: IUserState = {
  user: null,
  loading: false,
  error: null,
};

const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //* Авторизация пользователя
    builder.addCase(signinUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      signinUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      }
    );

    builder.addCase(
      signinUser.rejected,
      (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = { success: false, errors: "Неизвестная ошибка" };
        }
      }
    );

    //* Выход пользователя
    builder.addCase(signoutUser.fulfilled, (state) => {
      state.user = null;
      state.loading = false;
    });

    //* Регистрация пользователя
    builder.addCase(signupUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      signupUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      }
    );

    builder.addCase(
      signupUser.rejected,
      (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.loading = false;
        if (action.payload) {
          console.log(action.payload);

          state.error = action.payload;
        } else {
          state.error = { success: false, errors: "Неизвестная ошибка" };
        }
      }
    );

    builder.addCase(checkAuth.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      checkAuth.fulfilled,
      (state, action: PayloadAction<User | null>) => {
        state.user = action.payload;
        state.loading = false;
      }
    );

    builder.addCase(checkAuth.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      updateUser.fulfilled,
      (state, action: PayloadAction<User | null>) => {
        if (state.user && action.payload) {
          state.user = { ...state.user, ...action.payload };
        }
        state.loading = false;
      }
    );

    builder.addCase(
      updateUser.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export default UserSlice.reducer;
