import {
  Box,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import MuiLink from "@mui/material/Link";

export default function ProfileLayout() {
  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        padding: "40px 0",
        backgroundColor: "#f9f9f9",
      }}
    >
      <MenuList sx={{ width: 320 }}>
        <MuiLink component={Link} to="orders">
          <MenuItem sx={{ padding: "none", margin: "none" }}>
            <ListItemText inset>Заказы</ListItemText>
          </MenuItem>
        </MuiLink>
        <MuiLink component={Link} to="sale">
          <MenuItem>
            <ListItemText inset>Акции</ListItemText>
          </MenuItem>
        </MuiLink>
        <MuiLink component={Link} to="data">
          <MenuItem>
            <ListItemText inset>Мои данные</ListItemText>
          </MenuItem>
        </MuiLink>

        <MuiLink component={Link} to="promo">
          <MenuItem>
            <ListItemText inset>Промокоды</ListItemText>
          </MenuItem>
        </MuiLink>
      </MenuList>

      <Box display="flex">
        <Outlet />
      </Box>
    </Box>
  );
}
