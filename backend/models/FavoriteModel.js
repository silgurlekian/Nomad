import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  spaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Space", required: true },
});

const Favorite = mongoose.model("Favorite", FavoriteSchema);

export default Favorite;
