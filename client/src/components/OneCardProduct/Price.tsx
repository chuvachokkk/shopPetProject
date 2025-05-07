import { Stack, Typography } from '@mui/material';
import { Product } from './OneCardProduct';

function Price({ product }: { product: Product }) {
  return (
    <Stack spacing={1} sx={{ marginBottom: '20px', marginLeft: '5px' }}>
      <Typography variant="body1" component="span" sx={{ fontSize: '16px' }}>
        {product.discount > 0 ? (
          <>
            <Typography
              component="span"
              sx={{ textDecoration: 'line-through', marginRight: '8px' }}
            >
              {product.price} ₽
            </Typography>
            <Typography
              component="span"
              sx={{ color: 'red', fontWeight: 'bold', marginRight: '8px' }}
            >
              {Number(product.price) -
                Math.floor(Number(product.price) * (product.discount / 100))}{' '}
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
              -{product.discount}%
            </Typography>
          </>
        ) : (
          `${product.price} ₽`
        )}
      </Typography>
    </Stack>
  );
}


export default Price;
