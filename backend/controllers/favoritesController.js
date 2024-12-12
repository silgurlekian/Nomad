import Favorite from "../models/FavoriteModel.js";
import jwt from "jsonwebtoken";

// Obtener todas los favoritos
export const getAllFavorites = async (req, res) => {
  try {
    const Favorites = await Favorite.find().populate(
      "userId",
      "spaceId"
    ); 
    res.status(200).json(Favorites);
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

    // Verificar el token y extraer el userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodificar el token
    const userId = decoded.id; // El ID del usuario extraído del token

    const Favorites = await Favorite.find({ userId }).populate(
      "userId",
      "spaceId"
    );
    res.status(200).json(Favorites);
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

    const {
      spaceId,
    } = req.body;

    // Crear la nueva favorito con los datos recibidos, incluyendo el espacio favoritodo
    const newFavorite = new Favorite({
      userId,
      spaceId, 
    });

    await newFavorite.save();
    res.status(201).json(newFavorite); // Enviar el favorito creada como respuesta
  } catch (error) {
    console.error("Error creando el favorito:", error);
    res.status(500).json({
      message: "Error al crear el favorito",
      error: error.message,
    });
  }
};

// Eliminar una favorito por su ID
export const deleteFavorite = async (req, res) => {
  try {
    const favoriteId = req.params.id; // Obtener el ID de el favorito desde los parámetros

    // Buscar y eliminar el favorito
    const Favorite = await Favorite.findByIdAndDelete(favoriteId);

    if (!Favorite) {
      return res.status(404).json({ message: "favorito no encontrada" });
    }

    res.status(200).json({ message: "favorito eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar el favorito:", error);
    res.status(500).json({
      message: "Error al eliminar el favorito",
      error: error.message,
    });
  }
};
