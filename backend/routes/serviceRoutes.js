import express from 'express';
import Service from '../models/serviceModel.js';

const router = express.Router();

// Crear un servicio
router.post('/create', async (req, res) => {
  const { name, description } = req.body;
  try {
    const newService = new Service({ name, description });
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ message: 'Error creando el servicio', err });
  }
});

// Obtener todos los servicios
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo los servicios', err });
  }
});

// Obtener un servicio por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo el servicio', err });
  }
});

// Actualizar un servicio
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.status(200).json(updatedService);
  } catch (err) {
    res.status(500).json({ message: 'Error actualizando el servicio', err });
  }
});

// Eliminar un servicio
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.status(200).json({ message: 'Servicio eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error eliminando el servicio', err });
  }
});

export default router;
