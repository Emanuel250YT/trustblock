# TrueBlock & TruthBoard - Ecosistema Completo contra la Desinformación

![TrueBlock Logo](https://img.shields.io/badge/TrueBlock-v1.0.0-blue)
![TruthBoard](https://img.shields.io/badge/TruthBoard-v1.0.0-purple)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node.js-v18+-brightgreen)
![Solidity](https://img.shields.io/badge/solidity-v0.8.19-orange)
![Zama FHE](https://img.shields.io/badge/Zama-FHE-red)
![Citrea](https://img.shields.io/badge/Citrea-Bitcoin%20L2-orange)
![Filecoin](https://img.shields.io/badge/Filecoin-Storage-blue)

**TrueBlock & TruthBoard** es un ecosistema descentralizado completo que combina múltiples tecnologías blockchain, IA y criptografía avanzada para combatir la desinformación y promover el periodismo anónimo. Incluye validación multicapa, oráculos de IA, sistemas de staking/slashing, Zero-Knowledge proofs, y almacenamiento permanente descentralizado.

## 🌟 Plataformas del Ecosistema

### 🔍 TrueBlock (Validación Pública)

- **Validación Multicapa**: IA + Comunidad + Consenso Blockchain
- **Oráculos Especializados**: Detección de fake news, deepfakes, manipulación de imágenes
- **Sistema de Staking/Slashing**: Incentivos económicos alineados con la verdad
- **API RESTful Completa**: Fácil integración con medios y plataformas
- **Certificados Verificables**: Badges y sellos de confianza

### 🔒 TruthBoard (Periodismo Anónimo)

- **Publicación Anónima**: Zero-Knowledge proofs para privacidad total
- **Validación Preservando Privacidad**: Sin revelar identidades
- **Donaciones Anónimas**: Soporte financiero confidencial a periodistas
- **Anclaje en Bitcoin**: Via Citrea rollup para máxima inmutabilidad
- **Resistencia a Censura**: Infraestructura descentralizada

### 🔐 TruthBoard Confidential (FHE)

- **Cifrado Homomórfico Completo**: Validación sin descifrar datos
- **Operaciones Confidenciales**: Cálculos sobre datos cifrados
- **Zama Protocol**: Tecnología FHE de última generación
- **Privacidad Absoluta**: Identidades y votos completamente protegidos

### 🗃️ Almacenamiento Permanente

- **Filecoin Network**: Almacenamiento descentralizado permanente
- **IPFS Integration**: Distribución de contenido eficiente
- **Lighthouse Storage**: Interface simplificada para Filecoin
- **Evidencias Inmutables**: Pruebas permanentes en blockchain

### 📱 Mini-App (Base Network)

- **Interface Simplificada**: Para usuarios casuales
- **Gamificación**: Sistema de reputación y leaderboards
- **Optimizada para Mobile**: Perfecta para Base App
- **Votación Comunitaria**: Participación rápida y divertida

## 🚀 Tecnologías Utilizadas

### Backend y APIs

- **Node.js** + **Express.js**: API REST robusta con múltiples endpoints
- **Ethers.js**: Interacción con múltiples blockchains
- **IPFS**: Almacenamiento descentralizado de contenido
- **OpenAI/Hugging Face**: Modelos de IA para análisis
- **Lighthouse SDK**: Interface para Filecoin storage
- **Zama Relayer SDK**: Integración con FHE infrastructure

### Blockchain Networks

- **Ethereum Sepolia**: Red principal para TrueBlock
- **Citrea Bitcoin L2**: Rollup de Bitcoin para TruthBoard
- **Zama FHEVM**: Blockchain con soporte FHE nativo
- **Filecoin Mainnet**: Almacenamiento permanente descentralizado
- **Base Network**: Mini-app y aplicaciones simplificadas

### Smart Contracts

- **Solidity**: Contratos principales del ecosistema
- **Hardhat**: Framework de desarrollo y testing
- **FHEVM Integration**: Soporte para operaciones cifradas
- **Multi-network Deploy**: Scripts de despliegue automatizado

### Criptografía Avanzada

- **Zero-Knowledge Proofs**: Para privacidad en TruthBoard
- **Fully Homomorphic Encryption**: Validación confidencial
- **TFHE Algorithm**: Cifrado homomórfico optimizado
- **Cryptographic Signatures**: Autenticación de oráculos

### Infraestructura

- **Docker**: Containerización para deployment
- **Nginx**: Proxy reverso y load balancing
- **PM2**: Gestión de procesos en producción
- **Rate Limiting**: Protección contra abuso
- **Helmet + CORS**: Seguridad web avanzada

## 📋 Requisitos Previos

- Node.js 18.0.0 o superior
- npm o yarn
- Git
- Metamask u otro wallet compatible
- Cuentas en proveedores (opcional):
  - OpenAI API (para oráculos IA)
  - Lighthouse/Filecoin (para almacenamiento)
  - Zama Account (para FHE features)

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
# Environment Configuration
NODE_ENV=development
PORT=3000

# Proxy Configuration (for rate limiting behind load balancers)
TRUST_PROXY=true
PROXY_COUNT=2
DEBUG_PROXY=false

# Database
DATABASE_URL=mongodb://localhost:27017/trustblock

# Blockchain - TrueBlock (original)
PRIVATE_KEY=
CONTRACT_ADDRESS=
BLOCKCHAIN_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
BASE_RPC_URL=https://mainnet.base.org
BLOCKCHAIN_NETWORK=sepolia

# Citrea Bitcoin Rollup - TruthBoard
CITREA_RPC_URL=https://rpc.testnet.citrea.xyz
CITREA_MAINNET_RPC_URL=https://rpc.citrea.xyz
CITREA_PRIVATE_KEY=
TRUTHBOARD_CONTRACT_ADDRESS=


# TruthBoard Confidential - Zama FHE
TRUTHBOARD_CONFIDENTIAL_CONTRACT_ADDRESS=
ZAMA_RELAYER_URL=https://relayer.zama.ai
ZAMA_FHEVM_ADDRESS=0x000000000000000000000000000000000000005d

# Lighthouse.storage Configuration (Filecoin Storage via SDK)
LIGHTHOUSE_API_KEY=
LIGHTHOUSE_BASE_URL=https://node.lighthouse.storage
LIGHTHOUSE_GATEWAY_URL=https://gateway.lighthouse.storage/ipfs
LIGHTHOUSE_MAX_FILE_SIZE=104857600
LIGHTHOUSE_DEFAULT_DURATION=2592000



# API Keys (solo lo necesario)
AI_ORACLE_API_KEY=your_openai_api_key_here

# Security
JWT_SECRET=your_jwt_secret_here

# ZK Configuration
ZK_CIRCUIT_PATH=./circuits
ZK_PROVING_KEY_PATH=./proving_keys
ZK_VERIFICATION_KEY_PATH=./verification_keys
```

4. **Compilar contratos**

```bash
npm run compile-contracts
```

5. **Desplegar contratos (opcional - para desarrollo)**

```bash
# TrueBlock en Ethereum Sepolia
npm run deploy

# TruthBoard en Citrea
npm run deploy:truthboard:citrea-testnet

# TruthBoard Confidential con Zama FHE
npx hardhat run scripts/deploy-confidential.js --network zama_sepolia

# Filecoin Storage
npm run deploy:filecoin:testnet

# Base Mini-App
npm run deploy:base:miniapp:testnet
```

6. **Iniciar servidor**

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TrueBlock Ecosystem                         │
├─────────────────────┬─────────────────────┬─────────────────────────┤
│     TrueBlock       │     TruthBoard      │   TruthBoard FHE        │
│ (Public Validation) │ (Anonymous ZK)      │   (Confidential)        │
├─────────────────────┼─────────────────────┼─────────────────────────┤
│ • AI Oracles        │ • ZK Proofs         │ • FHE Encryption        │
│ • Community Vote    │ • Anonymous Publish │ • Private Validation    │
│ • Staking/Slashing  │ • Bitcoin L2        │ • Zama Protocol         │
│ • Ethereum/Polygon  │ • Citrea Rollup     │ • Encrypted Compute     │
└─────────────────────┴─────────────────────┴─────────────────────────┘
                              │
                ┌─────────────────────────────┐
                │     Storage Layer           │
                ├─────────────────────────────┤
                │ • IPFS Distributed Storage  │
                │ • Filecoin Permanent Store  │
                │ • Lighthouse Interface      │
                │ • Content Addressing        │
                └─────────────────────────────┘
```

### Smart Contracts Desplegados

#### TrueBlock (Ethereum Sepolia)

- **Contrato**: `TrueBlockValidator.sol`
- **Dirección**: `0x112baa264d204d6e952d927761b91E9a68B9c0D2`
- **Red**: Ethereum Sepolia Testnet
- **Explorer**: [Ver en Etherscan](https://sepolia.etherscan.io/address/0x112baa264d204d6e952d927761b91E9a68B9c0D2)

#### TruthBoard (Citrea Bitcoin L2)

- **Contrato**: `TruthBoard.sol`
- **Dirección**: `0x112baa264d204d6e952d927761b91E9a68B9c0D2`
- **Red**: Citrea Testnet (Bitcoin Rollup)
- **Chain ID**: 5115

#### TruthBoard Confidential (Zama FHE)

- **Contrato**: `TruthBoardConfidential.sol`
- **Dirección**: `0x345E4DB2fa4E615842D51DAf6D2ae4a831220876`
- **Red**: Ethereum Sepolia + Zama FHE
- **FHE Gateway**: `0x000000000000000000000000000000000000005d`

#### Base Mini-App

- **Contrato**: `TrueBlockMiniApp.sol`
- **Red**: Base Network
- **Funcionalidad**: Validación comunitaria gamificada

### API Endpoints Completa

#### 🔍 TrueBlock - Validación Pública

```http
# Validación
POST /api/validation/submit
GET /api/validation/:contentHash
POST /api/validation/:contentHash/vote
GET /api/validation/recent
GET /api/validation/stats

# Oráculos
POST /api/oracle/register
POST /api/oracle/validate
GET /api/oracle/:walletAddress
GET /api/oracle/list/active

# Staking
POST /api/staking/validator/register
GET /api/staking/validator/:walletAddress
POST /api/staking/validator/:walletAddress/add-stake
GET /api/staking/rewards/:walletAddress

# Noticias
GET /api/news/feed
GET /api/news/trending
GET /api/news/search
GET /api/news/badge/:contentHash
POST /api/news/report
```

#### � TruthBoard - Periodismo Anónimo

```http
# ZK Anonymous Operations
POST /api/truthboard/anonymous/submit
POST /api/truthboard/anonymous/validate
GET /api/truthboard/anonymous/feed
POST /api/truthboard/anonymous/donate

# Privacy-Preserving Features
GET /api/truthboard/zk/proof/:submissionId
POST /api/truthboard/zk/verify
GET /api/truthboard/reputation/anonymous/:zkProof
```

#### 🔐 Confidential - FHE Operations

```http
# Encrypted Validation
POST /api/confidential/submit/encrypted
POST /api/confidential/validate/encrypted
GET /api/confidential/results/encrypted/:id
POST /api/confidential/reputation/update

# FHE Operations
POST /api/confidential/fhe/encrypt
POST /api/confidential/fhe/decrypt
GET /api/confidential/fhe/public-key
```

#### 🗃️ Filecoin - Storage

```http
# Permanent Storage
POST /api/filecoin/upload
GET /api/filecoin/retrieve/:cid
GET /api/filecoin/status/:dealId
POST /api/filecoin/pin

# IPFS Integration
POST /api/ipfs/add
GET /api/ipfs/get/:hash
POST /api/ipfs/pin/:hash
```

#### 📱 Mini-App - Base Network

```http
# Simplified Operations
POST /api/miniapp/submit
POST /api/miniapp/vote/:id
GET /api/miniapp/leaderboard
GET /api/miniapp/user/:address/stats
```

## 🔄 Flujos de Validación

### 🔍 TrueBlock (Validación Pública)

1. **Envío de Contenido**

   - Usuario/medio envía URL o texto
   - Sistema extrae contenido y genera hash
   - Contenido se almacena en IPFS/Filecoin

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

### 🔒 TruthBoard (Anónimo con ZK)

1. **Publicación Anónima**

   - Periodista genera Zero-Knowledge proof
   - Envía contenido sin revelar identidad
   - Proof verificado on-chain en Citrea

2. **Validación Preservando Privacidad**

   - Validadores verifican contenido
   - Votos agregados sin revelar votantes
   - Consenso anónimo alcanzado

3. **Donaciones Confidenciales**
   - Lectores donan sin revelar identidades
   - Fondos distribuidos automáticamente
   - Historial público pero anónimo

### 🔐 TruthBoard Confidential (FHE)

1. **Cifrado de Entrada**

   - Contenido cifrado con FHE antes de envío
   - Clave pública distribuida por Zama

2. **Validación Cifrada**

   - Operaciones realizadas sobre datos cifrados
   - Votos agregados homomórficamente
   - Resultado calculado sin descifrar

3. **Descifrado Selectivo**
   - Solo resultado final se descifra
   - Datos intermedios permanecen cifrados
   - Privacidad total garantizada

## 🎯 Casos de Uso Expandidos

### Para Medios de Comunicación

```javascript
// Validación pública con TrueBlock
const response = await fetch("/api/validation/submit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: "https://ejemplo.com/noticia",
    title: "Título de la noticia",
    category: "politics",
  }),
});

const { contentHash } = await response.json();

// Obtener resultado
const validation = await fetch(`/api/validation/${contentHash}`);
const result = await validation.json();

console.log(`Veredicto: ${result.data.verdict.status}`);
console.log(`Confianza: ${result.data.verdict.confidence}%`);
```

### Para Periodistas Anónimos

```javascript
// Publicación anónima con TruthBoard
const zkProof = await generateZKProof(content, credentials);

const response = await fetch("/api/truthboard/anonymous/submit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: encryptedContent,
    zkProof: zkProof,
    category: "investigation",
  }),
});

// Verificar anonimato
const verification = await fetch(`/api/truthboard/zk/verify`, {
  method: "POST",
  body: JSON.stringify({ proof: zkProof }),
});
```

### Para Validación Confidencial

```javascript
// Validación con cifrado homomórfico (Zama FHE)
const fheClient = await createFHEClient();
const encryptedContent = await fheClient.encrypt(content);

const response = await fetch("/api/confidential/submit/encrypted", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    encryptedContent: encryptedContent,
    publicKey: fheClient.getPublicKey(),
  }),
});

// El resultado se procesa sin descifrar datos intermedios
const encryptedResult = await response.json();
const result = await fheClient.decrypt(encryptedResult.data);
```

### Para Almacenamiento Permanente

```javascript
// Subir evidencias a Filecoin
const formData = new FormData();
formData.append("file", evidenceFile);
formData.append("dealDuration", "1051200"); // ~1 año

const response = await fetch("/api/filecoin/upload", {
  method: "POST",
  body: formData,
});

const { cid, dealId } = await response.json();

// Verificar estado del deal
const status = await fetch(`/api/filecoin/status/${dealId}`);
const dealInfo = await status.json();
console.log(`Estado: ${dealInfo.status}`);
```

### Para Plataformas Sociales

```javascript
// Integrar badge de verificación multi-plataforma
const badges = await Promise.all([
  fetch(`/api/news/badge/${contentHash}?platform=trueblock`),
  fetch(`/api/truthboard/badge/${contentHash}?platform=zk`),
  fetch(`/api/confidential/badge/${contentHash}?platform=fhe`),
]);

const badgeHTML = badges.map((b) => b.text()).join("");
document.getElementById("verification-badges").innerHTML = badgeHTML;
```

### Para Desarrollo de Mini-Apps

```javascript
// API simplificada para Base Mini-App
const submitContent = async (content) => {
  const response = await fetch("/api/miniapp/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: content,
      userAddress: await getWalletAddress(),
      category: "general",
    }),
  });

  return response.json();
};

// Votación comunitaria
const vote = async (contentId, score) => {
  const response = await fetch(`/api/miniapp/vote/${contentId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      score: score, // 0-100
      userAddress: await getWalletAddress(),
    }),
  });

  return response.json();
};
```

## 🧪 Testing Completo

```bash
# Tests de smart contracts
npx hardhat test

# Tests específicos por contrato
npx hardhat test test/TrueBlockValidator.test.js
npx hardhat test test/TruthBoard.test.js
npx hardhat test test/TruthBoardFilecoin.test.js
npx hardhat test test/TrueBlockMiniApp.test.js

# Tests de integración completa
npm test

# Tests de servicios específicos
npm run test:integration

# Verificar cobertura
npm run coverage

# Tests de FHE con Zama
npx hardhat test --grep "FHE"

# Tests de ZK proofs
npx hardhat test --grep "ZeroKnowledge"
```

## 🚀 Despliegue Multi-Blockchain

### 1. Preparar entorno

```bash
# Variables de producción para todas las redes
NODE_ENV=production
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
CITREA_RPC_URL=https://rpc.mainnet.citrea.xyz
BASE_RPC_URL=https://mainnet.base.org
FILECOIN_RPC_URL=https://api.node.glif.io/rpc/v1
```

### 2. Desplegar contratos por red

```bash
# TrueBlock en Ethereum Mainnet
npx hardhat run scripts/deploy.js --network ethereum

# TruthBoard en Citrea Bitcoin L2
npm run deploy:truthboard:citrea-mainnet

# TruthBoard Confidential con Zama
npx hardhat run scripts/deploy-confidential.js --network zama_mainnet

# Filecoin Storage
npm run deploy:filecoin:mainnet

# Base Mini-App
npm run deploy:base:miniapp

# Verificar todos los despliegues
node scripts/verify-deployments.js
```

### 3. Configurar infraestructura

```bash
# PM2 para gestión de procesos
npm install -g pm2
pm2 start ecosystem.config.js

# Docker Compose para servicios
docker-compose -f docker-compose.prod.yml up -d

# Nginx con load balancing
sudo cp nginx.conf /etc/nginx/sites-available/trueblock
sudo ln -s /etc/nginx/sites-available/trueblock /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 4. Configurar proxy reverso avanzado

```nginx
upstream trueblock_api {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001 backup;
}

upstream truthboard_api {
    server 127.0.0.1:3002;
    server 127.0.0.1:3003 backup;
}

server {
    listen 443 ssl http2;
    server_name api.trueblock.app;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # TrueBlock API
    location /api/validation/ {
        proxy_pass http://trueblock_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # TruthBoard API
    location /api/truthboard/ {
        proxy_pass http://truthboard_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Confidential API (FHE)
    location /api/confidential/ {
        proxy_pass http://trueblock_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        # Headers especiales para FHE
        proxy_set_header X-FHE-Enabled true;
    }

    # Filecoin Storage
    location /api/filecoin/ {
        proxy_pass http://trueblock_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        # Aumentar límites para archivos grandes
        client_max_body_size 100M;
        proxy_read_timeout 300s;
    }

    # Mini-App
    location /api/miniapp/ {
        proxy_pass http://trueblock_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 5. Monitoreo avanzado

```bash
# Health checks por servicio
curl https://api.trueblock.app/health
curl https://api.trueblock.app/api/info

# Métricas específicas
curl https://api.trueblock.app/api/validation/stats
curl https://api.trueblock.app/api/truthboard/stats
curl https://api.trueblock.app/api/confidential/stats
curl https://api.trueblock.app/api/filecoin/stats
```

## 📊 Monitoreo y Analytics Avanzado

### Health Checks por Servicio

```bash
# Health general del ecosistema
curl https://api.trueblock.app/health

# Estado específico por plataforma
curl https://api.trueblock.app/api/info

# Métricas de TrueBlock
curl https://api.trueblock.app/api/validation/stats

# Métricas de TruthBoard
curl https://api.trueblock.app/api/truthboard/stats

# Estado de Filecoin
curl https://api.trueblock.app/api/filecoin/stats

# Métricas de FHE
curl https://api.trueblock.app/api/confidential/stats
```

### Métricas Principales del Ecosistema

#### TrueBlock (Validación Pública)

- Total de validaciones procesadas
- Tasa de detección de fake news
- Tiempo promedio de validación
- Reputación de oráculos activos
- Actividad de validadores comunitarios
- Distribución de staking/slashing

#### TruthBoard (Periodismo Anónimo)

- Publicaciones anónimas creadas
- Verificaciones ZK exitosas
- Donaciones anónimas procesadas
- Actividad en Citrea Bitcoin L2
- Distribución de reputación anónima

#### TruthBoard Confidential (FHE)

- Validaciones FHE completadas
- Operaciones homomórficas realizadas
- Tiempo de procesamiento cifrado
- Uso de recursos Zama
- Privacidad preservada (métricas agregadas)

#### Almacenamiento (Filecoin/IPFS)

- Archivos almacenados permanentemente
- Deals de Filecoin activos
- Distribución IPFS
- Recuperación de evidencias
- Redundancia de datos

#### Mini-App (Base Network)

- Usuarios activos diarios
- Votaciones comunitarias
- Ranking de reputación
- Transacciones en Base
- Engagement gamificado

### Dashboard de Métricas

```javascript
// Ejemplo de dashboard unificado
const getEcosystemMetrics = async () => {
  const [trueblock, truthboard, confidential, storage, miniapp] =
    await Promise.all([
      fetch("/api/validation/stats").then((r) => r.json()),
      fetch("/api/truthboard/stats").then((r) => r.json()),
      fetch("/api/confidential/stats").then((r) => r.json()),
      fetch("/api/filecoin/stats").then((r) => r.json()),
      fetch("/api/miniapp/stats").then((r) => r.json()),
    ]);

  return {
    totalValidations: trueblock.total + truthboard.total + confidential.total,
    averageAccuracy:
      (trueblock.accuracy + truthboard.accuracy + confidential.accuracy) / 3,
    storageUsage: storage.totalFiles,
    activeUsers: miniapp.dailyActiveUsers,
    networkDistribution: {
      ethereum: trueblock.total,
      citrea: truthboard.total,
      zama: confidential.total,
      base: miniapp.total,
    },
  };
};
```

## 🛡️ Seguridad Avanzada

### Criptografía y Privacidad

- **Zero-Knowledge Proofs**: Verificación sin revelación de datos
- **Fully Homomorphic Encryption**: Computación sobre datos cifrados
- **TFHE Algorithm**: Cifrado homomórfico optimizado
- **Cryptographic Signatures**: Autenticación de oráculos y validadores
- **Key Management**: Gestión segura de claves multi-red

### Seguridad Web

- **Rate Limiting Avanzado**: Protección contra spam por servicio
- **Helmet.js**: Headers de seguridad HTTP
- **CORS Configurado**: Control de origen cruzado por endpoint
- **Input Sanitization**: Prevención de inyecciones XSS/SQL
- **Content Security Policy**: Políticas de seguridad estrictas

### Seguridad Blockchain

- **Multi-sig Wallets**: Para contratos críticos
- **Timelock Mechanisms**: Delays para cambios importantes
- **Upgradeable Patterns**: Actualizaciones seguras de contratos
- **Audit Trail**: Registro inmutable de todas las operaciones
- **Slashing Protection**: Penalizaciones por comportamiento malicioso

### Monitoreo de Seguridad

- **Anomaly Detection**: Detección de patrones sospechosos
- **Real-time Alerts**: Alertas por actividad maliciosa
- **Validator Monitoring**: Supervisión de comportamiento de oráculos
- **Network Analysis**: Análisis de tráfico y patrones
- **Incident Response**: Protocolos de respuesta a incidentes

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Documentación Completa

- **[API Documentation](./API-DOCS.md)**: Documentación completa de todos los endpoints
- **[Deployment Guide](./DEPLOY-SUMMARY.md)**: Guía de despliegue multi-blockchain
- **[TruthBoard Guide](./README-TruthBoard.md)**: Periodismo anónimo con ZK proofs
- **[Confidential Guide](./README-Confidential.md)**: Validación FHE con Zama
- **[Filecoin Integration](./README-TruthBoard-Filecoin.md)**: Almacenamiento permanente
- **[Base Mini-App](./README-Base-MiniApp.md)**: Aplicación simplificada
- **[Hackathon Submission](./HACKATHON-SUBMISSION.md)**: Detalles de participación
- **[Environment Setup](./ENV-CLEANUP-SUMMARY.md)**: Configuración de entornos
- **[Proxy Configuration](./PROXY-SETUP.md)**: Setup de infraestructura
- **Credentials Guide**: `README-Credentials.md` (confidencial)

## 🆘 Soporte y Comunidad

- **Documentación Técnica**: Disponible en este repositorio
- **Issues y Bugs**: [GitHub Issues](https://github.com/Emanuel250YT/trustblock/issues)
- **Contribuciones**: Ver guía de contribución abajo
- **Preguntas Técnicas**: Crea un issue con label `question`

## 🤝 Contribuir al Ecosistema

### Proceso de Contribución

1. **Fork del proyecto**

   ```bash
   git clone https://github.com/tu-usuario/trustblock.git
   cd trustblock
   ```

2. **Crear rama feature**

   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

3. **Desarrollo y testing**

   ```bash
   npm run dev
   npm test
   npm run compile-contracts
   ```

4. **Commit con estándares**

   ```bash
   git commit -am 'feat: agregar validación FHE mejorada'
   ```

5. **Push y Pull Request**
   ```bash
   git push origin feature/nueva-funcionalidad
   # Crear PR desde GitHub
   ```

### Áreas de Contribución

#### 🔧 Backend Development

- Nuevos oráculos de IA especializados
- Optimizaciones de performance
- Integración con más blockchains
- Mejoras en APIs RESTful

#### 🔐 Cryptography & Security

- Implementaciones ZK más eficientes
- Optimizaciones FHE
- Auditorías de seguridad
- Nuevos esquemas criptográficos

#### 🌐 Blockchain Integration

- Soporte para nuevas redes
- Optimización de gas
- Cross-chain bridges
- Layer 2 implementations

#### 📱 Frontend & UX

- Interfaces web para cada plataforma
- Mobile apps nativas
- Browser extensions
- Dashboard analytics

#### 🗃️ Storage & Infrastructure

- Optimizaciones IPFS
- Integración Filecoin Plus
- CDN implementations
- Monitoring tools

### Estándares de Código

```bash
# Linting y formatting
npm run lint
npm run format

# Tests obligatorios
npm run test:coverage

# Security checks
npm audit
npm run security-check
```

## 🌟 Roadmap del Ecosistema

### Próximas Funcionalidades

#### 🔮 Q1 2025

- [ ] **Multi-Language Support**: Soporte para 10+ idiomas
- [ ] **Enhanced AI Oracles**: Nuevos modelos especializados
- [ ] **Cross-Chain Bridges**: Interoperabilidad entre todas las redes
- [ ] **Advanced Analytics Dashboard**: Métricas en tiempo real

#### 🚀 Q2 2025

- [ ] **Mobile Apps**: iOS y Android nativas
- [ ] **Browser Extensions**: Chrome, Firefox, Safari
- [ ] **Social Media Integration**: APIs para Twitter, Facebook, TikTok
- [ ] **Enterprise APIs**: Soluciones B2B

#### 🌐 Q3 2025

- [ ] **Decentralized Governance**: DAO para decisiones del protocolo
- [ ] **Advanced FHE Features**: Nuevas operaciones homomórficas
- [ ] **Video Analysis**: Detección de deepfakes en video
- [ ] **Real-time Fact-checking**: Verificación instantánea

#### 🔬 Q4 2025

- [ ] **AI Model Marketplace**: Oráculos especializados by domain
- [ ] **Academic Integration**: Partnerships con universidades
- [ ] **Global Expansion**: Soporte para medios internacionales
- [ ] **Research Papers**: Publicaciones académicas

### Contribuciones de la Comunidad

- **Hackathons**: Eventos regulares para innovación
- **Bounty Programs**: Recompensas por mejoras
- **Research Grants**: Financiamiento para investigación
- **Developer Ecosystem**: SDKs y herramientas

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver `LICENSE` para más detalles.

**Nota**: Algunas integraciones pueden requerir claves API de terceros sujetas a sus propios términos de servicio.

---

## 🌟 Reconocimientos

### Tecnologías Utilizadas

- **[Zama](https://zama.ai)**: Fully Homomorphic Encryption
- **[Citrea](https://citrea.xyz)**: Bitcoin Rollup Technology
- **[Filecoin](https://filecoin.io)**: Decentralized Storage Network
- **[Base](https://base.org)**: Layer 2 Blockchain
- **[Lighthouse](https://lighthouse.storage)**: Filecoin Gateway
- **[OpenAI](https://openai.com)**: AI Models for Content Analysis
- **[Hardhat](https://hardhat.org)**: Ethereum Development Environment

### Participación en Hackathons

- **Base Mini-Apps Track**: Implementación de TrueBlock Mini-App
- **Zama FHE Track**: TruthBoard Confidential
- **Filecoin Track**: Almacenamiento permanente descentralizado

---

**TrueBlock & TruthBoard Ecosystem** - Construyendo el futuro de la información verificable mediante tecnología descentralizada 🌐✨🔐

_"La verdad es la primera víctima de la guerra... y la primera aliada de la tecnología descentralizada"_
