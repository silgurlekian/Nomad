import Space from "../models/SpaceModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB máximo
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(new Error("Solo se permiten imágenes JPEG, PNG o GIF"));
    }
  },
});

export const uploadSpaceImage = upload.single("imagen");

// Obtener todos los espacios
export const getSpaces = async (req, res) => {
  try {
    const spaces = await Space.find()
      .populate({ path: "servicios", select: "name" })
      .populate({ path: "spacesType", select: "name" })
      .lean(); // Esto devuelve solo los datos planos (sin instancias de mongoose)

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

    console.log("Uploaded file:", req.file);

    // Creación del nuevo espacio
    const newSpace = new Space({
      ...req.body,
      aceptaReservas: aceptaReservas,
      servicios: req.body.servicios || [],
      spacesType: req.body.spacesType || [],
      imagen: req.file ? `/uploads/${req.file.filename}` : null,
      tiposReservas: aceptaReservas ? req.body.tiposReservas : [],
    });
    console.log('Archivo subido:', req.file); 

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

    // Buscar el espacio por ID y actualizarlo
    const updatedSpace = await Space.findByIdAndUpdate(
      id,
      {
        ...req.body,
        aceptaReservas: aceptaReservas,
        servicios: req.body.servicios || [],
        spacesType: req.body.spacesType || [],
        imagen: req.file ? `/uploads/${req.file.filename}` : null,
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

    // Eliminar archivo asociado si existe
    if (deletedSpace.imagen) {
      fs.unlink(path.resolve(`.${deletedSpace.imagen}`), (err) => {
        if (err) console.error("Error al eliminar la imagen:", err);
      });
    }

    res.json({ message: "Espacio eliminado con éxito", deletedSpace });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al eliminar el espacio", error: err.message });
  }
};
