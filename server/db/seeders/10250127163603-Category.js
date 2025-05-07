"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Categories",
      [
        {
          category: "Верхняя одежда",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          category: "Футболки",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          category: "Свитеры",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          category: "Джемперы",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          category: "Кардиганы",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          category: "Пальто",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          category: "Нижнее белье",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
