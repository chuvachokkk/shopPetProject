const { validationResult } = require("express-validator");
const userService = require("../services/user.service");
const axios = require("axios");

//! Регистрация пользователя
async function registration(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({
        success: false,
        errors: errors.array().map((err) => ({
          field: err.param,
          message: err.msg,
        })),
      });
    }

    const { email, password, captchaToken } = req.body;

    const secretKey = "6LcWAMcqAAAAADaMjWENYO6R-r5bHN_eGzOxwm70"; // Укажи свой Secret Key
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;

    const { data } = await axios.post(verifyUrl);
    if (!data.success) {
      return res
        .status(400)
        .json({ success: false, message: "Ошибка reCAPTCHA" });
    }

    const user = await userService.createUser(email, password);

    const userDto = {
      id: user.id,
      email: user.email,
      address: user.address,
      phone: user.phone,
      name: user.name,
      surname: user.surname,
      lastname: user.lastname,
      role: user.role,
      accessToken: user.tokens.accessToken,
    };

    res.cookie("refresh_token", user.tokens.refreshToken);

    res.json({ ...userDto });
  } catch (error) {
    console.log(error, "ERROR!");
    res
      .status(401)
      .json({ success: false, errors: [{ message: error.message }] });
  }
}

//! Авторизация пользователя
async function login(req, res, next) {
  console.log("РАБОТАЕТ ЭТА РУЧКА");

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).json({
        success: false,
        errors: errors.array().map((err) => ({
          field: err.param,
          message: err.msg,
        })),
      });
    }

    const { email, password, captchaToken } = req.body;

    const secretKey = "6LcWAMcqAAAAADaMjWENYO6R-r5bHN_eGzOxwm70"; // Укажи свой Secret Key
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;

    const { data } = await axios.post(verifyUrl);
    if (!data.success) {
      return res
        .status(400)
        .json({ success: false, message: "Ошибка reCAPTCHA" });
    }

    const user = await userService.findUserByEmailAndPassword(email, password);

    const userDto = {
      id: user.id,
      email: user.email,
      address: user.address,
      phone: user.phone,
      name: user.name,
      surname: user.surname,
      lastname: user.lastname,
      role: user.role,
      accessToken: user.tokens.accessToken,
    };
    res.cookie("refresh_token", user.tokens.refreshToken);
    res.json({ ...userDto });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, errors: [{ message: error.message }] });
  }
}

//! Авторизация пользователя
async function logout(req, res, next) {
  try {
    res.clearCookie("refresh_token").sendStatus(200);
  } catch (error) {
    res.status(500);
  }
}

//TODO Поиск пользователя по почте
async function findUserByEmail(req, res, next) {
  try {
  } catch (error) {}
}

//TODO Доработать получение всех пользователей
async function getAllUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    console.log(users);

    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
}

async function changeUserData(req, res, next) {
  const email = req.user.email;
  const { name, surname, lastname, address, phone } = req.body;

  try {
    const data = await userService.changeUserData(
      email,
      name,
      surname,
      lastname,
      address,
      phone
    );

    if (!data) {
      return res.json({
        success: false,
        message: "Не удалось обновить данные пользователя",
      });
    }

    res.json(data);
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error.message });
  }
}

async function getUserOrders(req, res, next) {
  const userId = req.user.id;

  try {
    const data = await userService.getUserOrders(userId);

    if (!data) {
      return res.json({
        success: false,
        message: "Не удалось получить данные о заказах",
      });
    }

    res.json(data);
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error.message });
  }
}

module.exports = {
  registration,
  login,
  findUserByEmail,
  getAllUsers,
  logout,
  changeUserData,
  getUserOrders,
};
