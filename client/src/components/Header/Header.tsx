import { FC, useEffect, useState } from "react";
import MuiLink from "@mui/material/Link";
import LoginForm from "../LoginForm/LoginForm";
import { setAccessToken } from "../../services/api-instance";

import CheckroomOutlinedIcon from "@mui/icons-material/CheckroomOutlined";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";

import { Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Modal from "@mui/material/Modal";

import RegistrationForm from "../RegistrationForm/RegistrationForm";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { signoutUser } from "../redux/thunk/userAction";
import useCartCheck from "../../hooks/useCartCheck";
import useFavorite from "../../hooks/useFavorite";
import useAuthCheck from "../../hooks/useAuthCheck";
import { clearCart } from "../redux/slices/cartSlice";
import { clearFavorites } from "../redux/slices/favoriteSlice";

const Header: FC = () => {
  useFavorite();
  useAuthCheck();
  useCartCheck();
  const [loginForm, setLoginForm] = useState(true);
  const { user, loading } = useAppSelector((store) => store.UserSlice);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const { cart } = useAppSelector((store) => store.CartSlice);

  const totalItems = cart.reduce((acc, item) => acc + item.count, 0);

  useEffect(() => {
    setCartCount(totalItems);
  }, [cart]);

  const dispatch = useAppDispatch();
  const handleSignOut = () => {
    dispatch(signoutUser());
    dispatch(clearCart());
    dispatch(clearFavorites());
    setAccessToken("");
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, display: "flex" }}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#f9f9f9",
            boxShadow: "none",
            padding: "20px 0 0 0",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex" }}>
              <MuiLink
                component={Link}
                to="/"
                sx={{ marginRight: 1, display: "flex", gap: 1 }}
              >
                <CottageOutlinedIcon />
                <Typography>Главная</Typography>
              </MuiLink>
              <MuiLink
                component={Link}
                to="/home"
                sx={{ display: "flex", marginRight: 1, gap: 1 }}
              >
                <CheckroomOutlinedIcon />
                <Typography>Каталог</Typography>
              </MuiLink>
            </Box>

            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
            >
              <MuiLink component={Link} to="/home">
                <img
                  src="/fabric.png"
                  alt="Смотря Какой Fabric"
                  height="35px"
                />
              </MuiLink>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              {user ? (
                <>
                  <Button
                    variant="text"
                    sx={{
                      fontSize: "12px",
                      color: "black",
                      borderColor: "transparent",
                      "&:hover": {
                        borderColor: "none",
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                    onClick={handleSignOut}
                  >
                    Выйти
                  </Button>
                  <Button
                    variant="text"
                    sx={{
                      fontSize: "12px",
                      color: "black",
                      borderColor: "transparent",
                      "&:hover": {
                        borderColor: "none",
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                    onClick={() => navigate("profile")}
                  >
                    Профиль
                  </Button>
                  <Button
                    variant="text"
                    sx={{
                      fontSize: "12px",
                      color: "black",
                      borderColor: "transparent",
                      marginRight: 1,
                      "&:hover": {
                        borderColor: "none",
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                    onClick={() => navigate("favorites")}
                  >
                    Избранное
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  sx={{
                    fontSize: "12px",
                    color: "black",
                    borderColor: "black",
                    marginRight: 1,
                    "&:hover": {
                      borderColor: "black",
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                  onClick={handleOpen}
                >
                  Войти
                </Button>
              )}
              <Link to="/cart">
                <IconButton size="small" sx={{ color: "black" }}>
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartOutlinedIcon />
                  </Badge>
                </IconButton>
              </Link>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        slotProps={{
          backdrop: {
            style: {
              backgroundColor: "rgba(0, 0, 0, 0.9)",
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
    </>
  );
};

export default Header;
