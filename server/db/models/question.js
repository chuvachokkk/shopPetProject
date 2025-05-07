'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User,Product}) {
      this.belongsTo(User, {foreignKey: 'userId'});
      this.belongsTo(Product, {foreignKey: 'productId'});
    }
  }
  Question.init({
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    question: DataTypes.STRING,
    answer:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};