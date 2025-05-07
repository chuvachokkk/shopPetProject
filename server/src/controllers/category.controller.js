const { Category } = require('../../db/models');

async function getAllItemsByCategory(req, res, next) {
  try {
    const categories = await Category.findAll();

    return res.json({
      data: categories,
    });
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    return res.status(500).json({ error: 'Ошибка на сервере' });
  }
}

module.exports = { getAllItemsByCategory };
