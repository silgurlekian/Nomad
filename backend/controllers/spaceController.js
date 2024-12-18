import Space from "../models/SpaceModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import cloudinary from "cloudinary";

const { v2: cloudinaryV2 } = cloudinary;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Función para subir la imagen a Cloudinary
const uploadToCloudinary = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      filePath,
      { folder: "nomad-spaces" },
      (error, result) => {
        if (error) {
          reject(
            new Error(`Error al subir la imagen a Cloudinary: ${error.message}`)
          );
        } else {
          resolve(result.secure_url);
        }
      }
    );
  });
};

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

    const aceptaReservas =
      req.body.aceptaReservas === true || req.body.aceptaReservas === "true";
    if (
      aceptaReservas &&
      (!req.body.tiposReservas || req.body.tiposReservas.length === 0)
    ) {
      return res.status(400).json({
        message: "Debe incluir al menos un tipo de reserva si acepta reservas",
      });
    }

    // Subir la imagen a Cloudinary si existe
    let imageUrl = null;
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.path);
        imageUrl = result; // Obtener la URL segura de la imagen subida
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

      // Eliminar el archivo temporal después de subirlo
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    // Creación del nuevo espacio
    const newSpace = new Space({
      ...req.body,
      aceptaReservas,
      servicios: req.body.servicios || [],
      spacesType: req.body.spacesType || [],
      imagen: imageUrl, // Guardar la URL de la imagen en Cloudinary
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

// Actualizar un espacio
export const updateSpace = async (req, res) => {
  try {
    const { id } = req.params;
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

    const aceptaReservas =
      req.body.aceptaReservas === true || req.body.aceptaReservas === "true";
    if (
      aceptaReservas &&
      (!req.body.tiposReservas || req.body.tiposReservas.length === 0)
    ) {
      return res.status(400).json({
        message: "Debe incluir al menos un tipo de reserva si acepta reservas",
      });
    }

    // Subir nueva imagen a Cloudinary si existe
    let imageUrl = null;
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.path);
        imageUrl = result; // Obtener la URL segura de la imagen subida
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

      // Eliminar el archivo temporal después de subirlo
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    // Buscar el espacio por ID y actualizarlo
    const updatedSpace = await Space.findByIdAndUpdate(
      id,
      {
        ...req.body,
        aceptaReservas,
        servicios: req.body.servicios || [],
        spacesType: req.body.spacesType || [],
        imagen: imageUrl, // Guardar la URL de la imagen en Cloudinary
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
