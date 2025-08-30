const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const validationRoutes = require('./routes/validation');
const oracleRoutes = require('./routes/oracle');
const stakingRoutes = require('./routes/staking');
const newsRoutes = require('./routes/news');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://trueblock.app']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiadas solicitudes, intenta de nuevo más tarde.'
});
app.use(limiter);

// Middleware de logging
app.use(morgan('combined'));

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'TrueBlock API está funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rutas principales
app.use('/api/validation', validationRoutes);
app.use('/api/oracle', oracleRoutes);
app.use('/api/staking', stakingRoutes);
app.use('/api/news', newsRoutes);

// Ruta de información general
app.get('/api/info', (req, res) => {
  res.json({
    name: 'TrueBlock API',
    description: 'Plataforma descentralizada para validación de noticias contra desinformación',
    version: '1.0.0',
    blockchain: 'Base Network',
    features: [
      'Validación multicapa con IA y comunidad',
      'Sistema de staking y slashing',
      'Oráculos especializados',
      'Almacenamiento descentralizado en IPFS',
      'Consenso on-chain'
    ],
    endpoints: {
      validation: '/api/validation',
      oracle: '/api/oracle',
      staking: '/api/staking',
      news: '/api/news'
    }
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      message: err.message
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Formato de datos inválido',
      message: 'ID o parámetro inválido'
    });
  }

  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`,
    suggestion: 'Revisa la documentación de la API en /api/info'
  });
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido, cerrando servidor...');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 TrueBlock API ejecutándose en puerto ${PORT}`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📖 Info API: http://localhost:${PORT}/api/info`);
});

module.exports = app;
