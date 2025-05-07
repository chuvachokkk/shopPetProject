const express = require("express");
const router = express.Router();
const favoriteController = require("../../controllers/favorite.controller");

router.get("/", favoriteController.getFavorites);
router.post("/", favoriteController.addFavorite);
router.delete("/", favoriteController.removeFavorite);

module.exports = router;
