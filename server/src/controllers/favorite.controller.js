const { Favorite, Product } = require("../../db/models");

async function getFavorites(req, res) {
  try {
    const userId = req.user.id; // ID пользователя из токена
    const favorites = await Favorite.findAll({
      where: { userId },
      include: { model: Product },
      raw: true,
      nest: true,
    });
    res.json(favorites);
  } catch (error) {
    console.error("Ошибка при получении лайков:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

async function addFavorite(req, res) {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const existingFavorite = await Favorite.findOne({
      where: { userId, productId },
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "Этот товар уже в избранном" });
    }
    await Favorite.create({ userId, productId });
    const data = await Favorite.findOne({
      where: { userId, productId },
      include: { model: Product },
    });
    res.status(201).json(data);
  } catch (error) {
    console.error("Ошибка при добавлении в избранное:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

async function removeFavorite(req, res) {
  try {
    const userId = req.user.id;
    const { productId } = req.query;

    const deleted = await Favorite.destroy({ where: { userId, productId } });

    if (!deleted) {
      return res.status(404).json({ message: "Товар не найден в избранном" });
    }

    res.status(200).json({ message: "Удалено из избранного" });
  } catch (error) {
    console.error("Ошибка при удалении из избранного:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

module.exports = { getFavorites, removeFavorite, addFavorite };
