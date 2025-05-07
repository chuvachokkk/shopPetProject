import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../components/redux/hook";
import { checkAuth } from "../components/redux/thunk/userAction";

const useAuthCheck = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.UserSlice);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return { user, loading };
};
export default useAuthCheck;
