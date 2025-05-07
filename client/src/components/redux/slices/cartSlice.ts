import { ActionReducerMapBuilder, createSlice, Draft } from "@reduxjs/toolkit";
import { cartDel, cartDelAll, cartPut, cartState } from "../thunk/cartAction";
import { Cart } from "../../OneCardProduct/OneCardProduct";

type StateInit = {
  cart: Cart[];
  loading: boolean;
  error: object;
};

const initialState: StateInit = {
  cart: [],
  loading: true,
  error: {},
};

const CartSlice = createSlice({
  name: "Cart",
  initialState,
  reducers: {
    clearCart(state) {
      state.cart = [];
    },
  },
  extraReducers(builder: ActionReducerMapBuilder<StateInit>): void {
    builder.addCase(cartPut.pending, (state: Draft<StateInit>) => {
      state.loading = true;
    });
    builder.addCase(cartPut.fulfilled, (state: Draft<StateInit>, action) => {
      state.cart = (state.cart.some(el=> el.id === action.payload.id) ?
      state.cart.map(el=> el.id === action.payload.id ? action.payload: el) 
      :[...state.cart, action.payload]);
      state.loading = false;
    });
    builder.addCase(cartPut.rejected, (state: Draft<StateInit>, action) => {
      state.error = action;
      state.loading = false;
    });
    builder.addCase(cartState.pending, (state: Draft<StateInit>) => {
      state.loading = true;
    });
    builder.addCase(cartState.fulfilled, (state: Draft<StateInit>, action) => {
      state.cart = action.payload;
      state.loading = false;
    });
    builder.addCase(cartState.rejected, (state: Draft<StateInit>, action) => {
      state.error = action;
      state.loading = false;
    });
    builder.addCase(cartDel.pending, (state: Draft<StateInit>) => {
      state.loading = true;
    });
    builder.addCase(cartDel.fulfilled, (state: Draft<StateInit>, action) => {
      if(typeof(action.payload) == 'number'){
        state.cart = state.cart.filter((el) => el.id !== action.payload); 
      }else{
        state.cart = state.cart.map((el) => el.id === action.payload.id ?action.payload: el);
      }
      state.loading = false;
    });
    builder.addCase(cartDel.rejected, (state: Draft<StateInit>, action) => {
      state.error = action;
      state.loading = false;
    });
    builder.addCase(cartDelAll.pending, (state: Draft<StateInit>) => {
      state.loading = true;
    });
    builder.addCase(cartDelAll.fulfilled, (state: Draft<StateInit>, action) => {
      if(action.payload){
        state.cart = [];
      }
      state.loading = false;
    });
    builder.addCase(cartDelAll.rejected, (state: Draft<StateInit>, action) => {
      state.error = action;
      state.loading = false;
    });
  },
});

export default CartSlice.reducer;
export const { clearCart } = CartSlice.actions;
