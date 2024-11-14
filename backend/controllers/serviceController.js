// controllers/ServiceController.js
import Service from "../models/ServiceModel.js";

// Obtener todos los servicios
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los servicios",
      error: error.message,
    });
  }
};

// Obtener un servicio por ID
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }
    res.status(200).json(service);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el servicio", error: error.message });
  }
};

// Crear un nuevo servicio
export const createService = async (req, res) => {
  try {
    const newService = new Service(req.body);
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el servicio", error: error.message });
  }
};

// Actualizar un servicio por ID
export const updateService = async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el servicio",
      error: error.message,
    });
  }
};

// Eliminar un servicio por ID
export const deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findByIdAndDelete(serviceId);

    console.log("Servicio encontrado para eliminar:", service); // Verifica que el servicio fue encontrado

    if (!service) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }

    res.status(200).json({ message: "Servicio eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el servicio", error });
  }
};
