import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);

// Página Principal
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>API Coworking</title>
            </head>
            <body>
                <h1>Bienvenido a la API de Coworking</h1>
                <p>Accede a los endpoints a través de las URLs proporcionadas.</p>
                <footer>
                    <p>Nombre Apellido</p>
                    <p>Nombre de la materia</p>
                    <p>Nombre del docente</p>
                    <p>Comisión</p>
                </footer>
            </body>
        </html>
    `);
});

export default app;
