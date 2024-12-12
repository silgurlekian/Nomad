import Favorites from "../models/FavoriteModel.js";

// Obtener todos los favoritos
export const getAllFavorites = async (req, res) => {
  try {
    const favorites = await Favorites.find().populate("userId", "spaceId");
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
    const favorites = await Favorites.find({ userId }).populate(
      "userId",
      "spaceId"
    );
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
  const userId = req.user.id; // ID del usuario
  const { espacioId } = req.body; // ID del espacio

  try {
    if (!espacioId || !userId) {
      return res.status(400).json({
        message: "Faltan datos necesarios (espacioId o userId).",
      });
    }

    // Verificar si el favorito ya existe
    const existingFavorite = await Favorites.findOne({
      userId,
      espacioId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        message: "Este espacio ya está en tus favoritos.",
      });
    }

    // Crear el nuevo favorito
    const nuevoFavorito = new Favorites({
      userId,
      espacioId,
    });

    await nuevoFavorito.save();

    return res.status(201).json({
      message: "Favorito agregado exitosamente.",
      favorite: nuevoFavorito,
    });
  } catch (error) {
    console.error("Error creando el favorito:", error);
    res.status(500).json({
      message: "Error al agregar el favorito.",
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
