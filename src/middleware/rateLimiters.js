const rateLimit = require('express-rate-limit');

/**
 * Configuración de rate limiters para diferentes tipos de operaciones
 * Estos limiters ayudan a prevenir abuso y asegurar fair usage
 */

// Configuración base común
const baseConfig = {
  standardHeaders: true, // Enviar info de rate limit en headers
  legacyHeaders: false, // Deshabilitar headers legacy
  keyGenerator: (req) => {
    // Prioridad para obtener IP real con Cloudflare + Nginx
    const ip = req.get('CF-Connecting-IP') ||     // IP real de Cloudflare
               req.get('X-Forwarded-For')?.split(',')[0]?.trim() || // Primera IP en la cadena
               req.get('X-Real-IP') ||            // IP del proxy
               req.ip ||                          // IP de Express (considera trust proxy)
               req.connection.remoteAddress ||    // IP de la conexión
               'unknown';
    
    // Log para debugging en desarrollo
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROXY) {
      console.log(`🔍 [RATE LIMIT] Using IP: ${ip} for ${req.originalUrl}`);
    }
    
    return ip;
  },
  handler: (req, res, next, options) => {
    const clientIP = req.get('CF-Connecting-IP') || req.ip;
    console.warn(`⚠️  [RATE LIMIT] IP: ${clientIP}, endpoint: ${req.originalUrl}, User-Agent: ${req.get('User-Agent')}`);
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: options.message?.message || 'Too many requests',
      retryAfter: options.retryAfter || Math.ceil(options.windowMs / 1000),
      endpoint: req.originalUrl,
      clientIP: clientIP // Solo mostrar en desarrollo
    });
  }
};

// Rate limiter general para toda la API
const generalLimiter = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: {
    error: 'General rate limit exceeded',
    message: 'Demasiadas solicitudes, intenta de nuevo más tarde.'
  }
});

// Rate limiter para operaciones de validación
const validationLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máximo 10 validaciones por hora
  message: {
    error: 'Validation rate limit exceeded',
    message: 'Máximo 10 validaciones por hora. Intenta más tarde.'
  },
  skip: (req) => {
    // Permitir consultas GET sin limitación estricta
    return req.method === 'GET';
  }
});

// Rate limiter para operaciones de staking
const stakingLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // máximo 5 operaciones de staking por hora
  message: {
    error: 'Staking rate limit exceeded',
    message: 'Máximo 5 operaciones de staking por hora.'
  },
  skip: (req) => {
    // Permitir consultas de estado sin limitación
    return req.method === 'GET' && req.originalUrl.includes('/status');
  }
});

// Rate limiter para publicaciones en TruthBoard
const publishLimiter = rateLimit({
  ...baseConfig,
  windowMs: 24 * 60 * 60 * 1000, // 24 horas
  max: 5, // máximo 5 publicaciones por día
  message: {
    error: 'Publishing rate limit exceeded',
    message: 'Máximo 5 artículos por día en TruthBoard.'
  },
  skip: (req) => {
    // Solo aplicar a operaciones POST de publicación
    return req.method !== 'POST' || !req.originalUrl.includes('/publish');
  }
});

// Rate limiter para búsquedas
const searchLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 1000, // 1 minuto
  max: 50, // máximo 50 búsquedas por minuto
  message: {
    error: 'Search rate limit exceeded',
    message: 'Máximo 50 búsquedas por minuto.'
  }
});

// Rate limiter para registro de oráculos y validadores
const registrationLimiter = rateLimit({
  ...baseConfig,
  windowMs: 24 * 60 * 60 * 1000, // 24 horas
  max: 3, // máximo 3 registros por día
  message: {
    error: 'Registration rate limit exceeded',
    message: 'Máximo 3 registros por día.'
  },
  skip: (req) => {
    // Solo aplicar a operaciones de registro
    return !req.originalUrl.includes('/register');
  }
});

// Rate limiter para operaciones de Filecoin (más costosas)
const filecoinLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // máximo 20 operaciones por hora
  message: {
    error: 'Filecoin rate limit exceeded',
    message: 'Máximo 20 operaciones de Filecoin por hora.'
  },
  skip: (req) => {
    // Permitir consultas GET
    return req.method === 'GET';
  }
});

// Rate limiter para operaciones confidenciales FHE
const confidentialLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 15, // máximo 15 operaciones FHE por hora (son costosas computacionalmente)
  message: {
    error: 'Confidential operations rate limit exceeded',
    message: 'Máximo 15 operaciones confidenciales por hora.'
  }
});

// Rate limiter especial para desarrollo (más permisivo)
const developmentLimiter = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // mucho más permisivo en desarrollo
  message: {
    error: 'Development rate limit exceeded',
    message: 'Límite de desarrollo excedido.'
  }
});

// Función para crear rate limiter personalizado
const createCustomLimiter = (options) => {
  return rateLimit({
    ...baseConfig,
    ...options
  });
};

module.exports = {
  generalLimiter,
  validationLimiter,
  stakingLimiter,
  publishLimiter,
  searchLimiter,
  registrationLimiter,
  filecoinLimiter,
  confidentialLimiter,
  developmentLimiter,
  createCustomLimiter
};
