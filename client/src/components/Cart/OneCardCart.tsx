import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { CartItem } from './Cart';
import { useNavigate } from 'react-router-dom';
import Price from '../OneCardProduct/Price';
import { useAppDispatch } from '../redux/hook';
import { cartPut } from '../redux/thunk/cartAction';
import { Dispatch, SetStateAction } from 'react';
import useFavorite from '../../hooks/useFavorite';
import FavoriteButton from '../OneCardProduct/FavoritButton';

const parseImages = (imageString: string): string[] => {
  let images: string[] = [];
  try {
    const cleanedString = imageString
      .replace(/[{}"]/g, '') // убираем фигурные скобки и кавычки
      .split(',') // разделяем по запятой
      .map((img: string) => img.trim()); // удаляем лишние пробелы

    images = cleanedString;

    if (images.length === 0) {
      images = [];
    }
  } catch (err) {
    console.error('Ошибка при парсинге изображения:', err);
  }

  return images.length
    ? images.map((img) => `http://localhost:3000${img}`)
    : [];
};

function OneCardCart({
  item,
  cartHandler,
  setCartItems,
}: {
  item: CartItem;
  cartHandler: (item: CartItem) => Promise<void>;
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { favorite } = useFavorite();

  const images = parseImages(item.image); // Получаем массив изображений

  async function CartPlusHadler() {
    try {
      dispatch(
        cartPut({ userId: item.userId, id: item.productId, size: item.size })
      );
      setCartItems((pre: CartItem[]) =>
        pre.map((el: CartItem) =>
          el.id === item.id ? { ...el, count: el.count + 1 } : el
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Card
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '5px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            width: '450px',
            height: '250px',
          }}
          onClick={() => navigate(`/product/${item.productId}`)}
        >
          <img
            src={images[0]} // отображаем первое изображение
            alt={item.title}
            style={{ width: '170px', height: '220px', marginRight:'80px' }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
              alignItems: 'start',
            }}
          >
            <Typography sx={{fontSize: '16px'}}>{item.title }</Typography>
            <Typography sx={{fontSize: '16px'}} >Размер {item.size}</Typography>
          </div>
          <div>
          <Typography sx={{ml: 1 , fontSize: '14px' }}>
            {item.count > 1 && <p>Кол-во {item.count} шт.</p>}
            </Typography>
            </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
              alignItems: 'end',
            }}
          >
            <Price product={item} />
            <Stack direction='row' spacing={2} alignItems='center'>
            <Stack
              spacing={1}
              direction="row"
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  fontSize: '12px',
                  color: 'black',
                  borderColor: 'black',
                  minWidth: '30px',
                  '&:hover': {
                    borderColor: 'black',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
                onClick={() => cartHandler(item)}
              >
                -
              </Button>
              <Typography
                sx={{
                  mx: 2,
                  fontSize: '14px',
                }}
              >
                {item.count}
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  fontSize: '12px',
                  color: 'black',
                  borderColor: 'black',
                  minWidth: '30px',
                  '&:hover': {
                    borderColor: 'black',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
                onClick={CartPlusHadler}
              >
                +
              </Button>
            </Stack>
            <Box>
              <FavoriteButton
                productId={item.productId}
                isFavorite={
                  favorite?.some((el) => el.productId === item.productId) || false
                }
              />
            </Box>
          </Stack>
        </div>
      </div>
    </Card>
    </>
  );
}

export default OneCardCart;
