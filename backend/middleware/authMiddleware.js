import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

export const protect = async (req, res, next) => {
    let token;

    // Verifica si el token se encuentra en los headers
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extrae el token del header Authorization
            token = req.headers.authorization.split(' ')[1];

            // Verifica el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Agrega el usuario decodificado a la solicitud
            req.user = await User.findById(decoded.id).select('-password');
            
            next(); // Llama al siguiente middleware si el token es válido
        } catch (error) {
            // En caso de error (token inválido o expirado)
            res.status(401).json({ message: 'No autorizado, token inválido' });
        }
    }

    // Si no se encuentra el token, retorna un error
    if (!token) {
        return res.status(401).json({ message: 'No autorizado, sin token' });
    }
};

// Middleware para verificar si el usuario es admin
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // El usuario es admin, permite continuar
    } else {
        res.status(403).json({ message: 'Acceso denegado. Se requiere rol admin.' }); // Acceso denegado
    }
};