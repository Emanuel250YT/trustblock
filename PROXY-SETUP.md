# Configuración de Proxy para TrueBlock API

## Arquitectura de Red

```
Internet → Cloudflare → Nginx → TrueBlock API (Node.js)
```

## Configuración Actual

### Variables de Entorno Requeridas

```env
# Habilitar trust proxy para múltiples proxies
TRUST_PROXY=true
# Número de proxies: Cloudflare (1) + Nginx (1) = 2
PROXY_COUNT=2
# Habilitar debugging en desarrollo
DEBUG_PROXY=false
```

### Express Trust Proxy

La aplicación está configurada para confiar en **2 proxies**:
1. **Cloudflare** - CDN/WAF global
2. **Nginx** - Proxy inverso local

## Headers Importantes

### Cloudflare Headers
- `CF-Connecting-IP`: IP real del cliente
- `CF-Ray`: ID único de la petición
- `CF-IPCountry`: País del cliente
- `CF-Visitor`: Información del protocolo

### Nginx Headers
- `X-Forwarded-For`: Cadena de IPs
- `X-Real-IP`: IP del cliente
- `X-Forwarded-Proto`: Protocolo (http/https)
- `X-Forwarded-Host`: Host original

## Rate Limiting

### Estrategia de IP Detection

1. **CF-Connecting-IP** (prioridad alta) - IP real de Cloudflare
2. **X-Forwarded-For** (primera IP) - Fallback
3. **X-Real-IP** - Backup de Nginx
4. **req.ip** - Express con trust proxy

### Limitaciones por Endpoint

- **General**: 100 req/15min
- **Validación**: 10 req/hora
- **Staking**: 5 req/hora
- **Publicación**: 5 req/día
- **Búsqueda**: 50 req/minuto

## Testing de Configuración

### Endpoint de Debug

```bash
GET /debug/proxy-info
```

Respuesta esperada:
```json
{
  "proxyInfo": {
    "trustProxy": 2,
    "clientIP": {
      "express": "real.client.ip",
      "cloudflare": "real.client.ip",
      "realClient": "real.client.ip"
    },
    "cloudflareInfo": {
      "isCloudflare": true,
      "country": "US",
      "ray": "1234567890abcdef"
    }
  }
}
```

### Verificación Manual

```bash
# Verificar headers en desarrollo
curl -H "CF-Connecting-IP: 1.2.3.4" \
     -H "X-Forwarded-For: 1.2.3.4,127.0.0.1" \
     http://localhost:3000/debug/proxy-info
```

## Configuración de Nginx

Usar el archivo `nginx.conf` incluido que configura:

- ✅ Headers de proxy correctos
- ✅ Rate limiting a nivel de Nginx
- ✅ SSL/TLS seguro
- ✅ Timeouts apropiados
- ✅ Logging detallado

### Instalación

```bash
# Copiar configuración
sudo cp nginx.conf /etc/nginx/sites-available/trueblock
sudo ln -s /etc/nginx/sites-available/trueblock /etc/nginx/sites-enabled/

# Validar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

## Cloudflare Configuration

### SSL/TLS Settings
- **Modo**: Full (strict)
- **Min TLS**: 1.2
- **HSTS**: Habilitado

### Security Settings
- **Rate Limiting**: Configurar límites adicionales
- **Bot Fight Mode**: Habilitado
- **DDoS Protection**: Automático

### Page Rules
```
api.trueblock.app/health*
- Cache Level: No Cache

api.trueblock.app/api/*
- Cache Level: No Cache
- Security Level: High
```

## Troubleshooting

### Error: ValidationError X-Forwarded-For header

**Síntoma**: Error de rate limiting con trust proxy false

**Solución**:
```env
TRUST_PROXY=true
PROXY_COUNT=2
```

### IP Incorrecta en Logs

**Síntoma**: Viendo IP de Nginx en lugar de IP real

**Verificar**:
1. `trust proxy` configurado correctamente
2. Headers de Nginx enviando `CF-Connecting-IP`
3. Cloudflare pasando headers correctos

### Rate Limit Demasiado Estricto

**Ajuste temporal**:
```env
NODE_ENV=development  # Usa limits más altos
DEBUG_PROXY=true      # Ver detalles en logs
```

## Monitoreo

### Logs a Revistar

```bash
# Logs de aplicación
tail -f logs/app.log | grep "RATE LIMIT"

# Logs de Nginx
tail -f /var/log/nginx/trueblock-access.log
tail -f /var/log/nginx/trueblock-error.log

# Logs de sistema
journalctl -u nginx -f
```

### Métricas Importantes

- **Rate limit violations**: Monitorear picos
- **Response times**: Detectar cuellos de botella
- **Error rates**: 429 vs 500 errors
- **Geographic distribution**: Via Cloudflare Analytics

## Seguridad

### Headers de Seguridad (Nginx)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security`

### Rate Limiting Defense
- **Application level**: Express rate limit
- **Proxy level**: Nginx rate limit
- **CDN level**: Cloudflare rate limit

### IP Whitelisting (Opcional)

Para APIs internas:
```nginx
# En Nginx
allow 10.0.0.0/8;    # Red interna
allow 127.0.0.1;     # Localhost
deny all;
```

## Production Checklist

- [ ] `TRUST_PROXY=true` en producción
- [ ] `PROXY_COUNT=2` configurado
- [ ] Nginx con headers correctos
- [ ] Cloudflare SSL en modo Full (strict)
- [ ] Rate limits apropiados para tu uso
- [ ] Logs configurados y rotando
- [ ] Monitoreo de métricas activo
- [ ] `DEBUG_PROXY=false` en producción
