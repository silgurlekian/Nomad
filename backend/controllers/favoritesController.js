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