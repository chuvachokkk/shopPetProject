"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Cart, Favorite, Review ,Question, Order}) {
      User.hasOne(Cart, { foreignKey: "userId" });
      User.hasMany(Favorite, { foreignKey: "userId" });
      User.hasMany(Review, { foreignKey: "userId" });
      User.hasMany(Question, { foreignKey: "userId" });
      User.hasMany(Order, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      lastname: DataTypes.STRING,
      surname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      role: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
