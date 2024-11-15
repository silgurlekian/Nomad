import Coworking from "../models/CoworkingModel.js";

// Obtener todos los coworkings con filtrado, orden y paginado
export const getCoworkings = async (req, res) => {
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

    const coworkings = await Coworking.find(query)
      .populate("servicios", "name") // Popula el campo servicios con el nombre de los servicios
      .sort(sort)
      .limit(lim)
      .skip(skip);

    res.json(coworkings);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los coworkings", error });
  }
};

// Obtener un coworking por ID
export const getCoworkingById = async (req, res) => {
  try {
    const coworking = await Coworking.findById(req.params.id).populate(
      "servicios",
      "name"
    );

    if (coworking) {
      res.json(coworking);
    } else {
      res.status(404).json({ message: "Coworking no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el coworking", error });
  }
};

// Crear un nuevo coworking
export const createCoworking = async (req, res) => {
  try {
    const nuevoCoworking = new Coworking(req.body);
    const creado = await nuevoCoworking.save();
    res.status(201).json(creado);
  } catch (error) {
    res.status(400).json({ message: "Error al crear el coworking", error });
  }
};

// Actualizar un coworking existente
export const updateCoworking = async (req, res) => {
  try {
    const coworking = await Coworking.findById(req.params.id);
    if (coworking) {
      Object.assign(coworking, req.body);
      const actualizado = await coworking.save();
      res.json(actualizado);
    } else {
      res.status(404).json({ message: "Coworking no encontrado" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al actualizar el coworking", error });
  }
};

// Eliminar un coworking
export const deleteCoworking = async (req, res) => {
  const { id } = req.params;

  try {
    const coworking = await Coworking.findById(id);

    if (!coworking) {
      return res.status(404).json({ message: "Coworking no encontrado" });
    }

    await Coworking.deleteOne({ _id: id });
    res.status(200).json({ message: "Coworking eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el coworking", error });
  }
};
