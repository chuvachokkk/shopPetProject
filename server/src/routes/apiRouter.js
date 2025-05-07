const router = require("express").Router();
const cartRouter = require("./cartRouter/cartRouter");
const reviewRouter = require("./reviewRouter/reviewRouter");
const favoriteRouter = require("./favoriteRouter/favoriteRouter");
const questionRouter = require("./questionRouter/questionRouter");
const userApiRouter = require("./userRouter/userApiRouter");
const orderRouter = require("./orderRoter/orderRouter");

router.use("/user", userApiRouter);
router.use("/cart", cartRouter);
router.use("/review", reviewRouter);
router.use("/favorites", favoriteRouter);
router.use("/questions", questionRouter);
router.use("/order", orderRouter);

module.exports = router;
