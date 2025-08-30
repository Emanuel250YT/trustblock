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
const truthboardRoutes = require('./routes/truthboard');
const filecoinRoutes = require('./routes/filecoin');
const confidentialRoutes = require('./routes/confidential');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://trueblock.app', 'https://truthboard.app']
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
    message: 'TrueBlock & TruthBoard API están funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      trueblock: 'Active - Decentralized news validation',
      truthboard: 'Active - Anonymous journalism with ZK on Citrea',
      filecoin: 'Active - Permanent storage & retrieval',
      confidential: 'Active - FHE encrypted validation with Zama'
    }
  });
});

// Rutas principales
app.use('/api/validation', validationRoutes);
app.use('/api/oracle', oracleRoutes);
app.use('/api/staking', stakingRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/truthboard', truthboardRoutes);
app.use('/api/filecoin', filecoinRoutes);
app.use('/api/confidential', confidentialRoutes);

// Ruta de información general
app.get('/api/info', (req, res) => {
  res.json({
    platforms: {
      trueblock: {
        name: 'TrueBlock API',
        description: 'Plataforma descentralizada para validación de noticias contra desinformación',
        blockchain: 'Ethereum/Polygon compatible',
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
      },
      truthboard: {
        name: 'TruthBoard API',
        description: 'Plataforma anónima de periodismo con pruebas ZK en Citrea Bitcoin rollup',
        blockchain: 'Citrea Bitcoin rollup',
        features: [
          'Publicación anónima con ZK proofs',
          'Validación comunitaria preservando privacidad',
          'Donaciones anónimas',
          'Anclaje en Bitcoin para inmutabilidad',
          'Resistencia a censura',
          'Archivado permanente en Filecoin'
        ],
        endpoints: {
          publish: '/api/truthboard/publish',
          validate: '/api/truthboard/validate',
          donate: '/api/truthboard/donate',
          stats: '/api/truthboard/stats',
          citrea: '/api/truthboard/citrea/status'
        }
      },
      confidential: {
        name: 'TruthBoard Confidential API',
        description: 'Validación confidencial con Fully Homomorphic Encryption de Zama',
        blockchain: 'Zama Protocol',
        features: [
          'Validación completamente confidencial',
          'Protección de identidad de validadores',
          'Operaciones homomórficas en votos cifrados',
          'Reputación cifrada preservando privacidad',
          'Pruebas criptográficas sin revelar datos'
        ],
        endpoints: {
          initialize: '/api/confidential/initialize',
          register: '/api/confidential/register-validator',
          validate: '/api/confidential/submit-validation',
          aggregate: '/api/confidential/aggregate-validations',
          reputation: '/api/confidential/update-reputation',
          stats: '/api/confidential/validator-stats/:address',
          info: '/api/confidential/service-info',
          verify: '/api/confidential/verify-proof'
        }
      },
      filecoin: {
        name: 'Filecoin Storage API',
        description: 'Almacenamiento permanente y recuperación de contenido validado',
        blockchain: 'Filecoin Virtual Machine (FVM)',
        features: [
          'Archivado automático de noticias validadas',
          'Almacenamiento permanente de evidencia',
          'Snapshots públicos inmutables',
          'Recuperación garantizada',
          'Políticas de financiamiento DAO'
        ],
        endpoints: {
          archive: '/api/filecoin/archive/news',
          evidence: '/api/filecoin/evidence/store',
          retrieve: '/api/filecoin/retrieve/:hash',
          statistics: '/api/filecoin/statistics',
          network: '/api/filecoin/network/status'
        }
      }
    },
    integrations: {
      'ZK + Filecoin': 'Anonymous journalism with permanent archival',
      'Citrea + Bitcoin': 'Bitcoin rollup with L1 settlement',
      'IPFS + FVM': 'Decentralized storage with smart contracts'
    },
    version: '1.0.0'
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
  console.log(`🚀 TrueBlock & TruthBoard API ejecutándose en puerto ${PORT}`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📖 Info API: http://localhost:${PORT}/api/info`);
  console.log(`\n🔍 TrueBlock: Validación descentralizada de noticias`);
  console.log(`🔒 TruthBoard: Periodismo anónimo con ZK en Citrea`);
});

module.exports = app;
