require('dotenv').config();  // Cargar variables de entorno
const express = require('express');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');  // Logger HTTP para desarrollo
const cors = require('cors');  // Importar CORS

// Crear la aplicación Express
const app = express();

// Configurar seguridad con Helmet
app.use(helmet());

// Configurar CORS
app.use(cors({
  origin: 'http://127.0.0.1:8080',  // Permitir solicitudes desde este origen específico
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
}));

// Limitar las solicitudes a 100 por cada 10 minutos
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 100,
});
app.use(limiter);

// Usar Morgan para el logging de solicitudes HTTP en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware para parsear JSON
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Rutas de la API
app.use('/api/tasks', taskRoutes);

// Middleware para manejo de errores
app.use(errorHandler);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;  // Exportar app para pruebas unitarias o integración
