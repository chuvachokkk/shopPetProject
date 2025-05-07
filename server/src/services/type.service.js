const { Product, Type } = require("../../db/models");

async function getAllItemsByType(gender = "all") {
  if (gender === "all") {
    const data = await Product.findAll({
      raw: true,
    });
    return data;
  }
  const data = await Type.findAll({
    where: { gender },
    attributes: [],
    include: { model: Product },
    raw: true,
    nest: true,
  });

  if (!data) throw new Error("Ошибка запроса");

  const formattedData = data.map((item) => item.Products);

  return formattedData;
}

module.exports = { getAllItemsByType };
