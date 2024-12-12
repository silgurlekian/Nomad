import express from "express";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/favoritesController.js";

const router = express.Router();

router.get("/", getFavorites);
router.post("/", addFavorite);
router.delete("/:id", removeFavorite);

export default router;
