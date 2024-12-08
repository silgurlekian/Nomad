import mongoose from "mongoose";

const spaceSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    ciudad: { type: String, required: true },
    telefono: { type: String },
    website: { type: String },
    precio: { type: Number, required: true },
    servicios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    imagen: { type: String },
    aceptaReservas: { type: Boolean, default: false },
    tiposReservas: {
      hora: { type: Boolean, default: false },
      dia: { type: Boolean, default: false },
      mes: { type: Boolean, default: false },
      anual: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Space", spaceSchema);
