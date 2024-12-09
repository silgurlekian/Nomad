import Space from "../models/SpaceModel.js";
import multer from "multer";
import path from "path";

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const validTypes = /jpeg|jpg|png|gif/;
    const isValid =
      validTypes.test(file.mimetype) &&
      validTypes.test(path.extname(file.originalname).toLowerCase());
    isValid ? cb(null, true) : cb(new Error("Solo se permiten imágenes."));
  },
});

export const uploadSpaceImage = upload.single("imagen");

// Obtener todos los espacios
export const getSpaces = async (req, res) => {
  try {
    const spaces = await Space.find()
      .populate({ path: "servicios", select: "name" }) // Poblamos los servicios, seleccionando solo el nombre
      .populate({ path: "spacesType", select: "name" }) // Poblamos los tipos de espacio, seleccionando solo el nombre
      .lean(); // Esto devuelve solo los datos planos (sin instancias de mongoose)

    console.log("Spaces with populated data:", spaces); // Verificamos los datos poblados

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
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Creación del nuevo espacio
    const newSpace = new Space({
      ...req.body,
      servicios: req.body.servicios || [],
      spacesType: req.body.spacesType || [],
      imagen: req.file ? req.file.path : null, 
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
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Buscar el espacio por ID y actualizarlo
    const updatedSpace = await Space.findByIdAndUpdate(
      id,
      {
        ...req.body,
        servicios: req.body.servicios || [],
        spacesType: req.body.spacesType || [],
        imagen: req.file ? req.file.path : undefined, // Solo actualizar la imagen si se proporciona una nueva
      },
      { new: true } // Devuelve el documento actualizado
    );

    if (!updatedSpace) {
      return res.status(404).json({ error: "Espacio no encontrado." });
    }

    res.status(200).json(updatedSpace);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar el espacio", error: err.message });
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
    res.status(500).json({ message: "Error al eliminar el espacio", error: err.message });
  }
};