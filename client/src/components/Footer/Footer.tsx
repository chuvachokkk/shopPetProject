import { useState } from "react";
import { Button, Box, Container, Link, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import TelegramIcon from "@mui/icons-material/Telegram";
import logo from "../logo/logo.webp";
import Chat from "../Chat/Chat";

const teamMembers = [
  { name: "Дима", telegram: "https://t.me/Frukt0za" },
  { name: "Андрей", telegram: "https://t.me/Andrebabich" },
  { name: "Иван", telegram: "https://t.me/pervyh_ivan" },
];

const Footer = () => {
  const [openChat, setOpenChat] = useState(false);

  const handleChatToggle = () => {
    setOpenChat(!openChat);
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f5f5f5",
        padding: "40px 0",
        borderTop: "1px solid #ddd",
      }}
    >
      <Container maxWidth="lg">
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid xs={4} sx={{ paddingRight: 2 }}>
            <Grid container spacing={1} direction="column">
              {teamMembers.map((member) => (
                <Grid key={member.name}>
                  <Link
                    href={member.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      color: "inherit",
                      "&:hover": { color: "#0088cc" },
                    }}
                  >
                    <TelegramIcon sx={{ fontSize: 32, marginRight: 1 }} />
                    <Typography variant="body1">{member.name}</Typography>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid xs={4} textAlign="center" sx={{ padding: "0 20px" }}>
            <Button
              variant="contained"
              color="default"
              onClick={handleChatToggle}
              sx={{
                backgroundColor: "#1c1c1c",
                color: "white",
                "&:hover": {
                  backgroundColor: "#333",
                  color: "white",
                },
              }}
            >
              Обратная связь
            </Button>
          </Grid>
          <Grid xs={4} textAlign="right" sx={{ paddingLeft: 2 }}>
            <img src="/denis.png" alt="Логотип" style={{ width: "100px" }} />
          </Grid>
        </Grid>
      </Container>
      {openChat && <Chat onClose={handleChatToggle} />}
    </Box>
  );
};

export default Footer;
