import Space from '../models/Space.js';

// Obtener todos los espacios con filtrado, búsqueda, ordenamiento y paginado
export const getAllSpaces = async (req, res) => {
    try {
        const { search, sort, page = 1, limit = 10, minPrice, maxPrice } = req.query;

        // Construir filtro
        let filter = {};
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }
        if (minPrice || maxPrice) {
            filter.pricePerDay = {};
            if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
            if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
        }

        // Ordenamiento
        let sortBy = {};
        if (sort) {
            const [key, order] = sort.split(':');
            sortBy[key] = order === 'desc' ? -1 : 1;
        }

        // Paginado
        const skip = (page - 1) * limit;

        const spaces = await Space.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json(spaces);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener espacios', error: err.message });
    }
}

// Obtener espacio por ID
export const getSpaceById = async (req, res) => {
    try {
        const space = await Space.findById(req.params.id);
        if (!space) {
            return res.status(404).json({ message: 'Espacio no encontrado' });
        }
        res.status(200).json(space);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener espacio', error: err.message });
    }
}

// Crear nuevo espacio
export const createSpace = async (req, res) => {
    try {
        const space = await Space.create(req.body);
        res.status(201).json(space);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear espacio', error: err.message });
    }
}

// Actualizar espacio
export const updateSpace = async (req, res) => {
    try {
        const space = await Space.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!space) {
            return res.status(404).json({ message: 'Espacio no encontrado' });
        }
        res.status(200).json(space);
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar espacio', error: err.message });
    }
}

// Eliminar espacio
export const deleteSpace = async (req, res) => {
    try {
        const space = await Space.findByIdAndDelete(req.params.id);
        if (!space) {
            return res.status(404).json({ message: 'Espacio no encontrado' });
        }
        res.status(200).json({ message: 'Espacio eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar espacio', error: err.message });
    }
}
