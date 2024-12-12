import Favorites from "../models/FavoriteModel.js";
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Obtener el token del header Authorization
    if (!token) {
      return res
        .status(401)
        .json({ message: "No se proporcionó token de autenticación" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodificar el token
    req.userId = decoded.id; // Guardar el userId en la request para usarlo en otras funciones
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token no válido", error: error.message });
  }
};

// Obtener todos los favoritos
export const getAllFavorites = async (req, res) => {
  try {
    const favorites = await Favorites.find().populate("userId", "fullName"); 
    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error obteniendo los favoritos:", error);
    res.status(500).json({
      message: "Error al obtener los favoritos",
      error: error.message,
    });
  }
};

// Obtener los favoritos de un usuario
export const getFavoritesByUser = async (req, res) => {
  try {
    const { userId } = req; // Usamos el userId que se estableció en el middleware de verificación de token
    const favorites = await Favorites.find({ userId }).populate("userId", "fullName");
    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error obteniendo los favoritos del usuario:", error);
    res.status(500).json({
      message: "Error al obtener los favoritos del usuario",
      error: error.message,
    });
  }
};

// Crear un nuevo favorito
export const createFavorite = async (req, res) => {
  try {
    const { userId } = req; // Usamos el userId que se estableció en el middleware de verificación de token
    const { spaceId } = req.body;

    const newFavorite = new Favorites({
      userId,
      spaceId,
    });

    await newFavorite.save();
    res.status(201).json(newFavorite); 
  } catch (error) {
    console.error("Error creando el favorito:", error);
    res.status(500).json({
      message: "Error al crear el favorito",
      error: error.message,
    });
  }
};

// Eliminar un favorito por su ID
export const deleteFavorite = async (req, res) => {
  try {
    const favoriteId = req.params.id; 

    const favorite = await Favorites.findByIdAndDelete(favoriteId);

    if (!favorite) {
      return res.status(404).json({ message: "Favorito no encontrado" });
    }

    res.status(200).json({ message: "Favorito eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar el favorito:", error);
    res.status(500).json({
      message: "Error al eliminar el favorito",
      error: error.message,
    });
  }
};
