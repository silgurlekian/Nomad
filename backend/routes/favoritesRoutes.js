import express from "express";
import {
  createFavorite,
  getAllFavorites,
  getFavoritesByUser,
  deleteFavorite,
} from "../controllers/favoritesController.js";
import { verifyToken } from "../controllers/favoritesController.js";

const router = express.Router();

router.get("/", getAllFavorites);
router.get("/user", verifyToken, getFavoritesByUser);
router.post("/", verifyToken, createFavorite);
router.delete("/:id", verifyToken, deleteFavorite);

export default router;
