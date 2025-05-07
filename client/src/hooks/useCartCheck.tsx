import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../components/redux/hook";
import { cartState } from "../components/redux/thunk/cartAction";

const useAuthCheck = () => {
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.CartSlice);

  const { user, loading } = useAppSelector((state) => state.UserSlice);

  useEffect(() => {
    if (user) {
      dispatch(cartState(user));
    }
  }, [dispatch, user]);

  return { cart, loading };
};
export default useAuthCheck;
