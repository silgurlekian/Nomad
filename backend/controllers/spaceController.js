import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import Space from "../models/SpaceModel.js";

// Configurar almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "spaces", // Carpeta en tu cuenta de Cloudinary
    allowed_formats: ["jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 600, crop: "limit" }], // Opcional: transformación
  },
});

// Configurar Multer con CloudinaryStorage
const upload = multer({ storage });

export const uploadSpaceImage = upload.single("imagen");

// Obtener todos los espacios
export const getSpaces = async (req, res) => {
  try {
    const spaces = await Space.find()
      .populate({ path: "servicios", select: "name" })
      .populate({ path: "spacesType", select: "name" })
      .lean(); 

    console.log("Spaces with populated data:", spaces);

    res.status(200).json(spaces);
  } catch (error) {
    res.status(400).json({ error: "Error al obtener los espacios." });
  }
};

// Obtener detalles de un espacio por ID
export const getSpaceById = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id).populate([
      { path: "servicios", select: "name" },
      { path: "spacesType", select: "name" },
    ]);
    if (!space) {
      return res.status(404).json({ error: "Espacio no encontrado." });
    }
    res.status(200).json(space);
  } catch (error) {
    res.status(400).json({ error: "Error al obtener el espacio." });
  }
};

// Crear un nuevo espacio
export const createSpace = async (req, res) => {
  try {
    const { body } = req;

    // Validación de campos
    if (!body.nombre || !body.direccion || !body.ciudad || !body.precio) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const aceptaReservas = body.aceptaReservas === true || body.aceptaReservas === "true";
    if (aceptaReservas && (!body.tiposReservas || body.tiposReservas.length === 0)) {
      return res.status(400).json({
        message: "Si aceptaReservas es true, debe incluir al menos un tipo de reserva",
      });
    }

    // URL de la imagen subida a Cloudinary
    let imageUrl = null;
    if (req.file) {
      imageUrl = req.file.path; // URL de la imagen desde Cloudinary
    }

    const newSpace = new Space({
      ...body,
      aceptaReservas,
      servicios: body.servicios || [],
      spacesType: body.spacesType || [],
      imagen: imageUrl,
      tiposReservas: aceptaReservas ? body.tiposReservas : [],
    });

    const savedSpace = await newSpace.save();
    res.status(201).json(savedSpace);
  } catch (err) {
    res.status(500).json({ message: "Error al crear el espacio", error: err.message });
  }
};

// Actualizar un espacio existente
export const updateSpace = async (req, res) => {
  try {
    const { id } = req.params;

    // Validación de campos requeridos
    if (
      !req.body.nombre ||
      !req.body.direccion ||
      !req.body.ciudad ||
      !req.body.precio
    ) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    // Validar tiposReservas solo si aceptaReservas es true
    const aceptaReservas =
      req.body.aceptaReservas === true || req.body.aceptaReservas === "true";

    if (
      aceptaReservas &&
      (!req.body.tiposReservas || req.body.tiposReservas.length === 0)
    ) {
      return res.status(400).json({
        message:
          "Si aceptaReservas es true, debe incluir al menos un tipo de reserva",
      });
    }

    // Convertir imagen a base64 si existe
    let base64Image = null;
    if (req.file) {
      base64Image = convertImageToBase64(req.file.path);
      
      // Eliminar el archivo temporal después de convertirlo
      fs.unlinkSync(req.file.path);
    }

    // Buscar el espacio por ID y actualizarlo
    const updatedSpace = await Space.findByIdAndUpdate(
      id,
      {
        ...req.body,
        aceptaReservas: aceptaReservas,
        servicios: req.body.servicios || [],
        spacesType: req.body.spacesType || [],
        imagen: base64Image,
        tiposReservas: aceptaReservas ? req.body.tiposReservas : [],
      },
      { new: true, runValidators: true }
    );

    if (!updatedSpace) {
      return res.status(404).json({ error: "Espacio no encontrado." });
    }

    res.status(200).json(updatedSpace);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al actualizar el espacio", error: err.message });
  }
};

// Eliminar un espacio
export const deleteSpace = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSpace = await Space.findByIdAndDelete(id);

    if (!deletedSpace) {
      return res.status(404).json({ message: "Espacio no encontrado" });
    }

    res.json({ message: "Espacio eliminado con éxito", deletedSpace });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al eliminar el espacio", error: err.message });
  }
};