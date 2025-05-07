const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { verifyAccessToken } = require("./middlewares/verify-tokens");

const path = require("path");
const corsOptions = require("./config/cors.config");
const apiRouter = require("./routes/apiRouter");
const publicRouter = require("./routes/publicRouter");

const deleteExpressHeader = require("./middlewares/delete.express-header");

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use(deleteExpressHeader);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//! Это API Роутер! Здесь будут ручки и контроллеры которые относятся только к тому, что будет происходить по авторизации и проверки ролей! Проверка ролей будет происходить
app.use("/api", verifyAccessToken, apiRouter);

//! Это public Роутер! Здесь все ручки, которые не требуют проверки токенов и роли! Они общедоступные!
app.use("/", publicRouter);

module.exports = app;
