import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Registro de Usuario
export const registerUser = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { nombre, email, password } = req.body;
    try {
        const existeUsuario = await User.findOne({ email });
        if (existeUsuario) {
            return res.status(400).json({ message: "El correo electrónico ya se encuentra registrado." });
        }

        // Crear usuario con rol 'user'
        const usuario = await User.create({ nombre, email, password });
        res.status(201).json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarToken(usuario._id),
            role: usuario.role,
            createdAt: usuario.createdAt
        });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar el usuario", error });
    }
};

// Login de Usuario
export const loginUser = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { email, password } = req.body;
    try {
        const usuario = await User.findOne({ email });
        if (usuario) {
            const isPasswordValid = await usuario.matchPassword(password);
            if (isPasswordValid) {
                res.json({
                    _id: usuario._id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    token: generarToken(usuario._id),
                    role: usuario.role // Incluir rol en la respuesta
                });
            } else {
                res.status(401).json({ message: "Credenciales inválidas" });
            }
        } else {
            res.status(401).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al autenticar el usuario", error });
    }
};

export const verifyResetToken = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: "Token inválido o expirado." });
        }

        res.status(200).json({ message: "Token válido, puedes restablecer tu contraseña." });
    } catch (error) {
        res.status(500).json({ message: "Hubo un error al verificar el token." });
    }
};

export const resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    const token = req.params.token;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Verificar si el token no ha expirado
        });

        if (!user) {
            return res.status(400).json({ message: "Token inválido o expirado." });
        }

        // Actualizar la contraseña del usuario
        user.password = newPassword; // La contraseña se encriptará automáticamente al guardarla
        user.resetPasswordToken = undefined; // Limpiar el token
        user.resetPasswordExpires = undefined; // Limpiar la fecha de expiración
        await user.save();

        res.status(200).json({ message: "Contraseña restablecida con éxito." });
    } catch (error) {
        res.status(500).json({ message: "Hubo un error al restablecer la contraseña." });
    }
};

// Función para manejar la solicitud de restablecimiento de contraseña
export const resetPasswordRequest = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Generar un token único y establecer su expiración
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Expira en 1 hora
        await user.save();

        // Configuración del transportador SMTP
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: email,
            subject: 'Restablecer contraseña',
            text: `Por favor haz clic en el siguiente enlace para restablecer tu contraseña: 
                   https://nomad.com.ar/pwa/reset-password/${token}`, 
        };

        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ message: "Se ha enviado un enlace para restablecer tu contraseña." });
    } catch (error) {
        res.status(500).json({ message: "Hubo un error al procesar tu solicitud." });
    }
};