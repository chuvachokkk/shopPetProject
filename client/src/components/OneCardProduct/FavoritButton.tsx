import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAppDispatch } from '../redux/hook';
import {
  addToFavorite,
  deleteFromFavorite,
} from '../redux/thunk/favoriteAction';

export default function FavoriteButton({
  productId,
  isFavorite,
}: {
  productId: number;
  isFavorite: boolean;
}) {
  const dispatch = useAppDispatch();

  function toggleFavorite(productId: number) {
    if (isFavorite) {
      dispatch(deleteFromFavorite({ productId }));
    } else {
      dispatch(addToFavorite({ productId }));
    }
  }

  return (
    <IconButton
      onClick={() => toggleFavorite(productId)}
      sx={{
        color: 'black',
        border: 'none',
        cursor: 'pointer',
        zIndex: 2,
      }}
    >
      {isFavorite ? <FavoriteIcon color='error' /> : <FavoriteBorderIcon />}
    </IconButton>
  );
}
