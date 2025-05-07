const router = require("express").Router();
const { body } = require("express-validator");
const {
  validateEmail,
  validatePassword,
} = require("../../middlewares/auth.validator");

const validateUserBody = [...validateEmail, ...validatePassword];

const userController = require("../../controllers/user.controller");

router.post("/signup", validateUserBody, userController.registration);

router.post("/signin", validateUserBody, userController.login);

router.get("/signout", userController.logout);

module.exports = router;
