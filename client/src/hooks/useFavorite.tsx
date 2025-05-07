import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../components/redux/hook";
import { getAllFavorites } from "../components/redux/thunk/favoriteAction";

const useFavorite = () => {
  const dispatch = useAppDispatch();
  const { favorite } = useAppSelector((state) => state.FavoriteSlice);
  const { user, loading } = useAppSelector((state) => state.UserSlice);

  useEffect(() => {
    if (user) {
      dispatch(getAllFavorites());
    }
  }, [dispatch, user]);

  return { favorite, loading };
};
export default useFavorite;
