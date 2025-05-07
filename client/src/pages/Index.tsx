import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import MuiLink from "@mui/material/Link";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
} from "@mui/material";
import Price from "../components/OneCardProduct/Price";
import { Link } from "react-router-dom";
import api from "../services/api-instance";

function Index() {
  const [products, setProducts] = useState<any[]>([]);

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<"f" | "m" | "all">(
    "all"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const parseImages = (imageString: string): string[] => {
    try {
      const cleanedString = imageString
        .replace(/[{}"]/g, "")
        .split(",")
        .map((img: string) => img.trim());
      return cleanedString.length
        ? cleanedString.map((img) => `http://localhost:3000${img}`)
        : [];
    } catch (err) {
      console.error("Ошибка при парсинге изображения:", err);
      return [];
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get(`http://localhost:3000/?page=1&limit=18`);

      const productsWithImages = response.data.rows.map((product: any) => {
        const images = product.image ? parseImages(product.image) : [];
        return { ...product, images };
      });

      setProducts(productsWithImages);
      setAllProducts(productsWithImages);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ошибка в getProd");
    } finally {
      setLoading(false);
    }
  };

  let settings = {
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <Box
      variant="main"
      bgcolor="#f9f9f9"
      minHeight="100vh"
      p={3}
      sx={{ width: "auto", margin: "0 auto" }}
    >
      <Box variant="section" mb={3} sx={{ margin: "0 auto" }}>
        <Box display="flex" flexDirection="row" gap={3}>
          <Box sx={{ width: "60%" }}>
            <Slider {...settings}>
              <Box>
                <MuiLink component={Link} to="/home">
                  <Card>
                    <CardMedia
                      component="img"
                      height="500px"
                      width="600px"
                      image="/10.jpg"
                      alt="Armani"
                    />
                  </Card>
                </MuiLink>
              </Box>
              <Box>
                <Link to="/home">
                  <Card>
                    <CardMedia
                      component="img"
                      height="500px"
                      width="600px"
                      image="/3.jpg"
                      alt="Promo 1"
                    />
                  </Card>
                </Link>
              </Box>
              <Box>
                <Link to="/home">
                  <Card>
                    <CardMedia
                      component="img"
                      height="500px"
                      width="600px"
                      image="/5.jpg"
                      alt="Promo 2"
                    />
                  </Card>
                </Link>
              </Box>
            </Slider>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Card sx={{ maxWidth: 300, minWidth: 300, maxHeight: 550 }}>
              <MuiLink component={Link} to="/home">
                <CardMedia
                  component="img"
                  height="400"
                  image="/8.jpg"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Innamore
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="body1"
                    component="div"
                    sx={{ color: "GrayText" }}
                  >
                    Весенняя колекция по скидкой 50%
                  </Typography>
                </CardContent>
              </MuiLink>
            </Card>

            <Card sx={{ maxWidth: 300, minWidth: 300, maxHeight: 550 }}>
              <MuiLink component={Link} to="/home">
                <CardMedia
                  component="img"
                  height="400"
                  image="/9.jpg"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Самое время купить
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="body1"
                    component="div"
                    sx={{ color: "GrayText" }}
                  >
                    Закажите сейчас со скидкой 30%
                  </Typography>
                </CardContent>
              </MuiLink>
            </Card>
          </Box>
        </Box>
      </Box>

      <Typography variant="h5" sx={{ marginBottom: 3 }}>
        Ваша подборка на сегодня
      </Typography>

      <Box flex={1}>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && products.length > 0 && (
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(220px, 1fr))"
            gap={2}
          >
            {products.map((product) => (
              <Box sx={{ position: "relative" }} key={product.id}>
                <Link
                  to={`/product/${product.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card>
                    <CardMedia
                      component="img"
                      image={
                        product.images.length > 0
                          ? product.images[0]
                          : "/placeholder.png"
                      }
                      alt={product.title}
                      sx={{ height: 200, objectFit: "cover" }}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" noWrap>
                        {product.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {product.description}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold" mt={1}>
                        <Price product={product} />
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Link to="/home">
        <Card sx={{ m: "50px 0" }}>
          <CardMedia
            component="img"
            height="100%"
            width="100%"
            image="/7.jpg"
            alt="Armani"
          />
        </Card>
      </Link>

      <Typography variant="h5">Топ скидки!</Typography>

      <Box flex={1}>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && products.length > 0 && (
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(220px, 1fr))"
            gap={2}
          >
            {products.map((product) => (
              <Box sx={{ position: "relative" }} key={product.id}>
                <Link
                  to={`/product/${product.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card>
                    <CardMedia
                      component="img"
                      image={
                        product.images.length > 0
                          ? product.images[0]
                          : "/placeholder.png"
                      }
                      alt={product.title}
                      sx={{ height: 200, objectFit: "cover" }}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" noWrap>
                        {product.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {product.description}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold" mt={1}>
                        <Price product={product} />
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Link to="/home">
        <Card sx={{ m: "50px 0" }}>
          <CardMedia
            component="img"
            height="100%"
            width="100%"
            image="/12.jpg"
            alt="Armani"
          />
        </Card>
      </Link>
    </Box>
  );
}

export default Index;
