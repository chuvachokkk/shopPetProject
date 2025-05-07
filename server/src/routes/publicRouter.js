const router = require("express").Router();
const typeRouter = require("./typeRouter/typeRouter");
const categoryRouter = require("./categoryRouter/categoryRouter");
const productRouter = require("./productRouter/productRouter");
const userRouter = require("./userRouter/userRouter");
const verifyRouter = require("./verifyRouter/verifyRouter");
const chatRouter = require("./chatRouter/chat.router");
const querryProductRouter = require("./querryProductRouter/querryProductRouter");

router.use("/user", userRouter);
router.use("/type", typeRouter);
router.use("/categories", categoryRouter);
router.use("/product", productRouter);
router.use("/verify", verifyRouter);
router.use("/chat", chatRouter);

router.use("/", querryProductRouter);

module.exports = router;
