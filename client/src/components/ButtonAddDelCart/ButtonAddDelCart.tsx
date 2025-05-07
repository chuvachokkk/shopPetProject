import { Box, Button, Typography } from "@mui/material";

function ButtonAddDelCart({ delHandler,}) {
    return ( 
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
          onClick={() => delHandler(cart.find(el=>el.productId == product.id ) as CartItem)}
        >
          -
        </Button>
        <Typography
          sx={{
            mx: 2,
            fontSize: '14px',
          }}
        >
          {cart.find((el: Cart) => el.productId === product.id && el.size === size)?.count || 0}
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
     );
}

export default ButtonAddDelCart;