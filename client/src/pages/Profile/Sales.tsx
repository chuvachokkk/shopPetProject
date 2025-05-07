import React, { useEffect, useState } from "react";
//
import api from "../../services/api-instance";
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { Link } from "react-router-dom";
import Price from "../../components/OneCardProduct/Price";

function Sales() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
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

      const response = await api.get(
        `http://localhost:3000/?sortBy=discount&type=woman&discount=0`
      );

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

  return (
    <Box
      sx={{
        pl: "150px",
        pr: "75px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
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
  );
}

export default Sales;
