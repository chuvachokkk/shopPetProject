const { Product, Type } = require("../../db/models");
const { Op } = require("sequelize");

async function findByQuerryParams(req, res) {
  const {
    page = 1,
    limit = 10,
    type,
    category,
    filter,
    sortBy,
    discount,
  } = req.query;

  const pageInt = parseInt(page);
  const offset = (page - 1) * limit;
  const limitInt = parseInt(limit);

  try {
    if (type !== undefined) {
      const latTypes =
        type === "woman" ? "Женщинам" : type === "man" ? "Мужчинам" : undefined;

      const whereConditions = {};

      if (category) {
        whereConditions.category = category;
      }

      if (discount) {
        whereConditions.discount = { [Op.gt]: parseInt(discount) };
      }

      const queryOptions = {
        where: whereConditions,
        limit: limitInt,
        offset: offset,
        order: sortBy ? [[sortBy, "DESC"]] : [],
      };

      const products = await Product.findAndCountAll({
        ...queryOptions,
        include: {
          model: Type,
          where: {
            gender: latTypes,
          },
          required: true,
        },
      });

      return res.json(products);
    }
  } catch (error) {
    console.log(error);

    return res.sendStatus(500);
  }
  try {
    const products = await Product.findAndCountAll({
      limit: limitInt,
      offset: offset,
    });

    return res.json(products);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

module.exports = { findByQuerryParams };
