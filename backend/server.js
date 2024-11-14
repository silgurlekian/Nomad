import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import coworkingRoutes from "./routes/coworkingRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/coworkings", coworkingRoutes);
app.use("/api/services", serviceRoutes); // Asegúrate de que la ruta esté bien configurada

// Ruta de archivos estáticos (CSS, imágenes, etc.)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "views")));

// Ruta de la página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Conexión a MongoDB y inicio del servidor
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
  });
