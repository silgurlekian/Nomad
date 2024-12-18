import Space from "../models/SpaceModel.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../services/cloudinaryConfig.js";
import path from "path";
import fs from "fs";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this uploads directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `space-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG and GIF images are allowed."
        )
      );
    }
  },
});

// Función para subir imagen a Cloudinary
const uploadToCloudinary = async (filePath) => {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: "nomad-spaces", // Specifies the folder in Cloudinary
      transformation: [{ width: 1000, height: 1000, crop: "limit" }], // Resize image
    });

    // Delete temporary local file
    fs.unlinkSync(filePath);

    return result.secure_url; // Returns the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Error uploading the image");
  }
};

export const uploadSpaceImage = upload.single("imagen"); // 'imagen' should match the form field name

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

    // Manejar subida de imagen
    let imageUrl = null;
    if (req.file) {
      try {
        imageUrl = await uploadToCloudinary(req.file.path);
      } catch (uploadError) {
        return res.status(500).json({
          message: "Error uploading the image",
          error: uploadError.message,
        });
      }
    }

    // Creación del nuevo espacio
    const newSpace = new Space({
      ...req.body,
      aceptaReservas: aceptaReservas,
      servicios: req.body.servicios || [],
      spacesType: req.body.spacesType || [],
      imagen: imageUrl,
      tiposReservas: aceptaReservas ? req.body.tiposReservas : [],
    });

    const savedSpace = await newSpace.save();
    res.status(201).json(savedSpace);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al crear el espacio", error: err.message });
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

    // Manejar subida de imagen
    let imageUrl = req.body.imagen; // Mantener imagen existente por defecto
    if (req.file) {
      try {
        // Delete existing Cloudinary image if it exists
        if (imageUrl && imageUrl.includes("cloudinary.com")) {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          await cloudinary.v2.uploader.destroy(`nomad-spaces/${publicId}`);
        }

        // Upload new image
        imageUrl = await uploadToCloudinary(req.file.path);
      } catch (uploadError) {
        return res.status(500).json({
          message: "Error updating the image",
          error: uploadError.message,
        });
      }
    }

    // Buscar el espacio por ID y actualizarlo
    const updatedSpace = await Space.findByIdAndUpdate(
      id,
      {
        ...req.body,
        aceptaReservas: aceptaReservas,
        servicios: req.body.servicios || [],
        spacesType: req.body.spacesType || [],
        imagen: imageUrl,
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
