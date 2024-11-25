import Space from "../models/SpaceModel.js";
import multer from "multer";
import path from "path";

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: Solo se permiten archivos de imagen!"));
  },
});

// Obtener todos los espacios
export const getSpaces = async (req, res) => {
  try {
    const spaces = await Space.find().populate("servicios", "name"); // Obtiene todos los espacios
    res.json(spaces);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los espacios", error });
  }
};

// Obtener un espacio por ID
export const getSpaceById = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id).populate(
      "servicios",
      "name"
    );
    if (space) {
      res.json(space);
    } else {
      res.status(404).json({ message: "Espacio no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el espacio", error });
  }
};

// Crear un nuevo espacio
export const createSpace = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No se ha subido ninguna imagen." });
    }

    const nuevoSpace = new Space({
      ...req.body,
      imagen: req.file.path, // Guarda la ruta de la imagen
    });

    const creado = await nuevoSpace.save();
    res.status(201).json(creado);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error al crear el espacio", error });
  }
};

// Actualizar un espacio existente
export const updateSpace = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);

    if (space) {
      Object.assign(space, req.body);
      if (req.file) {
        space.imagen = req.file.path; // Actualiza la imagen si se subió una nueva
      }

      const actualizado = await space.save();
      res.json(actualizado);
    } else {
      res.status(404).json({ message: "Espacio no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar el espacio", error });
  }
};

// Eliminar un espacio
export const deleteSpace = async (req, res) => {
  const { id } = req.params;

  try {
    const space = await Space.findById(id);

    if (!space) {
      return res.status(404).json({ message: "Espacio no encontrado" });
    }

    await Space.deleteOne({ _id: id });
    res.status(200).json({ message: "Espacio eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el espacio", error });
  }
};
