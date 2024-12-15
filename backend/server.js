import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import spaceRoutes from "./routes/spaceRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import spaceTypeRoutes from "./routes/spaceTypeRoutes.js";
import reservationRoutes from './routes/reservationRoutes.js';
import favoritesRoutes from './routes/favoritesRoutes.js';
import path from "path";
import { fileURLToPath } from "url";

// Cargar variables de entorno
dotenv.config();

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: [
    "http://localhost:3001", 
    "http://localhost:3002", 
    "https://nomad.com.ar",
    // "https://pwa.nomad.com.ar",
    "https://nomad.com.ar/pwa/",
    "http://localhost:3000",
    "https://nomad-znm2.onrender.com", 
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Permitir solicitudes CORS para los orígenes configurados
app.use(cors(corsOptions));

// Manejo de solicitudes preflight (OPTIONS)
app.options("*", cors(corsOptions)); 

// Middleware
app.use(express.json());

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/spaces", spaceRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/spacesType", spaceTypeRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/favorites", favoritesRoutes);

// Servir archivos estáticos desde la carpeta 'uploads'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ruta de archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, "views")));

// Ruta de la página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Verificar que las variables de entorno esenciales están configuradas
if (!process.env.MONGODB_URI) {
  console.error(
    "Error: La variable de entorno MONGODB_URI no está configurada."
  );
  process.exit(1); // Detiene la aplicación si falta esta configuración
}

if (!process.env.PORT) {
  console.warn(
    "Advertencia: La variable de entorno PORT no está configurada. Usando el puerto 3000 por defecto."
  );
}

mongoose.set("debug", true);

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Servidor corriendo en el puerto ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
  });