import Favorite from "../models/FavoriteModel.js";

export const addFavorite = async (req, res) => {
  const userId = req.user.id;
  const { espacioId } = req.body;

  try {
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
    const userId = req.user.id;
    const favoriteId = req.params.favoriteId;
  
    try {
      const favorite = await Favorite.findById(favoriteId);
  
      if (!favorite) {
        return res.status(404).json({ message: "Favorito no encontrado" });
      }
  
      if (favorite.userId.toString() !== userId) {
        return res.status(403).json({ message: "No autorizado a eliminar este favorito" });
      }
  
      await favorite.remove();
      res.status(200).json({ message: "Favorito eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el favorito", error });
    }
  };