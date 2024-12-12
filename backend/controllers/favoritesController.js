import Favorite from "../models/FavoriteModel.js";

export const addFavorite = async (req, res) => {
  const userId = req.user.id;
  const { espacioId } = req.body;

  try {
    const existingFavorite = await Favorite.findOne({ userId, espacioId });

    if (existingFavorite) {
      return res
        .status(400)
        .json({ message: "Este espacio ya está en favoritos" });
    }

    const favorite = await Favorite.create({ userId, espacioId });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: "Error al añadir a favoritos", error });
  }
};

export const getFavorites = async (req, res) => {
  const userId = req.user.id;

  try {
    const favorites = await Favorite.find({ userId }).populate("espacioId");
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener favoritos", error });
  }
};

export const removeFavorite = async (req, res) => {
  const userId = req.user.id; // El ID del usuario autenticado
  const favoriteId = req.params.favoriteId; // El ID del favorito a eliminar

  try {
    // Agregar logs para depuración
    console.log("ID del usuario autenticado:", userId);
    console.log("ID del favorito a eliminar:", favoriteId);

    // Buscar el favorito en la base de datos
    const favorite = await Favorite.findById(favoriteId);
    if (!favorite) {
      return res.status(404).json({ message: "Favorito no encontrado" });
    }

    // Verificar que el usuario sea el propietario del favorito
    if (favorite.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "No autorizado a eliminar este favorito" });
    }

    // Eliminar el favorito de la base de datos
    await favorite.remove();
    return res
      .status(200)
      .json({ message: "Favorito eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el favorito:", error.message);
    return res
      .status(500)
      .json({ message: "Error al eliminar el favorito", error: error.message });
  }
};
