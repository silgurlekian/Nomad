import mongoose from "mongoose";

const spaceSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    ciudad: { type: String, required: true },
    telefono: { type: String },
    precio: { type: Number },
    website: { type: String },
    descripcion: { type: String },
    servicios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    imagen: { type: String },
  },
  { timestamps: true }
);

const Space = mongoose.model("Space", spaceSchema);

export default Space;
