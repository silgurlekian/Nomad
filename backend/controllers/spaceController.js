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

// Función para subir la imagen a Cloudinary
const uploadImageToCloudinary = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      filePath,
      {
        folder: "spaces", // Puedes organizar las imágenes en una carpeta
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.secure_url); // Devuelve la URL segura de la imagen
      }
    );
  });
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

    let imageUrl = null;
    if (req.file) {
      // Subir imagen a Cloudinary
      imageUrl = await uploadImageToCloudinary(req.file.path);

      // Eliminar archivo temporal después de la carga
      fs.unlinkSync(req.file.path);
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

    let imageUrl = null;
    if (req.file) {
      // Subir imagen a Cloudinary
      imageUrl = await uploadImageToCloudinary(req.file.path);

      // Eliminar archivo temporal después de la carga
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
