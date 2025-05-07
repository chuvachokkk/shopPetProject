import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  Card,
  Typography,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { PhotoCamera } from '@mui/icons-material';
import api from '../../services/api-instance';
import ProductCarousel from './ProductCarousel';

const Admin = () => {
  const [products, setProducts] = useState<unknown[]>([]);
  const [categories, setCategories] = useState<unknown[]>([]);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: 0,
    typeId: '',
    categoryId: '',
    images: [] as File[],
    compound: '',
    discount: 0,
  });
  const [editingProduct, setEditingProduct] = useState<unknown | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isAddProductVisible, setIsAddProductVisible] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isShifted, setIsShifted] = useState(false);
  const editFormRef = useRef<HTMLDivElement | null>(null);
  // const [questions, setQuestions] = useState([]);

  // Функция для разбора строки с изображениями, возвращающая массив строк
  const parseImages = (raw: string): string[] => {
    let images: string[] = [];
    try {
      // Пытаемся разобрать как JSON
      images = JSON.parse(raw);
    } catch (err) {
      // Если не удалось, используем ручной парсинг
      const trimmed = raw.trim().replace(/[{}"]/g, '');
      images = trimmed.split(',').map((s) => s.trim());
      images = images.filter((s) => s.length > 0);
    }
    // Добавляем базовый URL для каждого пути
    return images.length
      ? images.map((img) => `http://localhost:3000${img}`)
      : [];
  };

  // Загрузка товаров
  const getProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/product');
      const productsWithImages = response.data.data.map((product: any) => {
        let images: string[] = [];
        try {
          if (product.image) {
            images = parseImages(product.image);
          }
        } catch (e) {
          console.error('Ошибка обработки изображения:', e);
        }
        return { ...product, images };
      });
      setProducts(productsWithImages);
    } catch (error) {
      setError('Ошибка при загрузке товаров');
    } finally {
      setLoading(false);
    }
  };

  // Удаление товара
  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить товар?')) return;

    try {
      await api.delete(`/product/${productId}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
      setError('Ошибка при удалении товара');
    }
  };

  // Изменение выбранной категории (фильтр)
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Обработчик добавления нового товара
  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newProduct.title);
      formData.append('description', newProduct.description);
      formData.append('price', newProduct.price.toString());
      formData.append('categoryId', newProduct.categoryId.toString());
      formData.append('typeId', newProduct.typeId.toString());
      formData.append('discount', Math.floor(newProduct.discount).toString());

      // Генерация состава товара
      const compound = {
        'Состав, %': 'Шерсть - 70%, Полиэстер - 30%',
        'Материал подкладки, %': 'Полиэстер - 52%, Вискоза - 48%',
        Сезон: ['демисезон', 'зима', 'лето'][Math.floor(Math.random() * 3)],
        'Размер товара на модели': '36 EUR',
        Длина: '120 см (36 EUR)',
        'Длина рукава': '56 см (36 EUR)',
        'Параметры модели': '79-63-89',
        'Рост модели на фото': '174 см',
        Цвет: ['бежевый', 'черный', 'синий', 'красный', 'зеленый'][
          Math.floor(Math.random() * 5)
        ],
        Узор: ['однотонный', 'полоска', 'клетка'][
          Math.floor(Math.random() * 3)
        ],
        'Внешние карманы': Math.floor(Math.random() * 3), // 0, 1 или 2
        Застежка: ['пуговицы', 'молния', 'липучка'][
          Math.floor(Math.random() * 3)
        ],
        Капюшон: Math.random() > 0.5 ? 'да' : 'нет',
        Детали: ['пояс', 'ремень', 'меховая отделка'][
          Math.floor(Math.random() * 3)
        ],
        'Страна производства': 'Китай',
        Артикул: `RTLADU70${Math.floor(1000 + Math.random() * 9000)}`,
      };

      const serializedCompound = JSON.stringify(compound);
      formData.append('compaund', serializedCompound);

      newProduct.images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await api.post('/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Обработка ответа и обновление списка товаров
      if (!response || !response.data) {
        throw new Error(
          'Ответ от сервера отсутствует или имеет неверный формат'
        );
      }

      let formattedImages: string[] = [];
      if (response.data.image) {
        formattedImages = parseImages(response.data.image);
      }

      setProducts((prevProducts) => [
        { ...response.data, images: formattedImages },
        ...prevProducts,
      ]);

      setIsAddProductVisible(false);
      setNewProduct({
        title: '',
        description: '',
        price: 0,
        typeId: 1,
        categoryId: 1,
        images: [],
        compound: '',
        discount: 0, // Сбрасываем скидку
      });
    } catch (error: any) {
      console.error('Ошибка при добавлении товара:', error);
      setError('Ошибка при добавлении товара');
    }
  };

  // Обработчик редактирования товара
  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    scrollToEditForm();
  };

  const scrollToEditForm = () => {
    if (editFormRef.current) {
      editFormRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleToggleAddProduct = () => {
    setIsAddProductVisible((prev) => !prev);
    setIsShifted((prev) => !prev); // Сдвигаем карточки
  };

  // Обработчик обновления товара
  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const formData = new FormData();
      formData.append('title', editingProduct.title);
      formData.append('description', editingProduct.description);
      formData.append('price', editingProduct.price.toString());
      formData.append('categoryId', editingProduct.categoryId.toString());
      formData.append('typeId', editingProduct.typeId.toString());
      formData.append(
        'discount',
        Math.floor(editingProduct.discount).toString()
      );

      // Генерация состава (если есть)
      const serializedCompound = JSON.stringify(editingProduct.compaund);
      formData.append('compaund', serializedCompound);

      // Проверяем, если изображения не изменились, добавляем старые
      const currentImages = editingProduct.images.length
        ? editingProduct.images
        : [];

      // Добавляем старое изображение, если оно не было удалено
      if (currentImages.length > 0) {
        currentImages.forEach((image: any) => {
          // Если это строка (путь к изображению), передаем его
          if (typeof image === 'string') {
            formData.append('images', image);
          } else if (image instanceof File) {
            // Если это новый файл, передаем его
            formData.append('images', image);
          }
        });
      }

      const response = await api.put(
        `/product/${editingProduct.id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (response.data.success) {
        console.log('Товар обновлён:', response.data.data);
        await getProducts(); // Обновляем товары на клиенте
        setEditingProduct(null); // Закрываем форму редактирования
      } else {
        console.error('Ошибка при обновлении:', response.data.error);
      }
    } catch (error) {
      console.error('Ошибка при обновлении товара:', error);
    }
  };

  // Обработчик загрузки изображений через input (для редактирования)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 5);
      if (editingProduct) {
        setEditingProduct({
          ...editingProduct,
          images: [...editingProduct.images, ...newImages].slice(0, 5),
        });
      } else {
        setNewProduct({
          ...newProduct,
          images: [...newProduct.images, ...newImages].slice(0, 5),
        });
      }
    }
  };

  // Реализация drag-and-drop для формы добавления товара
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Ограничиваем общее количество файлов до 5
      const newImages = acceptedFiles.slice(0, 5 - newProduct.images.length);
      setNewProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    },
    [newProduct.images]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.data);
      } catch (error) {
        setError('Ошибка при загрузке категорий');
      }
    };

    getCategories();
  }, []); // getCategories вызывается только один раз при монтировании компонента

  useEffect(() => {
    const getFilteredProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/product');
        const productsWithImages = response.data.data.map((product: any) => {
          let images: string[] = [];
          try {
            if (product.image) {
              images = parseImages(product.image);
            }
          } catch (e) {
            console.error('Ошибка обработки изображения:', e);
          }
          return { ...product, images };
        });

        // Фильтрация по выбранным категориям
        if (selectedCategories.length > 0) {
          const filteredProducts = productsWithImages.filter((product) =>
            selectedCategories.includes(product.categoryId)
          );
          setProducts(filteredProducts);
        } else {
          setProducts(productsWithImages);
        }
      } catch (error) {
        setError('Ошибка при загрузке товаров');
      } finally {
        setLoading(false);
      }
    };

    getFilteredProducts();
  }, [selectedCategories]);

  useEffect(() => {
    if (editingProduct) {
      scrollToEditForm();
    }
  }, [editingProduct]);

  return (
    <Box p={3} bgcolor="#f9f9f9" minHeight="100vh" display="flex">
      {/* Фильтры */}
      <Card
        sx={{
          width: 250,
          p: 2,
          marginRight: 3,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Фильтры
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={
                selectedCategories.includes(category.id)
                  ? 'contained'
                  : 'outlined'
              }
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.category}
            </Button>
          ))}
        </Box>
      </Card>

      {/* Основной контент */}
      <Box flex={1}>
        <Button
          variant="contained"
          onClick={handleToggleAddProduct}
          sx={{ marginBottom: 2 }}
        >
          {isAddProductVisible ? 'Скрыть форму' : 'Добавить товар'}
        </Button>

        {/* Контейнер для форм и списка */}
        <Box display="flex" gap={3} alignItems="flex-start">
          {/* Группа форм */}
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Форма добавления */}
            {isAddProductVisible && (
              <Card sx={{ width: 350, p: 2, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h6" mb={2}>
                  Добавить новый товар
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="Название товара"
                  value={newProduct.title}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, title: e.target.value })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Описание"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Цена"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Пол"
                  select
                  value={newProduct.typeId || ''}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      typeId: Number(e.target.value),
                    })
                  }
                  sx={{ marginBottom: 2 }}
                >
                  <MenuItem value="">Выберите пол</MenuItem>
                  <MenuItem value={1}>Для женщин</MenuItem>
                  <MenuItem value={2}>Для мужчин</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  size="small"
                  label="Категория"
                  select
                  value={newProduct.categoryId || ''}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      categoryId: Number(e.target.value),
                    })
                  }
                  sx={{ marginBottom: 2 }}
                >
                  <MenuItem value="">Выберите категорию</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.category}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Скидка (%)"
                  value={newProduct.discount}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      discount: parseFloat(e.target.value),
                    })
                  }
                  sx={{ marginBottom: 2 }}
                />

                {/* <TextField
                  fullWidth
                  size="small"
                  label="Состав товара"
                  value={newProduct.compound || ''}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, compound: e.target.value })
                  }
                  sx={{ marginBottom: 2 }}
                /> */}
                <Box
                  {...getRootProps()}
                  sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    padding: 2,
                    textAlign: 'center',
                    marginBottom: 2,
                    background: isDragActive ? '#eee' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <Typography>Отпустите файлы здесь...</Typography>
                  ) : (
                    <Typography>
                      Перетащите изображения сюда или нажмите для выбора (макс.
                      5)
                    </Typography>
                  )}
                </Box>
                <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                  {newProduct.images.map((image, index) => (
                    <Box key={index} position="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Товар ${index + 1}`}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: 4,
                        }}
                      />
                      <Button
                        size="small"
                        color="error"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          minWidth: 30,
                          height: 30,
                        }}
                        onClick={() =>
                          setNewProduct({
                            ...newProduct,
                            images: newProduct.images.filter(
                              (_, i) => i !== index
                            ),
                          })
                        }
                      >
                        ×
                      </Button>
                    </Box>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  onClick={handleAddProduct}
                  sx={{ width: '100%', marginTop: 2 }}
                >
                  Добавить товар
                </Button>
              </Card>
            )}

            {/* Форма редактирования */}
            {editingProduct && (
              <Card
                ref={editFormRef} // Указываем реф для прокрутки
                sx={{ width: 350, p: 2, boxShadow: 3, borderRadius: 2 }}
              >
                <Typography variant="h6" mb={2}>
                  Редактировать товар
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="Название товара"
                  value={editingProduct.title}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      title: e.target.value,
                    })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Описание"
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Цена"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Пол"
                  select
                  value={editingProduct.typeId || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      typeId: Number(e.target.value),
                    })
                  }
                  sx={{ marginBottom: 2 }}
                >
                  <MenuItem value="">Выберите пол</MenuItem>
                  <MenuItem value={1}>Для женщин</MenuItem>
                  <MenuItem value={2}>Для мужчин</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  size="small"
                  label="Категория"
                  select
                  value={editingProduct.categoryId || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      categoryId: Number(e.target.value),
                    })
                  }
                  sx={{ marginBottom: 2 }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.category}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Скидка (%)"
                  value={editingProduct.discount || 0}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      discount: parseFloat(e.target.value),
                    })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <Box sx={{ marginBottom: 2 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="image-upload-edit"
                    multiple
                  />
                  <label htmlFor="image-upload-edit">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCamera />}
                    >
                      Загрузить изображения
                    </Button>
                  </label>
                  <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                    {editingProduct.images.map((image: any, index: number) => (
                      <Box key={index} position="relative">
                        <img
                          src={
                            typeof image === 'string'
                              ? image
                              : URL.createObjectURL(image)
                          }
                          alt={`Товар ${index + 1}`}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 4,
                          }}
                        />
                        <Button
                          size="small"
                          color="error"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            minWidth: 30,
                            height: 30,
                          }}
                          onClick={() =>
                            setEditingProduct({
                              ...editingProduct,
                              images: editingProduct.images.filter(
                                (_, i) => i !== index
                              ),
                            })
                          }
                        >
                          ❌
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  onClick={handleUpdateProduct}
                  sx={{ width: '100%' }}
                >
                  Обновить товар
                </Button>
              </Card>
            )}
          </Box>
          {/* Список товаров */}
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Список всех товаров
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Box display="flex" flexWrap="wrap" gap={3}>
                {products.map((product) => (
                  <Card
                    key={product.id}
                    sx={{
                      width: 200,
                      height: 500,
                      padding: 2,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <ProductCarousel
                      images={
                        product.images.length
                          ? product.images
                          : ['/placeholder.png']
                      }
                      sx={{
                        width: 150,
                        height: 150,
                        objectFit: 'scale-down',
                        borderRadius: '8px',
                        margin: '0 auto',
                      }}
                    />
                    <Typography variant="h6" mt={2}>
                      {product.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      mt={1}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: 'auto',
                      }}
                    >
                      <Typography variant="h6" color="primary" mb={1}>
                        {product.price} ₽
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          flexDirection: 'column',
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={() => handleEditProduct(product)}
                          sx={{ width: '100%' }}
                        >
                          Редактировать
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteProduct(product.id)}
                          sx={{ width: '100%' }}
                        >
                          Удалить
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Admin;
