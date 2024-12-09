import Space from "../models/SpaceModel.js";
import multer from "multer";
import path from "path";

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

export const getSpaces = async (req, res) => {
  try {
    const spaces = await Space.find().populate("servicios", "name");
    res.json(spaces);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener los espacios", error: err.message });
  }
};

export const getSpaceById = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id).populate(
      "servicios",
      "name"
    );
    space
      ? res.json(space)
      : res.status(404).json({ message: "Espacio no encontrado" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener el espacio", error: err.message });
  }
};

export const createSpace = async (req, res) => {
  try {
    const tiposReservas = JSON.parse(req.body.tiposReservas || "{}");
    const newSpace = new Space({
      ...req.body,
      servicios: req.body.servicios || [],
      imagen: req.file?.path || null,
      tiposReservas: Object.keys(tiposReservas).filter(
        (key) => tiposReservas[key]
      ),
    });

    const savedSpace = await newSpace.save();
    res.status(201).json(savedSpace);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al crear el espacio", error: err.message });
  }
};

export const updateSpace = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);

    if (!space) {
      return res.status(404).json({ message: "Espacio no encontrado" });
    }

    const tiposReservas = JSON.parse(req.body.tiposReservas || "{}");

    const updatedData = {
      nombre: req.body.nombre || space.nombre,
      direccion: req.body.direccion || space.direccion,
      ciudad: req.body.ciudad || space.ciudad,
      website: req.body.website || space.website,
      precio: req.body.precio || space.precio,
      servicios: req.body.servicios || space.servicios,
      aceptaReservas:
        req.body.aceptaReservas !== undefined
          ? req.body.aceptaReservas
          : space.aceptaReservas,
      tiposReservas: Object.keys(tiposReservas).filter(
        (key) => tiposReservas[key]
      ),
      imagen: req.file ? req.file.path : space.imagen,
    };

    const updatedSpace = await Space.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(updatedSpace);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al actualizar el espacio", error: err.message });
  }
};

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
