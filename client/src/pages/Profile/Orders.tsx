import React, { useEffect, useState } from "react";
import $api from "../../services/api-instance";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import OneCardCart from "../../components/Cart/OneCardCart";
import { Image } from "@mui/icons-material";
import Price from "../../components/OneCardProduct/Price";
import { useAppSelector } from "../../components/redux/hook";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAppSelector((state) => state.UserSlice);
  const navigate = useNavigate();
  const parseImages = (imageString: string): string[] => {
    let images: string[] = [];
    try {
      const cleanedString = imageString
        .replace(/[{}"]/g, "") // убираем ненужные символы
        .split(",") // разделяем по запятой
        .map((img: string) => img.trim()); // очищаем пробелы

      images = cleanedString;

      if (images.length === 0) {
        images = [];
      }
    } catch (err) {
      console.error("Ошибка при парсинге изображения:", err);
    }

    return images.length
      ? images.map((img) => `http://localhost:3000${img}`)
      : [];
  };

  useEffect(() => {
    (async function () {
      const { data } = await $api.get("api/user/");

      setOrders(data);
    })();
  }, [user]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="h5" mb={3}>
        Ваши заказы
      </Typography>

      <Box sx={{ display: "flex", gap: 3 }}>
        {orders.map((item, index) => {
          const date = new Date(item.createdAt);
          const formatter = new Intl.DateTimeFormat("ru-RU", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Moscow",
          });

          const data = JSON.parse(item.data);
          const images = parseImages(data[0].Product.image);

          return (
            <Box
              key={item.id}
              sx={{
                p: 1,
                display: "flex",
                border: "1px solid rgb(217, 213, 213)",
              }}
            >
              <Card sx={{ p: 2 }}>
                <Typography>Заказ #{index + 1}</Typography>
                <Typography>Дата заказа: {formatter.format(date)}</Typography>
                <Typography>
                  Указанный телефон при заказе: {item.phone}
                </Typography>
                <Typography
                  sx={{ pb: 1, borderBottom: "1px solid rgb(217, 213, 213)" }}
                >
                  Имя при заказе: {item.name}
                </Typography>

                <Card
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                      width: "300px",
                      height: "100px",
                    }}
                    onClick={() => navigate(`/product/${data[0].productId}`)}
                  >
                    {images.length > 0 ? (
                      <img
                        src={images[0]}
                        alt={data[0].Product.title}
                        style={{
                          width: "100px",
                          height: "100px",
                          border: "bold",
                          marginRight: "15px",
                        }}
                      />
                    ) : (
                      <Typography variant="body2">
                        Изображение недоступно
                      </Typography>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "column",
                        alignItems: "start",
                      }}
                    >
                      <p>{data[0].Product.title}</p>
                      <p>Размер {data[0].size}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "end" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "column",
                        alignItems: "end",
                      }}
                    >
                      <Price product={data[0].Product} />
                    </div>
                  </div>
                </Card>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default Orders;
