import Grid from '@mui/material/Grid2';

import {
  Box,
  Button,
  Typography,
  ImageList,
  ImageListItem,
  InputLabel,
  FormControl,
  MenuItem,
  CardContent,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Rating,
  Stack,
} from '@mui/material';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from 'react';
import $api from '../../services/api-instance';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { cartDel, cartPut } from '../redux/thunk/cartAction';
import TableProduct from './TableProduct';
import LoginForm from '../LoginForm/LoginForm';
import RegistrationForm from '../RegistrationForm/RegistrationForm';
import CarouselItem from './CarouselItem';
import Price from './Price';
import FavoriteButton from './FavoritButton';
import useFavorite from '../../hooks/useFavorite';
import { CartItem } from '../Cart/Cart';

export type Cart = {
  id: number;
  userId: number;
  productId: number;
  size: string;
  count: number;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// const itemData = [
//   {
//     img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
//     title: 'Breakfast',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
//     title: 'Burger',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
//     title: 'Camera',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
//     title: 'Coffee',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
//     title: 'Hats',
//   },
// ];

export interface User {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  title: string;
  price: string;
  description: string;
  compaund: string;
  image: string;
  typeId: number;
  categoryId: number;
  rating: number;
  discount: number;
}
export type Review = {
  id: number;
  name: string;
  userId: number;
  productId: number;
  review: string;
  rating: number;
};

function createData(
  rus: number,
  size: string,
  size1: number | string,
  size2: number | string,
  size3: number | string,
  size4: number | string
) {
  return { rus, size, size1, size2, size3, size4 };
}

const rows = [
  createData(46, 'S', 92, 80, 94, 182),
  createData(48, 'M', 96, 84, 98, 182),
  createData(50, 'L', '100-102', '88-92', '102-104', 182),
  createData(52, 'XL', '104-106', '92-96', '106-108', 182),
];

function OneCardProduct() {
  const { id } = useParams();

  const { favorite } = useFavorite();

  const [size, setSize] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [same, setSame] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loginForm, setLoginForm] = useState(true);
  const [openLogin, setOpenLogin] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);

  const { user } = useAppSelector((store) => store.UserSlice);
  const { cart } = useAppSelector((store) => store.CartSlice);

  const handleChange = (event: SelectChangeEvent) => {
    setSize(event.target.value);
  };

  async function delHandler(item: CartItem) {
    try {
      dispatch(cartDel(item));
    } catch (error) {
      console.log('Ошибка при работе с корзиной:', error);
    }
  }

  const parseImages = (imageString: string): string[] => {
    let images: string[] = [];
    try {
      const cleanedString = imageString
        .replace(/[{}"]/g, '')
        .split(',')
        .map((img: string) => img.trim());

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

  useEffect(() => {
    (async function () {
      try {
        const res = await $api.get(`/product/${id}`);
        setProduct(() => res.data);
        const response = await $api.get(`/product/review/${id}`);
        setReviews(() => response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [id, user]);

  useEffect(() => {
    (async function () {
      try {
        if (product?.categoryId) {
          const { data } = await $api.get(
            `/product/same/${product?.categoryId}`
          );
          const filteredData = data.filter(
            (el: Product) => el.id !== Number(id)
          );
          setSame(() => filteredData);
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
      } catch (error) {
        console.log(error); 
      }
    })();
  }, [product]);

  const dispatch = useAppDispatch();

  async function CartHadler() {
    try {
      dispatch(cartPut({ userId: user?.id, id, size }));
    } catch (error) {
      console.log(error);
    }
  }

  if (!product) {
    return <div>Загрузка...</div>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={8} sx={{ marginLeft: '70px' }}>
          <ImageList
            sx={{ width: '70%', height: '100%' }}
            variant='masonry'
            cols={2}
            gap={10}
          >
            {[
              ...(product?.image ? parseImages(product.image) : []),
              ...new Array(
                5 - (product?.image ? parseImages(product.image).length : 0)
              ).fill('/placeholder.png'),
            ]
              .slice(0, 2)
              .map((item, index) => (
                <ImageListItem key={index}>
                  <img
                    srcSet={`${item}?w=161&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item}?w=161&fit=crop&auto=format`}
                    alt={`картинка товара ${index + 1}`}
                    loading='lazy'
                  />
                </ImageListItem>
              ))}
          </ImageList>
        </Grid>
        <Grid
          size={3}
          container
          direction='column'
          justifyContent='flex-start'
          sx={{ marginLeft: '20px' }}
        >
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              padding: 2,
              zIndex: 1,
            }}
          >
            <Stack spacing={1}>
              <Rating
                name='half-rating-read'
                value={product.rating}
                precision={0.1}
                sx={{ color: 'black' }}
                readOnly
              />

              {reviews.length > 0 && (
                <Typography
                  variant='body1'
                  sx={{
                    color: 'text.secondary',
                    marginLeft: '50px',
                    marginBottom: '50px',
                  }}
                >
                  {reviews.length === 1
                    ? '1 отзыв'
                    : reviews.length > 4
                    ? reviews.length + ' отзывов'
                    : reviews.length + ' отзыва'}
                </Typography>
              )}
            </Stack>
            <h2>{product.title}</h2>
            <h3>Цена:</h3>
            <Price product={product} />
            <FormControl
              sx={{ minWidth: 190, marginBottom: '20px' }}
              size='small'
            >
              <InputLabel id='demo-select-small-label'>
                Выберите размер
              </InputLabel>
              <Select
                labelId='demo-select-small-label'
                id='demo-select-small'
                value={size}
                label='Size'
                onChange={handleChange}
              >
                <MenuItem value={''}>Не выбран</MenuItem>
                <MenuItem value={'S'}>S</MenuItem>
                <MenuItem value={'M'}>M</MenuItem>
                <MenuItem value={'L'}>L</MenuItem>
                <MenuItem value={'XL'}>XL</MenuItem>
              </Select>
            </FormControl>
            <Button
              onClick={handleOpen}
              sx={{ marginBottom: '10px', color: 'balck' }}
            >
              Таблица размеров
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby='modal-modal-title'
              aria-describedby='modal-modal-description'
            >
              <Box sx={style}>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 650, width: '100%' }}
                    aria-label='simple table'
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>RUS</TableCell>
                        <TableCell align='right'>INT</TableCell>
                        <TableCell align='right'>Обхват груди</TableCell>
                        <TableCell align='right'>Обхват талии</TableCell>
                        <TableCell align='right'>Обхват бедер</TableCell>
                        <TableCell align='right'>Рост</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow
                          key={row.rus}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell component='th' scope='row'>
                            {row.rus}
                          </TableCell>
                          <TableCell align='right'>{row.size}</TableCell>
                          <TableCell align='right'>{row.size1}</TableCell>
                          <TableCell align='right'>{row.size2}</TableCell>
                          <TableCell align='right'>{row.size3}</TableCell>
                          <TableCell align='right'>{row.size4}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Modal>
            {user ? (
              size !== '' ? (
                <Stack direction='row' spacing={2} alignItems='center'>
                  {cart.some(
                    (el: Cart) => el.productId == product.id && el.size == size
                  ) ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '100px',
                        marginBottom: '50px',
                      }}
                    >
                      <Button
                        variant='outlined'
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
                        onClick={() =>
                          delHandler(
                            cart.find(
                              (el) => el.productId == product.id
                            ) as CartItem
                          )
                        }
                      >
                        -
                      </Button>
                      <Typography
                        sx={{
                          mx: 2,
                          fontSize: '14px',
                        }}
                      >
                        {cart.find(
                          (el: Cart) =>
                            el.productId === product.id && el.size === size
                        )?.count || 0}
                      </Typography>
                      <Button
                        variant='outlined'
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
                        onClick={CartHadler}
                      >
                        +
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <Button
                        variant='outlined'
                        sx={{
                          fontSize: '12px',
                          color: 'black',
                          borderColor: 'black',
                          marginRight: 1,
                          marginTop: '100px',
                          marginBottom: '50px',
                          '&:hover': {
                            borderColor: 'black',
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                        onClick={CartHadler}
                      >
                        Добавить
                      </Button>
                    </>
                  )}
                  <Box>
                    <FavoriteButton
                      productId={product.id}
                      isFavorite={
                        favorite?.some(
                          (item) => item.productId === product.id
                        ) || false
                      }
                    />
                  </Box>
                </Stack>
              ) : (
                <Stack direction='row' spacing={2} alignItems='center'>
                  <Tooltip title='ВЫБЕРИТЕ РАЗМЕР'>
                    <Button
                      variant='outlined'
                      sx={{
                        fontSize: '12px',
                        color: 'black',
                        borderColor: 'black',
                        marginRight: 1,
                        marginTop: '100px',
                        marginBottom: '50px',
                        '&:hover': {
                          borderColor: 'black',
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      Добавить
                    </Button>
                  </Tooltip>
                  <Box>
                    <FavoriteButton
                      productId={product.id}
                      isFavorite={
                        favorite?.some(
                          (item) => item.productId === product.id
                        ) || false
                      }
                    />
                  </Box>
                </Stack>
              )
            ) : (
              <>
                <Button
                  variant='outlined'
                  onClick={handleOpenLogin}
                  sx={{
                    fontSize: '12px',
                    color: 'black',
                    borderColor: 'black',
                    marginRight: 1,
                    marginTop: '100px',
                    marginBottom: '50px',
                    '&:hover': {
                      borderColor: 'black',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  Войти и добавить в Корзину
                </Button>
                <Modal
                  open={openLogin}
                  onClose={handleCloseLogin}
                  slotProps={{
                    backdrop: {
                      style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      },
                    },
                  }}
                >
                  {loginForm ? (
                    <LoginForm setOpen={setOpen} setLoginForm={setLoginForm} />
                  ) : (
                    <RegistrationForm
                      setOpen={setOpen}
                      setLoginForm={setLoginForm}
                    />
                  )}
                </Modal>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
      <Grid size={12} sx={{ margin: '70px' }}>
        <CardContent sx={{ maxWidth: '100%', padding: '20px' }}>
          <TableProduct
            product={product}
            user={user}
            reviews={reviews}
            setReviews={setReviews}
            setProduct={setProduct}
            handleOpenLogin={handleOpenLogin}
          />
        </CardContent>
      </Grid>
      <Box sx={{ margin: '50px 0' }}>
        <Typography
          gutterBottom
          variant='h5'
          component='div'
          sx={{ marginLeft: '650px' }}
        >
          Похожие товары
        </Typography>
        {same.length === 0 ? (
          <Typography
            variant='body1'
            sx={{
              color: 'text.secondary',
              marginLeft: '650px',
              marginBottom: '50px',
            }}
          >
            Похожие товары отсутствуют
          </Typography>
        ) : (
          <div style={{ margin: '50px', width: '50%', marginLeft: '400px' }}>
            <CarouselItem same={same} />
          </div>
        )}
      </Box>
    </Box>
  );
}

export default OneCardProduct;
