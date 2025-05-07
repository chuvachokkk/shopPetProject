import { ChangeEvent, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
} from '@mui/material';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export type Init = {
  name: string;
  phone: string;
};

interface Orderprops {
  open: boolean;
  onClose: () => void;
  handleOrder: (inputs: Init) => void;
}
function Order({ open, onClose, handleOrder }: Orderprops) {
  const init = {
    name: '',
    phone: '',
  };

  const [inputs, setInputs] = useState<Init>(init);

  const Onchange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs((pre: Init) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    handleOrder(inputs);
    onClose();
    setInputs(init);
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant='h6' component='h2' gutterBottom>
          Оформление заказа
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            id='order'
            name='name'
            label='Ввелите имя'
            variant='outlined'
            type='text'
            value={inputs.name}
            onChange={Onchange}
            sx={{ mb: 2 }}
          />
          <TextField
            id='phone'
            name='phone'
            label='введите телефон'
            variant='outlined'
            type='text'
            value={inputs.phone}
            onChange={Onchange}
            sx={{ mb: 2 }}
          />
        </FormControl>
        <Typography
          id='modal-modal-title'
          variant='h5'
          component='h2'
          sx={{ mb: 2 }}
        >
          Менеджер свяжется с вами
        </Typography>
        <Button
          variant='outlined'
          fullWidth
          sx={{
            color: 'black',
            borderColor: 'black',
            '&:hover': {
              borderColor: 'black',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
          onClick={handleSubmit}
        >
          Заказать
        </Button>
      </Box>
    </Modal>
  );
}

export default Order;
