const { Cart } = require('../../db/models');

async function create({ userId, productId, size }) {
  const cart = await Cart.create({ userId, productId, size });
  if (!cart) throw new Error('Ошибка запроса');
  return cart;
}

module.exports = { create };
