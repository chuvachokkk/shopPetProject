const router = require("express").Router();
const TokenController = require("../../controllers/token.controller");
const { verifyRefreshToken } = require("../../middlewares/verify-tokens");

router.get("/", verifyRefreshToken, TokenController.refreshAccessToken);

module.exports = router;
