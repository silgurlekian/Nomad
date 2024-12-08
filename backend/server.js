import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import spaceRoutes from "./routes/spaceRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
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
    "https://pwa.nomad.com.ar",
    "http://localhost:3000",
    "https://api-nomad.onrender.com", 
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Permitir solicitudes CORS para los orígenes configurados
app.use(cors(corsOptions));

// Manejo de solicitudes preflight (OPTIONS)
app.options("*", cors(corsOptions));  // Asegura que se manejen las solicitudes OPTIONS

// Middleware
app.use(express.json());

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/spaces", spaceRoutes);
app.use("/api/services", serviceRoutes);

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