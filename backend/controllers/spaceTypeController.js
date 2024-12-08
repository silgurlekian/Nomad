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
    res.status(500).json({
      message: "Error al obtener el tipo de espacio",
      error: error.message,
    });
  }
};

// Crear un nuevo tipo de espacio
export const createSpaceType = async (req, res) => {
  try {
    // Verificar si el usuario está logueado y si tiene rol 'admin'
    const token = req.headers.authorization?.split(" ")[1]; // Obtener token del header Authorization
    if (!token) {
      return res
        .status(401)
        .json({ message: "Debes estar logueado para realizar esta acción." });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Asegúrate de tener una clave secreta configurada
    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Debes ser administrador para agregar un tipo de espacio.",
      });
    }

    // Crear el nuevo tipo de espacio
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio." });
    }

    const newSpaceType = new SpaceType({ name: nombre }); // Usar "name" en lugar de "nombre"
    await newSpaceType.save();

    res.status(201).json(newSpaceType); // Devolver el tipo de espacio creado
  } catch (error) {
    console.error(error); // Para depuración
    res.status(500).json({
      message: "Error al crear el tipo de espacio",
      error: error.message,
    });
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

    res
      .status(200)
      .json({ message: "Tipo de espacio eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el tipo de espacio", error });
  }
};
