# TrueBlock - Plataforma Descentralizada contra la Desinformación

![TrueBlock Logo](https://img.shields.io/badge/TrueBlock-v1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node.js-v18+-brightgreen)
![Solidity](https://img.shields.io/badge/solidity-v0.8.19-orange)

TrueBlock es una plataforma descentralizada innovadora que combina IA, blockchain y participación comunitaria para combatir la desinformación en tiempo real. Utiliza oráculos especializados, modelos de lenguaje y validación comunitaria para crear un sistema robusto de verificación de noticias.

## 🌟 Características Principales

- **Validación Multicapa**: IA + Comunidad + Consenso Blockchain
- **Oráculos Especializados**: Detección de fake news, deepfakes, manipulación de imágenes
- **Sistema de Staking/Slashing**: Incentivos económicos alineados con la verdad
- **Almacenamiento Descentralizado**: IPFS para evidencias y contenido
- **API RESTful Completa**: Fácil integración con medios y plataformas
- **Certificados Verificables**: Badges y sellos de confianza

## 🚀 Tecnologías Utilizadas

### Backend

- **Node.js** + **Express.js**: API REST robusta
- **Ethers.js**: Interacción con blockchain
- **IPFS**: Almacenamiento descentralizado
- **OpenAI/Hugging Face**: Modelos de IA para análisis

### Blockchain

- **Solidity**: Smart contracts
- **Hardhat**: Framework de desarrollo
- **Base Network**: Blockchain principal (compatible con cualquier EVM)

### Infraestructura

- **Docker**: Containerización
- **Helmet + CORS**: Seguridad web
- **Rate Limiting**: Protección contra abuso

## 📋 Requisitos Previos

- Node.js 18.0.0 o superior
- npm o yarn
- Git

## 🔧 Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/trueblock-backend.git
cd trueblock-backend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
PORT=3000
NODE_ENV=development

# Blockchain
PRIVATE_KEY=tu_clave_privada
BASE_RPC_URL=https://mainnet.base.org
CONTRACT_ADDRESS=

# APIs de IA
OPENAI_API_KEY=tu_openai_key
HUGGINGFACE_API_KEY=tu_huggingface_key

# IPFS
IPFS_NODE_URL=http://localhost:5001
```

4. **Compilar contratos**

```bash
npm run compile-contracts
```

5. **Desplegar contrato (opcional - para desarrollo)**

```bash
npm run deploy
```

6. **Iniciar servidor**

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 🏗️ Arquitectura del Sistema

### Smart Contract Principal

- **TrueBlockValidator.sol**: Gestiona validaciones, staking y consenso
- **Funciones principales**:
  - `submitNews()`: Enviar noticia para validación
  - `registerOracle()`: Registrar oráculo de IA
  - `registerCommunityValidator()`: Registrar validador comunitario
  - `oracleValidate()`: Validación por oráculo
  - `communityValidate()`: Validación comunitaria

### API Endpoints

#### 🔍 Validación

```http
POST /api/validation/submit
GET /api/validation/:contentHash
POST /api/validation/:contentHash/vote
GET /api/validation/recent
GET /api/validation/stats
```

#### 🤖 Oráculos

```http
POST /api/oracle/register
POST /api/oracle/validate
GET /api/oracle/:walletAddress
GET /api/oracle/list/active
```

#### 💰 Staking

```http
POST /api/staking/validator/register
GET /api/staking/validator/:walletAddress
POST /api/staking/validator/:walletAddress/add-stake
GET /api/staking/rewards/:walletAddress
```

#### 📰 Noticias

```http
GET /api/news/feed
GET /api/news/trending
GET /api/news/search
GET /api/news/badge/:contentHash
POST /api/news/report
```

## 🔄 Flujo de Validación

1. **Envío de Contenido**

   - Usuario/medio envía URL o texto
   - Sistema extrae contenido y genera hash
   - Contenido se almacena en IPFS

2. **Análisis por Oráculos**

   - Oráculos especializados analizan según su expertise:
     - Fake news detection
     - Deepfake analysis
     - Image manipulation detection
     - Text consistency analysis

3. **Validación Comunitaria**

   - Periodistas, fact-checkers y expertos votan
   - Sistema de reputación pesa los votos

4. **Consenso Blockchain**

   - Smart contract calcula score final
   - Distribuye recompensas/castigos
   - Registra resultado inmutable

5. **Resultado Final**
   - Score 0-100 (% de veracidad)
   - Certificado verificable
   - Evidencias en IPFS

## 🎯 Casos de Uso

### Para Medios de Comunicación

```javascript
// Validar artículo antes de publicación
const response = await fetch("/api/validation/submit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: "https://ejemplo.com/noticia",
    title: "Título de la noticia",
  }),
});

const { contentHash } = await response.json();

// Obtener resultado
const validation = await fetch(`/api/validation/${contentHash}`);
const result = await validation.json();

console.log(`Veredicto: ${result.data.verdict.status}`);
console.log(`Confianza: ${result.data.verdict.confidence}%`);
```

### Para Plataformas Sociales

```javascript
// Integrar badge de verificación
const badgeHTML = await fetch(`/api/news/badge/${contentHash}?format=html`);
const badge = await badgeHTML.text();

// Insertar en UI
document.getElementById("verification-badge").innerHTML = badge;
```

### Para Investigadores

```javascript
// Exportar dataset público
const dataset = await fetch(
  "/api/news/export/dataset?format=json&dateFrom=2024-01-01"
);
const data = await dataset.json();

// Analizar patrones de desinformación
const fakeNews = data.filter((item) => item.finalScore < 30);
console.log(`Fake news detectadas: ${fakeNews.length}`);
```

## 🧪 Testing

```bash
# Ejecutar tests del smart contract
npx hardhat test

# Tests de integración
npm test

# Verificar cobertura
npm run coverage
```

## 🚀 Despliegue en Producción

### 1. Preparar entorno

```bash
# Variables de producción
NODE_ENV=production
BASE_RPC_URL=https://mainnet.base.org
```

### 2. Desplegar contrato

```bash
npm run deploy -- --network base
```

### 3. Configurar servidor

```bash
# PM2 para gestión de procesos
npm install -g pm2
pm2 start src/index.js --name "trueblock-api"
```

### 4. Configurar proxy reverso (Nginx)

```nginx
server {
    listen 80;
    server_name api.trueblock.app;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

## 📊 Monitoreo y Analytics

### Health Check

```bash
curl http://localhost:3000/health
```

### Métricas principales

- Total de validaciones procesadas
- Tasa de detección de fake news
- Tiempo promedio de validación
- Reputación de oráculos
- Actividad de validadores

## 🛡️ Seguridad

- **Rate Limiting**: Protección contra spam
- **Helmet.js**: Headers de seguridad
- **CORS**: Control de origen cruzado
- **Validación de firmas**: Autenticación criptográfica
- **Sanitización de datos**: Prevención de inyecciones

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

- **Documentación**: [docs.trueblock.app](https://docs.trueblock.app)
- **Discord**: [Comunidad TrueBlock](https://discord.gg/trueblock)
- **Email**: support@trueblock.app
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/trueblock-backend/issues)

## 🌟 Roadmap

- [ ] Integración con más modelos de IA
- [ ] Soporte multi-idioma
- [ ] Dashboard web completo
- [ ] API para desarrolladores
- [ ] Integración con redes sociales
- [ ] Sistema de recompensas mejorado
- [ ] Análisis de video en tiempo real

---

**TrueBlock** - Construyendo confianza digital mediante tecnología descentralizada 🌐✨
