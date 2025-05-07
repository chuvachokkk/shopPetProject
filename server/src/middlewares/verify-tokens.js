require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyRefreshToken = (req, res, next) => {
  try {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
      return res.status(401).json({ message: "Необходимо авторизоваться" });
    }

    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Invalid refresh token", error);
    res
      .clearCookie("refresh_token")
      .status(401)
      .json({ message: "Необходимо авторизоваться" });
  }
};

const verifyAccessToken = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Нет доступа" });
    }

    const accessToken = authHeader.split(" ")[1];

    try {
      const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.user = user;
      return next();
    } catch (error) {
      return verifyRefreshToken(req, res, () => {
        console.log("Access-токен обновлён");
        next();
      });
    }
  } catch (error) {
    console.error("Ошибка авторизации", error);
    res
      .clearCookie("refreshtoken")
      .status(401)
      .json({ message: "Необходимо авторизоваться" });
  }
};

module.exports = { verifyAccessToken, verifyRefreshToken };
