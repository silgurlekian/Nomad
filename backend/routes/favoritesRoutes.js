// favoritesRoutes.js
import express from "express";
import {
  createFavorite,
  getAllFavorites,
  getFavoritesByUser,
  deleteFavorite, 
} from "../controllers/favoritesController.js";

const router = express.Router();

// Obtener todos los favoritos
router.get("/", getAllFavorites);

// Obtener los favoritos de un usuario
router.get("/user", getFavoritesByUser);

// Crear un nuevo favorito
router.post("/", createFavorite);

// Eliminar un favorito por su ID
router.delete("/:id", deleteFavorite); 

export default router;
