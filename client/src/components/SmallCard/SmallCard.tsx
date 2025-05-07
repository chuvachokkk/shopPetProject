import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from '@mui/material';
import { Product } from '../OneCardProduct/OneCardProduct';
import { useNavigate } from 'react-router-dom';

function parseImages(imageString) {
  let images = [];
  try {
    const cleanedString = imageString
      .replace(/[{}"]/g, '')
      .split(',')
      .map((img) => img.trim());
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
}

function SmallCard({ el }: { el: Product }) {
  const navigate = useNavigate();
  const images = parseImages(el.image);
  const imageUrl = images[0];

  return (
    <Card
      style={{
        margin: '10px',
        width: '220px',
        height: '260px',
        padding: '2px',
      }}
    >
      <CardMedia
        component="img"
        image={imageUrl}
        alt={el.title}
        sx={{
          height: 140,
          objectFit: 'contain',
          objectPosition: 'center',
        }}
      />
      <CardContent>
        <Typography variant="h6" fontWeight="bold" noWrap>
          {el.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" noWrap>
          {el.description.slice(0, 10) + '...'}
        </Typography>
        <Stack spacing={1}>
          <Typography
            variant="body1"
            component="span"
            sx={{ fontSize: '16px' }}
          >
            {el.discount > 0 ? (
              <>
                <Typography
                  component="span"
                  sx={{ textDecoration: 'line-through', marginRight: '8px' }}
                >
                  {el.price} ₽
                </Typography>
                <Typography
                  component="span"
                  sx={{ color: 'red', fontWeight: 'bold', marginRight: '8px' }}
                >
                  {Number(el.price) -
                    Math.floor(Number(el.price) * (el.discount / 100))}{' '}
                  ₽
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  -{el.discount}%
                </Typography>
              </>
            ) : (
              <Typography component="span" sx={{ marginLeft: '10px' }}>
                {el.price} ₽
              </Typography>
            )}
          </Typography>
        </Stack>
        <Button onClick={() => navigate(`/product/${el.id}`)}>
          Посмотреть
        </Button>
      </CardContent>
    </Card>
  );
}

export default SmallCard;
