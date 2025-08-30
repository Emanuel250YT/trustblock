/**
 * Middleware de diagnóstico para debugging de problemas de proxy y rate limiting
 */

const debugProxy = (req, res, next) => {
  // Solo en desarrollo o cuando se especifica explícitamente
  if (process.env.NODE_ENV !== 'development' && !process.env.DEBUG_PROXY) {
    return next();
  }

  const clientInfo = {
    originalIP: req.connection.remoteAddress,
    expressIP: req.ip,
    ips: req.ips,
    cloudflareIP: req.get('CF-Connecting-IP'),
    realClientIP: req.get('CF-Connecting-IP') || req.get('X-Forwarded-For')?.split(',')[0]?.trim(),
    headers: {
      // Cloudflare headers
      'cf-connecting-ip': req.get('CF-Connecting-IP'),
      'cf-ray': req.get('CF-Ray'),
      'cf-visitor': req.get('CF-Visitor'),
      'cf-country': req.get('CF-IPCountry'),
      
      // Standard proxy headers
      'x-forwarded-for': req.get('X-Forwarded-For'),
      'x-real-ip': req.get('X-Real-IP'),
      'x-forwarded-proto': req.get('X-Forwarded-Proto'),
      'x-forwarded-host': req.get('X-Forwarded-Host'),
      'x-client-ip': req.get('X-Client-IP'),
      
      'user-agent': req.get('User-Agent')
    },
    trustProxy: req.app.get('trust proxy'),
    method: req.method,
    url: req.originalUrl,
    isCloudflare: !!req.get('CF-Ray'),
    country: req.get('CF-IPCountry')
  };

  console.log(`🔍 [DEBUG PROXY] ${req.method} ${req.originalUrl}:`, JSON.stringify(clientInfo, null, 2));
  
  next();
};

const rateLimitInfo = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Solo loggear si es una respuesta de rate limit
    if (res.statusCode === 429) {
      console.warn(`⚠️  [RATE LIMIT] IP: ${req.ip}, Endpoint: ${req.originalUrl}, Headers:`, {
        'x-ratelimit-limit': res.get('X-RateLimit-Limit'),
        'x-ratelimit-remaining': res.get('X-RateLimit-Remaining'),
        'x-ratelimit-reset': res.get('X-RateLimit-Reset'),
        'retry-after': res.get('Retry-After')
      });
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// Middleware para validar configuración de proxy
const validateProxyConfig = (req, res, next) => {
  const trustProxy = req.app.get('trust proxy');
  const hasForwardedHeaders = req.get('X-Forwarded-For') || req.get('X-Real-IP');
  const hasCloudflareHeaders = req.get('CF-Connecting-IP') || req.get('CF-Ray');
  
  if (hasForwardedHeaders && !trustProxy) {
    console.warn(`⚠️  [PROXY WARNING] Headers de proxy detectados pero trust proxy está deshabilitado.`);
    console.warn(`Headers encontrados: X-Forwarded-For: ${req.get('X-Forwarded-For')}, X-Real-IP: ${req.get('X-Real-IP')}`);
    if (hasCloudflareHeaders) {
      console.warn(`CF-Connecting-IP: ${req.get('CF-Connecting-IP')}, CF-Ray: ${req.get('CF-Ray')}`);
    }
    console.warn(`Considera habilitar trust proxy con: app.set('trust proxy', 2) para Cloudflare + Nginx`);
  }
  
  // Validar que estemos obteniendo la IP correcta con Cloudflare
  if (hasCloudflareHeaders && req.ip === req.connection.remoteAddress) {
    console.warn(`⚠️  [CLOUDFLARE WARNING] Detectado Cloudflare pero usando IP de conexión directa.`);
    console.warn(`Asegúrate de que trust proxy esté configurado correctamente.`);
  }
  
  next();
};

// Endpoint para testing de configuración de proxy
const createProxyTestEndpoint = (app) => {
  app.get('/debug/proxy-info', (req, res) => {
    if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_PROXY) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json({
      success: true,
      proxyInfo: {
        trustProxy: req.app.get('trust proxy'),
        clientIP: {
          express: req.ip,
          connection: req.connection.remoteAddress,
          socket: req.socket.remoteAddress,
          ips: req.ips,
          cloudflare: req.get('CF-Connecting-IP'),
          realClient: req.get('CF-Connecting-IP') || req.get('X-Forwarded-For')?.split(',')[0]?.trim()
        },
        headers: {
          // Cloudflare específicos
          'cf-connecting-ip': req.get('CF-Connecting-IP'),
          'cf-ray': req.get('CF-Ray'),
          'cf-visitor': req.get('CF-Visitor'),
          'cf-country': req.get('CF-IPCountry'),
          'cf-ipcity': req.get('CF-IPCity'),
          
          // Estándar
          'x-forwarded-for': req.get('X-Forwarded-For'),
          'x-real-ip': req.get('X-Real-IP'),
          'x-forwarded-proto': req.get('X-Forwarded-Proto'),
          'x-client-ip': req.get('X-Client-IP')
        },
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          TRUST_PROXY: process.env.TRUST_PROXY,
          PROXY_COUNT: process.env.PROXY_COUNT,
          DEBUG_PROXY: process.env.DEBUG_PROXY
        },
        cloudflareInfo: {
          isCloudflare: !!req.get('CF-Ray'),
          country: req.get('CF-IPCountry'),
          city: req.get('CF-IPCity'),
          ray: req.get('CF-Ray')
        }
      }
    });
  });
};

module.exports = {
  debugProxy,
  rateLimitInfo,
  validateProxyConfig,
  createProxyTestEndpoint
};
