import mongoose from 'mongoose';

// Esquema del tipo de espacio
const spaceTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true } // Esto agrega las fechas de creación y actualización automáticamente
);

// Crea el modelo del tipo
const SpaceType = mongoose.model('SpaceType', spaceTypeSchema);

export default SpaceType;
