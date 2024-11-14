import mongoose from 'mongoose';

// Esquema del servicio
const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true } // Esto agrega las fechas de creación y actualización automáticamente
);

// Crea el modelo del servicio
const Service = mongoose.model('Service', serviceSchema);

export default Service;
