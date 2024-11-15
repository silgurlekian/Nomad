import mongoose from 'mongoose';

const spaceSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    ciudad: { type: String, required: true },
    telefono: { type: String },
    email: { type: String },
    website: { type: String },
    descripcion: { type: String },
    servicios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
}, { timestamps: true });

const Space = mongoose.model('Space', spaceSchema);

export default Space;
