const { body } = require("express-validator");

const validateEmail = [
  body("email")
    .trim()
    .isLength({ min: 4, max: 30 })
    .withMessage("Email должен быть от 4 до 30 символов")
    .isEmail()
    .withMessage("Введите корректный email")
    .notEmpty()
    .withMessage("Email обязателен"),
];

const validatePassword = [
  body("password")
    .trim()
    .isLength({ min: 6, max: 30 })
    .withMessage("Пароль должен быть от 6 до 30 символов")
    .notEmpty()
    .withMessage("Введите пароль")
    .matches(/[A-Z]/)
    .withMessage("Пароль должен содержать хотя бы одну заглавную букву")
    .matches(/[a-z]/)
    .withMessage("Пароль должен содержать хотя бы одну строчную букву")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Пароль должен содержать хотя бы один спецсимвол"),
];

module.exports = { validateEmail, validatePassword };
