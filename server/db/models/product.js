'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate({ Cart, Type, Category, Review, Favorite,Question}) {
      Product.hasMany(Cart, { foreignKey: "productId" });
      Product.belongsTo(Type, { foreignKey: "typeId" });
      Product.belongsTo(Category, { foreignKey: "categoryId" });
      Product.hasMany(Review, { foreignKey: "productId" });
      Product.hasMany(Favorite, { foreignKey: "productId" });
      Product.hasMany(Question, { foreignKey: "productId" });
    }
  }
  Product.init(
    {
      title: DataTypes.STRING,
      price: DataTypes.INTEGER,
      description: DataTypes.STRING,
      compaund: DataTypes.JSON,
      image: DataTypes.ARRAY(DataTypes.STRING),
      typeId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      rating: DataTypes.FLOAT,
      discount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Product',
    }
  );
  return Product;
};
