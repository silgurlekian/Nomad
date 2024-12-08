import SpaceType from "../models/spaceTypeModel.js";

// Obtener todos los tipos de espacios
export const getAllSpacesType = async (req, res) => {
  try {
    const spacesType = await SpaceType.find();
    res.status(200).json(spacesType);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los tipos de espacios",
      error: error.message,
    });
  }
};

// Obtener un tipo de espacio por ID
export const getSpaceTypeById = async (req, res) => {
  try {
    const spaceType = await SpaceType.findById(req.params.id);
    if (!spaceType) {
      return res.status(404).json({ message: "Tipo de espacio no encontrado" });
    }
    res.status(200).json(spaceType);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el tipo de espacio", error: error.message });
  }
};

// Crear un nuevo tipo
export const createSpaceType = async (req, res) => {
  try {
    const newSpaceType = new SpaceType(req.body);
    await newSpaceType.save();
    res.status(201).json(newSpaceType);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el tipo de espacio", error: error.message });
  }
};

// Actualizar un tipo de espacio por ID
export const updateSpaceType = async (req, res) => {
  try {
    const updatedSpaceType = await SpaceType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSpaceType) {
      return res.status(404).json({ message: "Tipo de espacio no encontrado" });
    }
    res.status(200).json(updatedSpaceType);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el tipo de espacio",
      error: error.message,
    });
  }
};

// Eliminar un tipo de espacio por ID
export const deleteSpaceType = async (req, res) => {
  try {
    const spaceTypeId = req.params.id;
    const spaceType = await SpaceType.findByIdAndDelete(spaceTypeId);

    console.log("Tipo de espacio encontrado para eliminar:", spaceType); // Verifica que el tipo fue encontrado

    if (!spaceType) {
      return res.status(404).json({ message: "Tipo de espacio no encontrado" });
    }

    res.status(200).json({ message: "Tipo de espacio eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el tipo de espacio", error });
  }
};
