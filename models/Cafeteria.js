import mongoose from 'mongoose';

const cafeteriaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    ciudad: { type: String, required: true },
    telefono: { type: String },
    email: { type: String },
    website: { type: String },
    descripcion: { type: String },
    servicios: [{ type: String }], 
    horarioApertura: { type: String }, 
    horarioCierre: { type: String },
}, { timestamps: true });

const Cafeteria = mongoose.model('Cafeteria', cafeteriaSchema);

export default Cafeteria;
