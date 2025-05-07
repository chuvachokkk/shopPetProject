const router = require("express").Router();
const TypeController = require("../../controllers/type.controller");

router.get("/:gender", TypeController.getAllItemsByType);
router.get("/all", TypeController.getAllItemsByType);

module.exports = router;
