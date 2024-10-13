import mongoose from 'mongoose';

const SpaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: String,
    description: String,
    amenities: [String],
    pricePerDay: Number,
    capacity: Number,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitud, latitud]
            default: [0, 0]
        }
    }
}, { timestamps: true });

// Index geoespacial
SpaceSchema.index({ location: '2dsphere' });

export default mongoose.model('Space', SpaceSchema);
