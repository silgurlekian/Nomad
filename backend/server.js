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

// Middleware
app.use(cors(corsOptions)); // Usar cors con las opciones configuradas
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

// Conexión a MongoDB y inicio del servidor
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Conectado a MongoDB");
        app.listen(process.env.PORT, () => {
            console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error al conectar a MongoDB:", error);
    });