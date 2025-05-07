const router = require('express').Router();
const { Product, Type, Category,Review } = require('../../../db/models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const { Op } = require('sequelize');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const productName = req.body.title?.replace(/\s+/g, '_') || 'default';
    const productDir = path.join(__dirname, '../../../uploads', productName);
    ensureDirExists(productDir);
    cb(null, productDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Разрешены только изображения'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
});

router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const productName = req.body.title?.replace(/\s+/g, '_') || 'default';

    const imagePaths =
      req.files?.map((file) => `/uploads/${productName}/${file.filename}`) ||
      [];

    const compound = req.body.compaund ? JSON.parse(req.body.compaund) : null;

    const newProduct = await Product.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      typeId: req.body.typeId,
      categoryId: req.body.categoryId,
      rating: 0,
      image: imagePaths,
      compaund: compound,
      discount: req.body.discount || 0 
    });

    res.json(newProduct);
  } catch (error) {
    console.error('Ошибка при добавлении товара:', error);
    res.status(500).json({ error: 'Ошибка при добавлении товара' });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ data: products });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, typeId, categoryId, rating , discount } = req.body;

    // Находим продукт по id
    const product = await Product.findOne({ where: { id } });
    if (!product) return res.status(404).json({ error: 'Продукт не найден' });

    // Обрабатываем изображения
    let updatedImages = Array.isArray(product.image) ? [...product.image] : []; // Если есть старые изображения, сохраняем их

    // Если были загружены новые файлы
    if (req.files && Array.isArray(req.files)) {
      const newImages = req.files.map(
        (file) => `/uploads/${product.title.replace(/\s+/g, '_')}/${file.filename}`
      );
      updatedImages = [...updatedImages, ...newImages].slice(0, 5); // Обновляем изображения, но не больше 5
    }

    // Обновляем товар с новыми данными
    await product.update({
      title: title || product.title,
      description: description || product.description,
      price: price || product.price,
      typeId: typeId || product.typeId,
      categoryId: categoryId || product.categoryId,
      rating: rating !== undefined ? rating : product.rating,
      image: updatedImages.length > 0 ? updatedImages : product.image,
      discount: discount !== undefined ? parseFloat(req.body.discount) : product.discount
    });

    // Возвращаем обновлённый продукт
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Ошибка при обновлении товара:', error);
    res.status(500).json({ success: false, error: 'Ошибка при обновлении товара' });
  }
});



router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id } });
    if (!product) return res.status(404).send({ message: 'Продукт не найден' });

    const productDir = path.join(
      __dirname,
      '../../../uploads',
      product.title.replace(/\s+/g, '_')
    );
    if (fs.existsSync(productDir)) {
      fs.rmSync(productDir, { recursive: true, force: true });
    }

    await product.destroy();
    res.send({ message: 'Продукт удален' });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get('/same/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.findAll({ where: { categoryId: id } });
    const result = products.map((el) => el.get());
    res.send(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    const result = product.get();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


router.get("/sale/all", async (req, res) => {
  try {
    const products = await Product.findAll({where:{
      discount: {
      [Op.gt]: 0 
      }
    }});
    res.send(products);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


router.get('/review/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const reviews = await Review.findAll({ where: { productId: id } });
    const result = reviews.map((el) => el.get());
    res.send(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
