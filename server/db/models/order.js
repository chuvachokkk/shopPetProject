'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      this.belongsTo(User, {foreignKey: 'userId'});
    }
  }
  Order.init({
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    data: DataTypes.TEXT,
    userId: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};