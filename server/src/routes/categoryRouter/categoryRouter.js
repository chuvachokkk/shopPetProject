const router = require("express").Router();
const CategoryController = require("../../controllers/category.controller");

router.get("/", CategoryController.getAllItemsByCategory);

module.exports = router;
