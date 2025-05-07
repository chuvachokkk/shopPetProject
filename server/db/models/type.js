"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    static associate({ Product }) {
      Type.hasMany(Product, { foreignKey: "typeId" });
    }
  }
  Type.init(
    {
      gender: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Type",
    }
  );
  return Type;
};
