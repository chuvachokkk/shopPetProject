import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Stack,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import api from '../services/api-instance';
import AddToFavoriteIcon from '../components/AddToFavoriteIcon/AddToFavoriteIcon';
import useFavorite from '../hooks/useFavorite';
import Price from '../components/OneCardProduct/Price';

const HomePage = () => {
  const { favorite } = useFavorite();

  const [products, setProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'f' | 'm' | 'all'>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const parseImages = (imageString: string): string[] => {
    try {
      const cleanedString = imageString.replace(/[{}"]/g, '').split(',').map((img: string) => img.trim());
      return cleanedString.length ? cleanedString.map((img) => `http://localhost:3000${img}`) : [];
    } catch (err) {
      console.error('Ошибка при парсинге изображения:', err);
      return [];
    }
  };

  const getProducts = async () => {
    try {
      setLoading(true);
      const endpoint = selectedCategory === 'all' ? '/type/all' : `/type/${selectedCategory}`;
      const response = await api.get(endpoint);

      const productsWithImages = response.data.data.map((product: any) => {
        const images = product.image ? parseImages(product.image) : [];
        return { ...product, images };
      });

      setProducts(productsWithImages);
      setAllProducts(productsWithImages);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка в getProd');
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => prev.includes(categoryId)
      ? prev.filter((c) => c !== categoryId)
      : [...prev, categoryId]);
  };

  const handleSearch = () => {
    let filteredProducts = allProducts;

    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedCategories.includes(product.categoryId.toString())
      );
    }

    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setProducts(filteredProducts);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setProducts(allProducts);
  };

  useEffect(() => {
    getProducts();
    getCategories();
  }, [selectedCategory]);

  useEffect(() => {
    handleSearch(); // Перезапускаем поиск при изменении категорий и запроса
  }, [selectedCategories, allProducts]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://embed.tawk.to/67a08afb3a8427326078fd6c/1ij5htq4b';
    script.async = true;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Box p={3} bgcolor='#f9f9f9' minHeight='100vh'>
      <Box display='flex' gap={2} mb={3} alignItems='center'>
        <Button fullWidth variant={selectedCategory === 'all' ? 'contained' : 'outlined'} onClick={() => setSelectedCategory('all')} sx={{ width: '150px' }}>
          Все товары
        </Button>
        <Button fullWidth variant={selectedCategory === 'f' ? 'contained' : 'outlined'} onClick={() => setSelectedCategory('f')} sx={{ width: '150px' }}>
          Женщинам
        </Button>
        <Button fullWidth variant={selectedCategory === 'm' ? 'contained' : 'outlined'} onClick={() => setSelectedCategory('m')} sx={{ width: '150px' }}>
          Мужчинам
        </Button>
        <Stack direction='row' spacing={1} sx={{ flexGrow: 1 }}>
          <TextField fullWidth variant='outlined' placeholder='Поиск товаров...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <IconButton color='primary' onClick={handleSearch} sx={{ height: '100%' }}>
            <SearchIcon />
          </IconButton>
        </Stack>
        {searchQuery && (
          <Button onClick={handleClearSearch} sx={{ marginLeft: 1 }}>
            Очистить
          </Button>
        )}
      </Box>

      <Box display='flex' gap={2}>
        <Card sx={{ width: 250, p: 2 }}>
          <Typography variant='h6' fontWeight='bold' mb={2}>Фильтры</Typography>
          <Box display='flex' flexDirection='column' gap={1}>
            {categories.map((category) => (
              <Button
                key={category.id}
                fullWidth
                variant={selectedCategories.includes(category.id.toString()) ? 'contained' : 'outlined'}
                onClick={() => handleCategoryChange(category.id.toString())}
              >
                {category.category}
              </Button>
            ))}
          </Box>
        </Card>

        <Box flex={1}>
          {loading && <CircularProgress />}
          {error && <Typography color='error'>{error}</Typography>}
          {!loading && !error && products.length > 0 && (
            <Box display='grid' gridTemplateColumns='repeat(auto-fill, minmax(220px, 1fr))' gap={2}>
              {products.map((product) => (
                <Box sx={{ position: 'relative' }} key={product.id}>
                  <AddToFavoriteIcon productId={product.id} isFavorite={favorite?.some((item) => item.productId === product.id) || false} />
                  <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                    <Card>
                      <CardMedia component='img' image={product.images.length > 0 ? product.images[0] : '/placeholder.png'} alt={product.title} sx={{ height: 200, objectFit: 'cover' }} />
                      <CardContent>
                        <Typography variant='h6' fontWeight='bold' noWrap>{product.title}</Typography>
                        <Typography variant='body2' color='textSecondary' noWrap>{product.description}</Typography>
                        <Typography variant='subtitle1' fontWeight='bold' mt={1}><Price product={product} /></Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
