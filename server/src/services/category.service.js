const { Category } = require('../../db/models');

async function getAllItemsByCategory() {
  return await Category.findAll();
}

module.exports = { getAllItemsByCategory };
