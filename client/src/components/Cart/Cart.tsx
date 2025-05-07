import { useState, useEffect } from 'react';
import { Typography, Button, Box, Card, Modal, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import $api from '../../services/api-instance';

import OneCardCart from './OneCardCart';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { cartDel, cartDelAll } from '../redux/thunk/cartAction';
import LoginForm from '../LoginForm/LoginForm';
import RegistrationForm from '../RegistrationForm/RegistrationForm';
import Price from '../OneCardProduct/Price';
import CarouselItem from '../OneCardProduct/CarouselItem';
import { Product } from '../OneCardProduct/OneCardProduct';
import Order, { Init } from './Order';
import { useNavigate } from 'react-router-dom';

export interface CartItem {
  id: number;
  productId: number;
  size: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  price: string;
  description: string;
  compaund: string;
  image: string;
  typeId: number;
  categoryId: number;
  userId: number;
  discount: number;
  count: number;
}

function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const totalItems = cartItems.reduce((acc, item) => acc + item.count, 0);
  const Total = cartItems.reduce(
    (acc, el) => (acc += Number(el.price) * el.count),
    0
  );
  const TotalDiscount = cartItems.reduce((acc, el) => {
    return (
      acc +
      (el.discount > 0
        ? Number(el.price) * el.count - 
          Math.floor(Number(el.price) * el.count * (el.discount / 100))
        : Number(el.price) * el.count)
    );
  }, 0);

  const [loginForm, setLoginForm] = useState(true);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [code, setCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [orderOpen, setOrderOpen] = useState(false);

  const [sale, setSale] = useState<Product[]>([]);

  const navigate=useNavigate();

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((store) => store.UserSlice);

  useEffect(() => {
    (async function () {
      try {
        if (user) {
          const { data } = await $api.get(`/api/cart/items/${user.id}`);
          setCartItems(data);
          const response = await $api.get('/product/sale/all');
          setSale(() => response.data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [user, dispatch]);

  const parseImages = (imageString: string): string[] => {
    let images: string[] = [];
    try {
      const cleanedString = imageString
        .replace(/[{}"]/g, '') // убираем ненужные символы
        .split(',') // разделяем по запятой
        .map((img: string) => img.trim()); // очищаем пробелы

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

  async function cartHandler(item: CartItem) {
    try {
      dispatch(cartDel(item));
      setCartItems((pre: CartItem[]) =>
        pre
          .map((el) =>
            el.id !== item.id
              ? el
              : item.count > 1
              ? { ...el, count: el.count - 1 }
              : null
          )
          .filter((el) => el !== null)
      );
    } catch (error) {
      console.log('Ошибка при работе с корзиной:', error);
    }
  }

  async function handleOrder(inputs: Init) {
    try {
      const data = JSON.stringify(cartItems);

      await $api.post('/api/order', { inputs, data, user });
      setOrderOpen(false);
      dispatch(cartDelAll(user));
      setCartItems(() => []);
      navigate('/profile')
      
    } catch (error) {
      console.log('Ошибка при заказе:', error);
    }
  }

  function submitCode() {
    setCode('');
    if (code === 'ELBRUS5') {
      setDiscount(() => 5);
    }
  }

  return (
    <>
      {user ? (
        cartItems.length > 0 ? (
          <>
            <Grid container sx={{ padding: '50px', marginBottom: '20px' }}>
              <Grid
                size={8}
                sx={{
                  marginLeft: '40px',
                  marginRight: '180px',
                  marginTop: '20px',
                }}
              >
                <Grid
                  container
                  direction="column"
                  spacing={2}
                  sx={{
                    justifyContent: 'space-evenly',
                    alignItems: 'stretch',
                    marginLeft: '20px',
                  }}
                >
                  <Typography gutterBottom variant="h6" component="div">
                    Ваш заказ:
                  </Typography>
                  {cartItems.map((item: CartItem) => {
                    const images = parseImages(item.image);
                    return (
                      <OneCardCart
                        key={item.id}
                        item={item}
                        images={images} // Передаем изображения
                        cartHandler={cartHandler}
                        setCartItems={setCartItems}
                      />
                    );
                  })}
                </Grid>
              </Grid>
              <Grid size={2}>
                <Box
                  sx={{
                    position: 'sticky',
                    top: 0,
                    padding: 2,
                    zIndex: 1,

                  }}
                >
                  <Card sx={{ minWidth: 275 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'column',
                        alignItems: 'start',
                        padding: '20px',
                      }}
                    >
                      <Typography gutterBottom variant="h6" component="div">
                        Сумма заказа:
                      </Typography>
                      <Typography variant="h6">{totalItems} товара</Typography>
                      {cartItems.map((item: CartItem) => (
                        <div key={item.id}>
                          {item.count > 1 ? (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                flexDirection: 'column',
                              }}
                            >
                              <span>{item.count} x</span>
                              <Price product={item} />
                            </div>
                          ) : (
                            <Price product={item} />
                          )}
                        </div>
                      ))}
                      <Typography gutterBottom variant="h6" component="div">
                        Итого:
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          borderTop: 1,
                          borderColor: 'black',
                          marginTop: '10px',
                        }}
                      >
                        {cartItems.some((el) => el.discount > 0) ? (
                          <>
                            <Typography
                              component="span"
                              sx={{
                                textDecoration: 'line-through',
                                marginRight: '8px',
                              }}
                            >
                              {Total} ₽
                            </Typography>
                            <Typography
                              component="span"
                              sx={{
                                color: 'red',
                                fontWeight: 'bold',
                                marginRight: '8px',
                              }}
                            >
                              {TotalDiscount -
                                Math.floor(
                                  Number(TotalDiscount) * (discount / 100)
                                )}{' '}
                              ₽
                            </Typography>
                          </>
                        ) : (
                          <Typography component="span">{Total} ₽</Typography>
                        )}
                      </Typography>
                      <TextField
                        id="promo"
                        label="Введите промокод"
                        variant="outlined"
                        type="text"
                        sx={{ mt: 2, ml: 2 }}
                        value={code}
                        onChange={(e) => setCode(() => e.target.value)}
                      />

                      <Button
                        variant="outlined"
                        sx={{
                          color: 'black',
                          borderColor: 'black',
                          mt: 2,
                          ml: 6,
                          '&:hover': {
                            borderColor: 'black',
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                        onClick={submitCode}
                      >
                        Применить
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setOrderOpen(true)}
                        sx={{
                          color: 'black',
                          borderColor: 'black',
                          margin: '30px',
                          '&:hover': {
                            borderColor: 'black',
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                      >
                        Оформить заказ
                      </Button>
                    </div>
                  </Card>
                </Box>
              </Grid>
            </Grid>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ marginLeft: '650px' }}
            >
              Товары со скидкой
            </Typography>
            <div style={{ margin: '50px', width: '50%', marginLeft: '400px' }}>
              <CarouselItem same={sale} />
            </div>
          </>
        ) : (
          <Grid
            container
            direction="column"
            sx={{
              padding: '50px',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <Typography variant="h6">Ваша корзина пуста</Typography>
          </Grid>
        )
      ) : (
        <Grid
          container
          direction="column"
          sx={{
            padding: '50px',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <Typography variant="h6">Войти чтобы увидеть корзину</Typography>

          <Button
            variant="outlined"
            sx={{
              fontSize: '12px',
              color: 'black',
              borderColor: 'black',
              marginTop: '10px',
              marginRight: 1,
              '&:hover': {
                borderColor: 'black',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
            onClick={handleOpen}
          >
            Войти
          </Button>

          <Modal
            open={open}
            onClose={handleClose}
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
              <RegistrationForm setOpen={setOpen} setLoginForm={setLoginForm} />
            )}
          </Modal>
        </Grid>
      )}
      <Order
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        handleOrder={handleOrder}
      />
    </>
  );
}

export default Cart;
