import { useState } from 'react';
import api from '../../services/api-instance';
import { TextField, Button, Typography, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TelegramIcon from '@mui/icons-material/Telegram';

const Chat = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    contacts: '',
    problemDescription: '',
  });

  const [status, setStatus] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/chat/send-form', formData);
      if (response.data.success) {
        setFormSubmitted(true);
        setTimeout(() => {
          setFormSubmitted(false); // Скрыть галочку через 1 секунду
          onClose(); // Закрыть форму
        }, 1000);
      }
    } catch (error) {
      setStatus('Ошибка при отправке формы');
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Затемненный фон
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          width: '400px',
          backgroundColor: '#f0f0f1',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(167, 167, 167, 0.15)',
        }}
      >
        <Typography variant="h6" align="center" mb={2} color="black">
          Заполните форму
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Ваше имя"
            variant="outlined"
            fullWidth
            margin="normal"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            size="small"
            sx={{ backgroundColor: 'white' }}
          />
          <TextField
            label="Контакты"
            variant="outlined"
            fullWidth
            margin="normal"
            name="contacts"
            value={formData.contacts}
            onChange={handleChange}
            required
            size="small"
            sx={{ backgroundColor: 'white' }}
          />
          <TextField
            label="Опишите проблему"
            variant="outlined"
            fullWidth
            margin="normal"
            name="problemDescription"
            value={formData.problemDescription}
            onChange={handleChange}
            required
            multiline
            rows={3}
            size="small"
            sx={{ backgroundColor: 'white' }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ backgroundColor: '#1c1c1c', color: 'white' }}
          >
           <TelegramIcon sx={{ fontSize: 32, marginRight: 1 }} />
          </Button>
        </form>
        <Typography
          variant="body1"
          color={
            status === 'Форма успешно отправлена'
              ? 'success.main'
              : 'error.main'
          }
        >
          {status}
        </Typography>
        <Button
          variant="contained"
          color="error"
          sx={{ marginTop: 1 }}
          onClick={onClose}
          fullWidth
        >
          Закрыть
        </Button>

        {formSubmitted && (
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1500,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 50, color: 'green' }} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chat;
