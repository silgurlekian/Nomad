import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Relación con el modelo de usuario
      required: true,
    },
    spaceId: {
      // Nuevo campo para el ID del espacio favorito
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space", // Relación con el modelo de espacio
      required: true,
    },
  },
  { timestamps: true }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;