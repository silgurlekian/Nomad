import Favorite from "../models/FavoriteModel.js";
import jwt from "jsonwebtoken";

// Obtener todas los favoritos
export const getAllFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find().populate("spaceId"); // Poblar solo el espacio
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
    const token = req.headers.authorization.split(" ")[1]; // Obtener el token del header Authorization
    if (!token) {
      return res
        .status(401)
        .json({ message: "No se proporcionó token de autenticación" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodificar el token
    const userId = decoded.id; // El ID del usuario extraído del token

    const favorites = await Favorite.find({ userId }).populate("spaceId"); // Poblar solo el espacio
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
    const token = req.headers.authorization.split(" ")[1]; // Obtener el token del header Authorization
    if (!token) {
      return res
        .status(401)
        .json({ message: "No se proporcionó token de autenticación" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodificar el token
    const userId = decoded.id; // El ID del usuario extraído del token

    const { spaceId } = req.body;

    // Verificar si ya existe un favorito para este usuario y espacio
    const existingFavorite = await Favorite.findOne({ userId, spaceId });
    if (existingFavorite) {
      return res
        .status(400)
        .json({ message: "Este espacio ya está en tus favoritos" });
    }

    const newFavorite = new Favorite({
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
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No se proporcionó token de autenticación" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      // Buscar el favorito y verificar que pertenezca al usuario
      const favorite = await Favorite.findOneAndDelete({ 
        _id: favoriteId, 
        userId: userId 
      });
  
      if (!favorite) {
        return res.status(404).json({ message: "Favorito no encontrado o no autorizado" });
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