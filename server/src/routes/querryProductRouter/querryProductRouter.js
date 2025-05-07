const router = require("express").Router();
const ProductController = require("../../controllers/product.controller");

router.use("/", ProductController.findByQuerryParams);

module.exports = router;
