import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useAppDispatch } from "../redux/hook";
import {
  addToFavorite,
  deleteFromFavorite,
} from "../redux/thunk/favoriteAction";

export default function AddToFavoriteIcon({ productId, isFavorite }) {
  const dispatch = useAppDispatch();

  function toggleFavorite(productId) {
    if (isFavorite) {
      dispatch(deleteFromFavorite({ productId }));
    } else {
      dispatch(addToFavorite({ productId }));
    }
  }

  return (
    <IconButton
      onClick={() => toggleFavorite(productId)}
      color="primary"
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        border: "none",
        borderRadius: "50%",
        cursor: "pointer",
        zIndex: 2,
      }}
    >
      {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
    </IconButton>
  );
}
