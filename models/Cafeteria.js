import mongoose from 'mongoose';

const cafeteriaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    ciudad: { type: String, required: true },
    telefono: { type: String },
    email: { type: String },
    website: { type: String },
    descripcion: { type: String },
    servicios: [{ type: String }],  // Servicios que ofrece la cafetería
    horarioApertura: { type: String }, // Horario de apertura de la cafetería
    horarioCierre: { type: String },   // Horario de cierre de la cafetería
}, { timestamps: true });

const Cafeteria = mongoose.model('Cafeteria', cafeteriaSchema);

export default Cafeteria;
