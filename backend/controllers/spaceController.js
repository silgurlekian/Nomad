import Space from "../models/SpaceModel.js";
import cloudinary from '../services/cloudinaryConfig.js'; // Ajusta el path según sea necesario
import fs from 'fs';

// Función para subir la imagen a Cloudinary
const uploadImage = async (file) => {
  try {
    // Validación del tipo de archivo y tamaño
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Tipo de archivo no permitido. Solo se aceptan imágenes.');
    }

    if (file.size > maxSize) {
      throw new Error('El tamaño de la imagen no puede superar 5MB.');
    }

    // Subir imagen a Cloudinary con transformaciones opcionales
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "spaces", // Carpeta en Cloudinary
      resource_type: "image", // Especificar solo imágenes
      transformation: [
        { width: 800, height: 600, crop: "limit" }, // Redimensionar si es muy grande
        { quality: "auto" } // Optimizar calidad
      ]
    });

    // Eliminar archivo temporal
    fs.unlinkSync(file.tempFilePath);

    return result.secure_url; // URL segura de la imagen
  } catch (error) {
    console.error("Error al subir imagen a Cloudinary:", error);
    throw new Error("Error al subir la imagen: " + error.message);
  }
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

    // Si se subió una imagen
    let imagenUrl = "";
    if (req.files && req.files.imagen) {
      try {
        imagenUrl = await uploadImage(req.files.imagen);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    // Creación del nuevo espacio
    const newSpace = new Space({
      ...req.body,
      aceptaReservas: aceptaReservas,
      servicios: req.body.servicios || [],
      spacesType: req.body.spacesType || [],
      tiposReservas: aceptaReservas ? req.body.tiposReservas : [],
      imagenUrl
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

    // Buscar el espacio existente para manejar la imagen
    const existingSpace = await Space.findById(id);
    let imagenUrl = existingSpace.imagenUrl;

    // Si se sube una nueva imagen
    if (req.files && req.files.imagen) {
      try {
        // Eliminar imagen anterior de Cloudinary si existe
        if (imagenUrl) {
          const publicId = imagenUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`spaces/${publicId}`);
        }

        // Subir nueva imagen
        imagenUrl = await uploadImage(req.files.imagen);
      } catch (error) {
        return res.status(500).json({ error: error.message });
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
        tiposReservas: aceptaReservas ? req.body.tiposReservas : [],
        imagenUrl
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
    
    // Buscar el espacio para obtener la URL de la imagen
    const spaceToDelete = await Space.findById(id);
    
    if (!spaceToDelete) {
      return res.status(404).json({ message: "Espacio no encontrado" });
    }

    // Eliminar imagen de Cloudinary si existe
    if (spaceToDelete.imagenUrl) {
      const publicId = spaceToDelete.imagenUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`spaces/${publicId}`);
    }

    // Eliminar espacio de la base de datos
    const deletedSpace = await Space.findByIdAndDelete(id);

    res.json({ message: "Espacio eliminado con éxito", deletedSpace });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al eliminar el espacio", error: err.message });
  }
};

export { uploadImage };
