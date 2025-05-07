const router = require("express").Router();

const userController = require("../../controllers/user.controller");

router.patch("/", userController.changeUserData);
router.get("/", userController.getUserOrders);

module.exports = router;
