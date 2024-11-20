import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // Importar cors
import authRoutes from "./routes/authRoutes.js";
import spaceRoutes from "./routes/spaceRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: ["http://localhost:3001", "http://localhost:3002"], // Permitir ambos orígenes
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  credentials: true, // Permitir credenciales si es necesario
};
app.use(cors(corsOptions)); // Usar cors con las opciones configuradas

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

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado a MongoDB");

    // Inicio del servidor
    const PORT = process.env.PORT || 3000; // Usar puerto por defecto si no está configurado
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1); // Detener la aplicación si no se puede conectar a MongoDB
  });
