import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  espacioId: { type: mongoose.Schema.Types.ObjectId, ref: "Space", required: true },
});