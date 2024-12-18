import mongoose from "mongoose";

const spaceSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre del espacio es obligatorio"],
  },
  direccion: {
    type: String,
    required: [true, "La dirección es obligatoria"],
  },
  ciudad: {
    type: String,
    required: [true, "La ciudad es obligatoria"],
  },
  precio: {
    type: Number,
    required: [true, "El precio es obligatorio"],
  },
  aceptaReservas: {
    type: Boolean,
    default: false,
  },
  tiposReservas: {
    type: [String],
    default: [],
  },
  imagenUrl: {
    type: String,
    required: false,
  },
  servicios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Servicio",
    },
  ],
  spacesType: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SpaceType",
    },
  ],
});

const Space = mongoose.model("Space", spaceSchema);
export default Space;
