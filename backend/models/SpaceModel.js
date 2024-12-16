import mongoose from "mongoose";

const spaceSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    direccion: {
      type: String,
      required: true,
      trim: true,
    },
    ciudad: {
      type: String,
      required: true,
      trim: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return v
            ? /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
                v
              )
            : true;
        },
        message: (props) => `${props.value} no es una URL válida`,
      },
    },
    precio: {
      type: Number,
      required: true,
      min: [0, "El precio no puede ser negativo"],
    },
    servicios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    spacesType: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SpaceType",
      },
    ],
    imagen: { type: String },
    aceptaReservas: {
      type: Boolean,
      default: false,
    },
    tiposReservas: [
      {
        type: String,
        enum: ["porHora", "porDia", "porMes", "porAno"],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// borrar tiposReservas cuando aceptaReservas es falso
spaceSchema.pre("save", function (next) {
  if (!this.aceptaReservas) {
    this.tiposReservas = []; // borrar tiposReservas array
  }
  next();
});

export default mongoose.model("Space", spaceSchema);
