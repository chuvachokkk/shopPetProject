import DeleteIcon from '@mui/icons-material/Delete';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import {
  SetStateAction,
  SyntheticEvent,
  useState,
  Dispatch,
  ChangeEvent,
  FormEvent,
  useEffect,
} from 'react';
import {
  Button,
  FormControl,
  Rating,
  Stack,
  TextField,
  Typography,
  Modal,
  Card,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Product, Review } from './OneCardProduct';
import $api from '../../services/api-instance';
import { User } from '../../types/userTypes';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

type Input = {
  rating: number;
  name: string;
  review: string;
};

function TableProduct({
  product,
  user,
  reviews,
  setReviews,
  setProduct,
  handleOpenLogin,
}: {
  product: Product;
  user: User | null;
  reviews: Review[];
  setReviews: Dispatch<SetStateAction<Review[]>>;
  setProduct: Dispatch<SetStateAction<Product | null>>;
  handleOpenLogin: () => void;
}) {
  const initial = {
    rating: 0,
    review: '',
    name: '',
  };

  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState<Input>(initial);
  const [showAll, setShowAll] = useState(false);
  const [openT, setOpenT] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseT = () => setOpenT(false);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const Onchange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs((pre: Input) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  async function handleSubmit(e: FormEvent) {
    try {
      e.preventDefault();
      if (inputs.rating === 0) {
        setOpenT(true);
      } else {
        const { data } = await $api.post(`/api/review/`, {
          inputs,
          user,
          product,
        });
        setReviews((pre) => [...pre, data.reviewResult]);

        setProduct((pre: Product | null) => {
          if (pre) {
            pre.rating = data.newRate;
          }
          return pre;
        });
        handleCloseT();
        handleClose();
        setInputs(initial);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function reviewDelete(id:number) {
    try {
      const {data}=await $api.delete(`/api/review/del/${id}`)
      setReviews((pre)=> pre.filter(item=> item.id !== data))
    } catch (error) {
      console.log(error)
    } 
  }

  const entries = Object.entries(product.compaund);
  const displayedEntries = showAll ? entries : entries.slice(0, 2);

  function tableHandler() {
    setShowAll((pre) => {
      if (pre) {
        window.scrollTo({ top: 100, left: 0, behavior: 'smooth' });
      }

      return !pre;
    });
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='basic tabs example'
          sx={{
            '& .MuiTab-root': {
              color: 'black',
              '&.Mui-selected': {
                color: 'black',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'black',
            },
          }}
        >
          <Tab label='О Товаре' {...a11yProps(0)} />
          <Tab
            label={`Отзывы ${reviews.length === 0 ? '' : reviews.length}`}
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Typography
          variant='body1'
          sx={{ color: 'text.secondary', marginBottom: 3 }}
        >
          {product.description}
        </Typography>

        <TableContainer component={Paper} sx={{ width: 500 }}>
          <Table sx={{ minWidth: 400 }} aria-label='simple table'>
            <TableBody>
              {displayedEntries.map(([key, value]) => (
                <TableRow
                  key={key}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component='th' scope='row'>
                    {key}
                  </TableCell>
                  <TableCell align='right'>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={tableHandler} sx={{ color: 'black' }}>
            {showAll ? 'Скрыть' : 'Показать все'}
          </Button>
        </TableContainer>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {user ? (
          <Button
            onClick={handleOpen}
            variant='outlined'
            sx={{
              fontSize: '12px',
              color: 'black',
              borderColor: 'black',
              marginRight: 1,
              marginBottom: '50px',
              '&:hover': {
                borderColor: 'black',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Написать отзыв
          </Button>
        ) : (
          <Button
            variant='outlined'
            onClick={handleOpenLogin}
            sx={{
              fontSize: '12px',
              color: 'black',
              borderColor: 'black',
              marginRight: 1,
              marginBottom: '50px',
              '&:hover': {
                borderColor: 'black',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Войти и написать отзыв
          </Button>
        )}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <FormControl sx={{ gap: 2, width: '400px' }}>
              <Stack spacing={1}>
                <Tooltip
                  open={openT}
                  onClose={handleCloseT}
                  title='Выберите рейтинг'
                >
                  <Rating
                    name='rating'
                    defaultValue={0}
                    precision={0.1}
                    size='large'
                    value={inputs.rating}
                    sx={{ color: 'black' }}
                    onChange={(
                      event: SyntheticEvent<Element, Event>,
                      newValue
                    ) => {
                      setInputs((prev: Input) => ({
                        ...prev,
                        rating: newValue || 0,
                      }));
                    }}
                  />
                </Tooltip>
              </Stack>

              <TextField
                id='review'
                name='name'
                label='Ввелите имя'
                variant='outlined'
                type='text'
                value={inputs.name}
                onChange={Onchange}
              />
              <TextField
                id='review'
                name='review'
                label='Написать отзыв'
                variant='outlined'
                type='text'
                value={inputs.review}
                onChange={Onchange}
              />

              <Button
                variant='outlined'
                fullWidth
                sx={{
                  color: 'black',
                  borderColor: 'black',
                  marginRight: 2,
                  marginBottom: 2,
                  '&:hover': {
                    borderColor: 'black',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
                onClick={handleSubmit}
              >
                Опубликовать
              </Button>
            </FormControl>
          </Box>
        </Modal>
        <Grid container spacing={2} direction='column'>
          {reviews.length > 0 ? (
            <>
              {reviews?.map((el) => (
                <Grid key={el.id} container spacing={2}>
                  <Grid size={2}>
                    <Typography gutterBottom variant='h6' component='div'>
                      {el.name}
                    </Typography>
                  </Grid>
                  <Grid size={4} sx={{ marginLeft: '50px' }}>
                    <Card sx={{ minWidth: 275 }}>
                      <Rating
                        name='half-rating-read'
                        value={el.rating}
                        precision={0.1}
                        readOnly
                        sx={{ color: 'black' }}
                      />
                      <Typography
                        variant='body1'
                        sx={{
                          color: 'text.secondary',
                          marginLeft: '5px',
                          marginBottom: '40px',
                          marginRight: '5px',
                        }}
                      >
                        {el.review}
                      </Typography>
                      {user?.role && 
                      <IconButton aria-label='delete'>
                        <DeleteIcon  onClick={()=>reviewDelete(el.id)}/>
                      </IconButton>
                      }
                    </Card>
                  </Grid>
                </Grid>
              ))}
            </>
          ) : (
            <Typography
              variant='body1'
              sx={{
                color: 'text.secondary',
                marginBottom: '50px',
              }}
            >
              Отзывов пока нет
            </Typography>
          )}
        </Grid>
      </CustomTabPanel>
    </Box>
  );
}

export default TableProduct;
