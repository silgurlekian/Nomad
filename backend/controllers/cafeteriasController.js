import Cafeteria from "../models/Cafeteria.js";

// Obtener todas las cafeterías con filtrado, orden y paginado
export const getCafeterias = async (req, res) => {
  try {
    const { nombre, ciudad, ordenarPor, orden, limite, pagina } = req.query;
    const query = {};

    // Filtrado por nombre
    if (nombre) {
      query.nombre = { $regex: nombre, $options: "i" };
    }

    // Filtrado por ciudad
    if (ciudad) {
      query.ciudad = ciudad;
    }

    // Ordenamiento
    let sort = {};
    if (ordenarPor) {
      sort[ordenarPor] = orden === "desc" ? -1 : 1;
    }

    // Paginado
    const lim = parseInt(limite) || 10;
    const pag = parseInt(pagina) || 1;
    const skip = (pag - 1) * lim;

    const cafeterias = await Cafeteria.find(query)
      .sort(sort)
      .limit(lim)
      .skip(skip);

    res.json(cafeterias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las cafeterías", error });
  }
};

// Obtener una cafetería por ID
export const getCafeteriaById = async (req, res) => {
  try {
    const cafeteria = await Cafeteria.findById(req.params.id);
    if (cafeteria) {
      res.json(cafeteria);
    } else {
      res.status(404).json({ message: "Cafetería no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la cafetería", error });
  }
};

// Crear una nueva cafetería
export const createCafeteria = async (req, res) => {
  try {
    const nuevaCafeteria = new Cafeteria(req.body);
    const creada = await nuevaCafeteria.save();
    res.status(201).json(creada);
  } catch (error) {
    res.status(400).json({ message: "Error al crear la cafetería", error });
  }
};

// Actualizar una cafetería existente
export const updateCafeteria = async (req, res) => {
  try {
    const cafeteria = await Cafeteria.findById(req.params.id);
    if (cafeteria) {
      Object.assign(cafeteria, req.body);
      const actualizada = await cafeteria.save();
      res.json(actualizada);
    } else {
      res.status(404).json({ message: "Cafetería no encontrada" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al actualizar la cafetería", error });
  }
};

// Eliminar una cafetería
export const deleteCafeteria = async (req, res) => {
  const { id } = req.params;

  try {
    const cafeteria = await Cafeteria.findById(id);

    if (!cafeteria) {
      return res.status(404).json({ message: "Cafetería no encontrada" });
    }

    await Cafeteria.deleteOne({ _id: id });
    res.status(200).json({ message: "Cafetería eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la cafetería", error });
  }
};
