const reservationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  additionalNotes: {
    type: String,
  },
  numberOfPlaces: {
    type: Number,
    required: true,
    min: 1,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Relación con el modelo de usuario
    required: true,
  },
  spaceId: {  // Nuevo campo para el ID del espacio reservado
    type: mongoose.Schema.Types.ObjectId,
    ref: "Space", // Relación con el modelo de espacio
    required: true,
  },
}, { timestamps: true });

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
