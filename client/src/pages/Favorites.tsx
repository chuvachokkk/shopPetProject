import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import { useAppSelector } from "../components/redux/hook";
import { Link } from "react-router-dom";
import AddToFavoriteIcon from "../components/AddToFavoriteIcon/AddToFavoriteIcon";
import React from "react";
//TODO 1. Создаем таблицу favorites и привязываем ее к user. favorites -> userId, productId
//TODO 2. Сделать кнопку по которой товар добавляется в таблицу избранное (id 1, userId 1, productId 2)
//TODO 3. Сделать стейт для сбора всех favorites по user. => {обьект с избранными товарами}
//TODO 4. Создать ручку чтобы получить все избранные товары по юзеру.

const parseImages = (imageString: string): string[] => {
  let images: string[] = [];
  try {
    const cleanedString = imageString
      .replace(/[{}"]/g, "")
      .split(",")
      .map((img: string) => img.trim());

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

export default function Favorites() {
  const { favorite, loading } = useAppSelector((store) => store.FavoriteSlice);

  const renderFavorites = (items) => {
    if (items === null) return;

    return items.map((item) => {
      const parsedImages = parseImages(item.Product.image);
      const imageUrl = parsedImages.length > 0 ? parsedImages[0] : "";

      return (
        <React.Fragment key={item.id}>
          <Box sx={{ position: "relative", minHeight: "100vh" }}>
            <AddToFavoriteIcon productId={item.productId} isFavorite={true} />
            <Link
              to={`/product/${item.productId}`}
              key={item.Product.id}
              style={{ textDecoration: "none" }}
            >
              <Card>
                <CardMedia
                  component="img"
                  image={imageUrl}
                  alt={item.Product.title}
                  sx={{ height: 200, objectFit: "cover" }}
                />

                <CardContent>
                  <Typography variant="h6" fontWeight="bold" noWrap>
                    {item.Product.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {item.Product.description}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold" mt={1}>
                    {item.Product.price} ₽
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Box>
        </React.Fragment>
      );
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f9f9f9",
        padding: "40px 0",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ marginBottom: 3 }}>
          Избранное
        </Typography>

        <Box>
          {favorite?.length !== 0 ? (
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fill, minmax(220px, 1fr))"
              gap={2}
            >
              {loading ? null : renderFavorites(favorite)}
            </Box>
          ) : (
            <>
              <Divider sx={{ marginBottom: 2 }} />
              <Typography variant="h5">Нет избранных товаров</Typography>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}
