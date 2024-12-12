import express from "express";
import {
  createFavorite,
  getAllFavorites,
  getFavoritesByUser,
  deleteFavorite, 
} from "../controllers/rFavoritesController.js";

const router = express.Router();

router.get("/", getAllFavorites);
router.get("/user", getFavoritesByUser);
router.post("/", createFavorite);
router.delete("/:id", deleteFavorite); 

export default router;
