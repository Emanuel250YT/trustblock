# TrueBlock & TruthBoard - Ecosistema Completo contra la Desinformación

![TrueBlock Logo](https://img.shields.io/badge/TrueBlock-v1.0.0-blue)
![TruthBoard](https://img.shields.io/badge/TruthBoard-v1.0.0-purple)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node.js-v18+-brightgreen)
![Solidity](https://img.shields.io/badge/solidity-v0.8.19-orange)
![Zama FHE](https://img.shields.io/badge/Zama-FHE-red)
![Citrea](https://img.shields.io/badge/Citrea-Bitcoin%20L2-orange)
![Filecoin](https://img.shields.io/badge/Filecoin-Storage-blue)
![Flare](https://img.shields.io/badge/Flare-Data%20Oracle-red)

**TrueBlock & TruthBoard** es un ecosistema descentralizado completo que combina múltiples tecnologías blockchain, IA y criptografía avanzada para combatir la desinformación y promover el periodismo anónimo. Incluye validación multicapa, oráculos de IA, sistemas de staking/slashing, Zero-Knowledge proofs, almacenamiento permanente descentralizado, y oráculos de datos en tiempo real.

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

### 📊 TrueBlock Oracle Hub (Flare Network)

- **Oráculos de Datos Nativos**: FTSO para feeds de precios en tiempo real
- **Flare Data Connector**: Verificación de datos Web2 on-chain
- **Secure Random Numbers**: Aleatoriedad verificable para validaciones
- **Cross-Chain Data**: Agregación de datos de múltiples blockchains
- **Time Series Oracle**: Datos históricos y tendencias para contexto
- **Verificación de Fuentes**: Validación automática de credibilidad de medios
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

# Flare Network Configuration
FLARE_NETWORK=coston2
FLARE_PRIVATE_KEY=
FLARE_RPC_URL=https://coston2-api.flare.network/ext/C/rpc
COSTON_RPC_URL=https://costonapi.flare.network/ext/C/rpc
COSTON2_RPC_URL=https://coston2-api.flare.network/ext/C/rpc
FLARE_MAINNET_CONTRACT=
FLARE_COSTON_CONTRACT=
FLARE_COSTON2_CONTRACT=



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

### API Endpoints - Documentación Técnica Completa

#### 🔍 TrueBlock - Validación Pública

##### Validación de Noticias

**POST** `/api/validation/submit`
Envía una noticia para validación multicapa.

```json
// Request Body
{
  "url": "https://ejemplo.com/noticia", // Opcional si se envía content
  "content": "Texto de la noticia",     // Opcional si se envía url
  "title": "Título de la noticia"      // Requerido
}

// Response (201)
{
  "success": true,
  "message": "Noticia enviada para validación",
  "data": {
    "contentHash": "0x1a2b3c...",
    "transactionHash": "0x4d5e6f...",
    "processedContent": {
      "title": "Título procesado",
      "summary": "Resumen automático",
      "timestamp": "2025-08-31T10:30:00.000Z"
    }
  }
}
```

**GET** `/api/validation/:contentHash`
Obtiene el estado y resultado de una validación.

```json
// Response (200)
{
  "success": true,
  "data": {
    "contentHash": "0x1a2b3c...",
    "status": "completed", // pending, processing, completed
    "verdict": {
      "status": "verified", // verified, fake, uncertain
      "confidence": 85,
      "finalScore": 87
    },
    "oracleValidations": [
      {
        "oracle": "0x123...",
        "specialization": "fake_news",
        "vote": 1,
        "confidence": 90,
        "timestamp": "2025-08-31T10:35:00.000Z"
      }
    ],
    "communityValidations": [
      {
        "validator": "0x456...",
        "category": "journalist",
        "vote": 85,
        "timestamp": "2025-08-31T10:40:00.000Z"
      }
    ],
    "evidenceHash": "QmX1Y2Z3...",
    "createdAt": "2025-08-31T10:30:00.000Z",
    "completedAt": "2025-08-31T10:45:00.000Z"
  }
}
```

**POST** `/api/validation/:contentHash/vote`
Permite a validadores comunitarios votar sobre una noticia.

```json
// Request Body
{
  "walletAddress": "0x123...",
  "vote": 75,              // 0-100 (porcentaje de veracidad)
  "signature": "0x1a2b3c..." // Ver sección "Obtener Signatures"
}

// Response (200)
{
  "success": true,
  "message": "Voto registrado exitosamente",
  "data": {
    "contentHash": "0x1a2b3c...",
    "voter": "0x123...",
    "vote": 75,
    "weight": 1.5, // Peso basado en reputación
    "transactionHash": "0x4d5e6f..."
  }
}
```

##### Gestión de Oráculos

**POST** `/api/oracle/register`
Registra un nuevo oráculo de IA especializado.

```json
// Request Body
{
  "walletAddress": "0x123...",
  "specialization": "fake_news", // fake_news, deepfake, image_manipulation, text_analysis
  "stake": "10.0",               // ETH a depositar
  "signature": "0x1a2b3c..."     // Ver sección "Obtener Signatures"
}

// Response (201)
{
  "success": true,
  "message": "Oráculo registrado exitosamente",
  "data": {
    "walletAddress": "0x123...",
    "specialization": "fake_news",
    "stake": "10.0",
    "transactionHash": "0x4d5e6f...",
    "oracleId": 42
  }
}
```

**POST** `/api/oracle/validate`
Permite a un oráculo enviar su validación sobre contenido.

```json
// Request Body
{
  "walletAddress": "0x123...",
  "contentHash": "0x1a2b3c...",
  "vote": 1,                    // 0 (fake), 1 (real), 2 (incierto)
  "evidenceHash": "QmX1Y2Z3...", // Opcional
  "confidence": 90,             // 0-100
  "signature": "0x1a2b3c..."    // Ver sección "Obtener Signatures"
}

// Response (200)
{
  "success": true,
  "message": "Validación registrada",
  "data": {
    "contentHash": "0x1a2b3c...",
    "oracle": "0x123...",
    "vote": 1,
    "confidence": 90,
    "transactionHash": "0x4d5e6f...",
    "rewardEarned": "0.5" // ETH
  }
}
```

##### Sistema de Staking

**POST** `/api/staking/validator/register`
Registra un validador comunitario con stake.

```json
// Request Body
{
  "walletAddress": "0x123...",
  "category": "journalist",    // journalist, fact_checker, expert, community
  "stake": "5.0",             // ETH mínimo requerido
  "signature": "0x1a2b3c..."  // Ver sección "Obtener Signatures"
}

// Response (201)
{
  "success": true,
  "message": "Validador registrado exitosamente",
  "data": {
    "walletAddress": "0x123...",
    "category": "journalist",
    "stake": "5.0",
    "reputation": 100,
    "transactionHash": "0x4d5e6f..."
  }
}
```

**POST** `/api/staking/validator/:walletAddress/add-stake`
Aumenta el stake de un validador existente.

```json
// Request Body
{
  "amount": "2.5",           // ETH adicional
  "signature": "0x1a2b3c..." // Ver sección "Obtener Signatures"
}

// Response (200)
{
  "success": true,
  "message": "Stake aumentado exitosamente",
  "data": {
    "walletAddress": "0x123...",
    "previousStake": "5.0",
    "newStake": "7.5",
    "transactionHash": "0x4d5e6f..."
  }
}
```

#### 🔒 TruthBoard - Periodismo Anónimo

**POST** `/api/truthboard/publish`
Publica una noticia de forma completamente anónima.

```json
// Request Body
{
  "content": "Contenido de la investigación",
  "title": "Título de la investigación",
  "region": "global",              // global, us, eu, asia, etc.
  "publisherIdentity": {           // Zero-Knowledge identity
    "commitment": "0x1a2b3c...",
    "proof": "0x4d5e6f...",
    "nullifier": "0x7g8h9i..."
  }
}

// Response (200)
{
  "success": true,
  "message": "Noticia publicada anónimamente",
  "data": {
    "newsHash": "0x1a2b3c...",
    "anonymousId": "zk_0x4d5e6f...",
    "citreaTransactionHash": "0x7g8h9i...",
    "ipfsHash": "QmX1Y2Z3...",
    "timestamp": "2025-08-31T10:30:00.000Z"
  }
}
```

**POST** `/api/truthboard/validate`
Valida una noticia manteniendo la privacidad del validador.

```json
// Request Body
{
  "newsHash": "0x1a2b3c...",
  "vote": 85,                      // 0-100
  "validatorCommitment": {         // ZK commitment del validador
    "commitment": "0x1a2b3c...",
    "proof": "0x4d5e6f...",
    "nullifier": "0x7g8h9i..."
  }
}

// Response (200)
{
  "success": true,
  "message": "Validación anónima registrada",
  "data": {
    "newsHash": "0x1a2b3c...",
    "anonymousValidatorId": "zk_0x4d5e6f...",
    "vote": 85,
    "transactionHash": "0x7g8h9i..."
  }
}
```

#### 🔐 TruthBoard Confidential - Validación FHE

**POST** `/api/confidential/initialize`
Inicializa el servicio FHE para operaciones confidenciales.

```json
// Request Body
{
  "contractAddress": "0x345E4DB2fa4E615842D51DAf6D2ae4a831220876",
  "relayerConfig": {
    "endpoint": "https://relayer.zama.ai",
    "apiKey": "zama_api_key"
  }
}

// Response (200)
{
  "success": true,
  "message": "Servicio FHE inicializado correctamente",
  "stats": {
    "contractAddress": "0x345E4DB2fa4E615842D51DAf6D2ae4a831220876",
    "fheGateway": "0x000000000000000000000000000000000000005d",
    "encryptionScheme": "TFHE",
    "supportedOperations": ["add", "multiply", "compare", "aggregate"]
  }
}
```

**POST** `/api/confidential/register-validator`
Registra un validador con reputación completamente cifrada.

```json
// Request Body
{
  "validatorAddress": "0x123...",
  "initialReputation": 50,         // Valor inicial (se cifra)
  "validationHistory": []          // Historial inicial vacío
}

// Response (200)
{
  "success": true,
  "message": "Validador registrado con reputación cifrada",
  "data": {
    "validatorAddress": "0x123...",
    "encryptedReputation": "enc_0x1a2b3c...", // Reputación cifrada
    "metadata": {
      "encryptionScheme": "TFHE",
      "keyId": "key_123",
      "timestamp": "2025-08-31T10:30:00.000Z"
    }
  }
}
```

**POST** `/api/confidential/submit-validation`
Envía una validación completamente cifrada.

```json
// Request Body
{
  "newsId": "news_123",
  "validatorAddress": "0x123...",
  "isValid": true,                 // Se cifra antes de procesar
  "confidenceLevel": 85,           // Se cifra antes de procesar
  "evidence": "QmX1Y2Z3..."       // Opcional, hash IPFS
}

// Response (200)
{
  "success": true,
  "message": "Validación cifrada enviada",
  "data": {
    "validationId": "val_456",
    "encryptedValidation": "enc_0x4d5e6f...",
    "encryptedConfidence": "enc_0x7g8h9i...",
    "transactionHash": "0xab1cd2..."
  }
}
```

#### 🗃️ Filecoin - Almacenamiento Permanente

**POST** `/api/filecoin/archive/news`
Archiva noticias verificadas permanentemente en Filecoin.

```json
// Request Body
{
  "contentHash": "0x1a2b3c...",
  "title": "Título de la noticia",
  "content": "Contenido completo",
  "validationScore": 87,           // Mínimo 75 para archivar
  "validators": [                  // Lista de validadores
    {
      "address": "0x123...",
      "vote": 85,
      "category": "journalist"
    }
  ]
}

// Response (200)
{
  "success": true,
  "message": "Noticia archivada permanentemente en Filecoin",
  "data": {
    "contentHash": "0x1a2b3c...",
    "filecoinCid": "bafybeig...",
    "dealId": "deal_123456",
    "storageProvider": "f01234",
    "dealDuration": 1051200,       // ~1 año en epochs
    "cost": "0.001",               // FIL
    "retrievalUrl": "https://gateway.lighthouse.storage/ipfs/bafybeig..."
  }
}
```

**POST** `/api/filecoin/evidence/store`
Almacena evidencias de validación de forma permanente.

```json
// Request Body
{
  "newsHash": "0x1a2b3c...",
  "evidenceFiles": [
    {
      "type": "screenshot",
      "hash": "QmX1Y2Z3...",
      "description": "Captura de pantalla original"
    },
    {
      "type": "analysis",
      "hash": "QmA4B5C6...",
      "description": "Análisis de AI del contenido"
    }
  ],
  "validationScore": 87,
  "validators": [...]
}

// Response (200)
{
  "success": true,
  "message": "Evidencia almacenada permanentemente",
  "data": {
    "evidencePackageId": "evidence_789",
    "filecoinCid": "bafybeig...",
    "dealId": "deal_789012",
    "evidenceCount": 2,
    "totalSize": "15.7 MB",
    "retrievalEndpoints": [
      "https://gateway.lighthouse.storage/ipfs/bafybeig...",
      "https://ipfs.io/ipfs/bafybeig...",
      "https://w3s.link/ipfs/bafybeig..."
    ]
  }
}
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

#### � Flare - Oracle Hub

```http
# Price Feeds & Economic Context
GET /api/flare/prices?symbols=BTC,ETH,USDC
GET /api/flare/economic-context
GET /api/flare/random

# News Validation with Oracle Data
POST /api/flare/submit-news
POST /api/flare/validate-news
GET /api/flare/validation/:newsHash

# Validator Management
POST /api/flare/register-validator
GET /api/flare/validator/:address

# Media Credibility Tracking
GET /api/flare/media-credibility/:mediaName
GET /api/flare/status
```

#### �🗃️ Filecoin - Storage

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

## � Guía de Signatures y Autenticación

### Cómo Obtener Signatures para APIs

#### 1. Registro de Oráculo (Oracle Registration)

```javascript
// Frontend con ethers.js
import { ethers } from "ethers";

const getOracleRegistrationSignature = async (
  walletAddress,
  specialization
) => {
  try {
    // Conectar wallet
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Mensaje a firmar
    const message = `TrueBlock Oracle Registration: ${specialization}`;

    // Generar firma
    const signature = await signer.signMessage(message);

    return {
      walletAddress,
      specialization,
      signature,
      message, // Para verificación
    };
  } catch (error) {
    console.error("Error generando firma de oráculo:", error);
    throw error;
  }
};

// Ejemplo de uso
const registerOracle = async () => {
  const signatureData = await getOracleRegistrationSignature(
    "0x123...",
    "fake_news"
  );

  const response = await fetch("/api/oracle/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      walletAddress: signatureData.walletAddress,
      specialization: signatureData.specialization,
      stake: "10.0",
      signature: signatureData.signature,
    }),
  });
};
```

#### 2. Validación por Oráculo (Oracle Validation)

```javascript
const getOracleValidationSignature = async (
  walletAddress,
  contentHash,
  vote
) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Mensaje específico para validación
    const message = `TrueBlock Validation: ${contentHash}:${vote}`;

    const signature = await signer.signMessage(message);

    return {
      walletAddress,
      contentHash,
      vote,
      signature,
      message,
    };
  } catch (error) {
    console.error("Error generando firma de validación:", error);
    throw error;
  }
};

// Ejemplo de uso
const submitOracleValidation = async (contentHash, vote, confidence) => {
  const signatureData = await getOracleValidationSignature(
    await signer.getAddress(),
    contentHash,
    vote
  );

  const response = await fetch("/api/oracle/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      walletAddress: signatureData.walletAddress,
      contentHash: signatureData.contentHash,
      vote: signatureData.vote,
      evidenceHash: "QmX1Y2Z3...", // Opcional
      confidence: confidence,
      signature: signatureData.signature,
    }),
  });
};
```

#### 3. Registro de Validador Comunitario

```javascript
const getValidatorRegistrationSignature = async (walletAddress, category) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Mensaje para registro de validador
    const message = `TrueBlock Validator Registration: ${category}`;

    const signature = await signer.signMessage(message);

    return {
      walletAddress,
      category,
      signature,
      message,
    };
  } catch (error) {
    console.error("Error generando firma de validador:", error);
    throw error;
  }
};

// Ejemplo de uso
const registerValidator = async (category, stakeAmount) => {
  const signatureData = await getValidatorRegistrationSignature(
    await signer.getAddress(),
    category
  );

  const response = await fetch("/api/staking/validator/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      walletAddress: signatureData.walletAddress,
      category: signatureData.category,
      stake: stakeAmount,
      signature: signatureData.signature,
    }),
  });
};
```

#### 4. Voto Comunitario

```javascript
const getCommunityVoteSignature = async (walletAddress, contentHash, vote) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Mensaje para voto comunitario
    const message = `TrueBlock Community Vote: ${contentHash}:${vote}`;

    const signature = await signer.signMessage(message);

    return {
      walletAddress,
      contentHash,
      vote,
      signature,
      message,
    };
  } catch (error) {
    console.error("Error generando firma de voto:", error);
    throw error;
  }
};

// Ejemplo de uso
const submitCommunityVote = async (contentHash, voteScore) => {
  const signatureData = await getCommunityVoteSignature(
    await signer.getAddress(),
    contentHash,
    voteScore
  );

  const response = await fetch(`/api/validation/${contentHash}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      walletAddress: signatureData.walletAddress,
      vote: signatureData.vote,
      signature: signatureData.signature,
    }),
  });
};
```

#### 5. Aumentar Stake

```javascript
const getAddStakeSignature = async (walletAddress, amount) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Mensaje para aumentar stake
    const message = `TrueBlock Add Stake: ${amount} ETH`;

    const signature = await signer.signMessage(message);

    return {
      walletAddress,
      amount,
      signature,
      message,
    };
  } catch (error) {
    console.error("Error generando firma de stake:", error);
    throw error;
  }
};

// Ejemplo de uso
const addStake = async (additionalAmount) => {
  const signatureData = await getAddStakeSignature(
    await signer.getAddress(),
    additionalAmount
  );

  const walletAddress = signatureData.walletAddress;
  const response = await fetch(
    `/api/staking/validator/${walletAddress}/add-stake`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: signatureData.amount,
        signature: signatureData.signature,
      }),
    }
  );
};
```

### Verificación de Signatures en Backend

```javascript
// En el backend (Node.js con ethers.js)
const { ethers } = require("ethers");

const verifySignature = async (message, signature, expectedAddress) => {
  try {
    // Recuperar dirección del firmante
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);

    // Verificar que coincida con la dirección esperada
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error("Error verificando firma:", error);
    return false;
  }
};

// Ejemplo de verificación específica
const verifyOracleRegistration = async (
  walletAddress,
  signature,
  specialization
) => {
  const expectedMessage = `TrueBlock Oracle Registration: ${specialization}`;
  return await verifySignature(expectedMessage, signature, walletAddress);
};

const verifyValidation = async (
  walletAddress,
  signature,
  contentHash,
  vote
) => {
  const expectedMessage = `TrueBlock Validation: ${contentHash}:${vote}`;
  return await verifySignature(expectedMessage, signature, walletAddress);
};
```

### Mensajes de Firma Estándar

| Acción                    | Formato del Mensaje                               |
| ------------------------- | ------------------------------------------------- |
| **Registro de Oráculo**   | `TrueBlock Oracle Registration: {specialization}` |
| **Validación de Oráculo** | `TrueBlock Validation: {contentHash}:{vote}`      |
| **Registro de Validador** | `TrueBlock Validator Registration: {category}`    |
| **Voto Comunitario**      | `TrueBlock Community Vote: {contentHash}:{vote}`  |
| **Aumentar Stake**        | `TrueBlock Add Stake: {amount} ETH`               |
| **Retirar Stake**         | `TrueBlock Withdraw Stake: {amount} ETH`          |
| **Claim Rewards**         | `TrueBlock Claim Rewards: {amount} ETH`           |

### Consideraciones de Seguridad

1. **Replay Attack Protection**: Cada mensaje incluye parámetros únicos
2. **Address Verification**: El backend siempre verifica que la firma corresponda a la wallet
3. **Message Validation**: Los mensajes siguen un formato estándar estricto
4. **Nonce Protection**: Para operaciones críticas, considerar incluir nonces
5. **Timestamp Validation**: Las signatures tienen validez temporal limitada

### Errores Comunes

```javascript
// ❌ Error: Mensaje incorrecto
const wrongMessage = `Oracle Registration: ${specialization}`; // Falta "TrueBlock"

// ✅ Correcto: Mensaje completo
const correctMessage = `TrueBlock Oracle Registration: ${specialization}`;

// ❌ Error: Parámetros en orden incorrecto
const wrongOrder = `TrueBlock Validation: ${vote}:${contentHash}`;

// ✅ Correcto: Orden de parámetros correcto
const correctOrder = `TrueBlock Validation: ${contentHash}:${vote}`;
```

## �🔄 Flujos de Validación

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

## 📚 Documentación Técnica Avanzada

### 🚨 Códigos de Error y Manejo

#### Códigos de Estado HTTP

| Código  | Significado           | Descripción                      |
| ------- | --------------------- | -------------------------------- |
| **200** | OK                    | Solicitud exitosa                |
| **201** | Created               | Recurso creado exitosamente      |
| **400** | Bad Request           | Parámetros inválidos o faltantes |
| **401** | Unauthorized          | Firma inválida o no autorizado   |
| **403** | Forbidden             | Operación no permitida           |
| **404** | Not Found             | Recurso no encontrado            |
| **429** | Too Many Requests     | Rate limit excedido              |
| **500** | Internal Server Error | Error interno del servidor       |

#### Estructura de Errores

```json
{
  "success": false,
  "error": "Tipo de error",
  "message": "Descripción detallada del error",
  "code": "ERROR_CODE",
  "details": {
    "field": "Campo específico con error",
    "expectedFormat": "Formato esperado",
    "receivedValue": "Valor recibido"
  },
  "timestamp": "2025-08-31T10:30:00.000Z"
}
```

#### Errores Específicos por Endpoint

```javascript
// Errores comunes de validación
{
  "error": "Parámetros requeridos faltantes",
  "code": "MISSING_REQUIRED_PARAMS",
  "details": {
    "required": ["walletAddress", "signature"],
    "missing": ["signature"]
  }
}

// Error de firma inválida
{
  "error": "Firma inválida",
  "code": "INVALID_SIGNATURE",
  "details": {
    "expectedSigner": "0x123...",
    "recoveredSigner": "0x456...",
    "message": "TrueBlock Oracle Registration: fake_news"
  }
}

// Error de rate limiting
{
  "error": "Rate limit excedido",
  "code": "RATE_LIMIT_EXCEEDED",
  "details": {
    "limit": 100,
    "window": "15 minutes",
    "resetTime": "2025-08-31T10:45:00.000Z"
  }
}
```

### 📊 Flare Oracle Hub Routes

#### **GET** `/api/flare/prices`

Obtener precios actuales usando FTSO (Flare Time Series Oracle).

**Query Parameters:**

- `symbols` (opcional): Símbolos separados por comas (default: BTC,ETH,USDC,FLR)

**Response:**

```json
{
  "success": true,
  "data": {
    "BTC": {
      "value": "43250000000000000000000", // 18 decimales
      "symbol": "BTC",
      "timestamp": 1693478400000
    },
    "ETH": {
      "value": "2650000000000000000000",
      "symbol": "ETH",
      "timestamp": 1693478400000
    }
  },
  "network": "coston2",
  "timestamp": 1693478400000
}
```

#### **GET** `/api/flare/economic-context`

Obtener contexto económico completo con múltiples precios.

**Response:**

```json
{
  "success": true,
  "data": {
    "btcPrice": "43250000000000000000000",
    "ethPrice": "2650000000000000000000",
    "usdcPrice": "1000000000000000000",
    "timestamp": "1693478400",
    "network": "coston2"
  }
}
```

#### **GET** `/api/flare/random`

Obtener número aleatorio seguro usando Secure Random Numbers.

**Response:**

```json
{
  "success": true,
  "data": {
    "randomNumber": "0x1a2b3c4d5e6f789...",
    "timestamp": 1693478400000,
    "network": "coston2"
  }
}
```

#### **POST** `/api/flare/submit-news`

Enviar noticia para validación con contexto de precio.

**Request Body:**

```json
{
  "content": "Bitcoin alcanza nuevo máximo histórico...",
  "sourceUrl": "https://example.com/news/bitcoin-ath",
  "priceSymbol": "BTC",
  "signature": "0x123abc...",
  "address": "0x742d35Cc6634C0532925a3b8D84dCdB7E0e9b2D1"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "transactionHash": "0xabc123...",
    "newsHash": "0x789def...",
    "sourceUrl": "https://example.com/news/bitcoin-ath",
    "priceSymbol": "BTC",
    "network": "coston2",
    "explorer": "https://coston2.testnet.flarescan.com/tx/0xabc123..."
  }
}
```

#### **POST** `/api/flare/validate-news`

Validar noticia usando FDC (Flare Data Connector).

**Request Body:**

```json
{
  "newsHash": "0x789def...",
  "attestationData": "0x456ghi...",
  "merkleProof": ["0x111...", "0x222..."],
  "signature": "0x123abc...",
  "address": "0x742d35Cc6634C0532925a3b8D84dCdB7E0e9b2D1"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "transactionHash": "0xdef456...",
    "newsHash": "0x789def...",
    "validator": "0x742d35Cc6634C0532925a3b8D84dCdB7E0e9b2D1",
    "network": "coston2",
    "explorer": "https://coston2.testnet.flarescan.com/tx/0xdef456..."
  }
}
```

#### **POST** `/api/flare/register-validator`

Registrar validador con stake en FLR.

**Request Body:**

```json
{
  "stakeAmount": 1.5,
  "signature": "0x123abc...",
  "address": "0x742d35Cc6634C0532925a3b8D84dCdB7E0e9b2D1"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "transactionHash": "0x987zyx...",
    "validator": "0x742d35Cc6634C0532925a3b8D84dCdB7E0e9b2D1",
    "stakedAmount": 1.5,
    "network": "coston2",
    "explorer": "https://coston2.testnet.flarescan.com/tx/0x987zyx..."
  }
}
```

#### **GET** `/api/flare/validation/:newsHash`

Obtener detalles de validación de una noticia.

**Response:**

```json
{
  "success": true,
  "data": {
    "sourceUrl": "https://example.com/news/bitcoin-ath",
    "timestamp": "1693478400",
    "credibilityScore": "85",
    "priceContext": "43250000000000000000000",
    "isValidated": true,
    "validatorCount": "3",
    "newsHash": "0x789def...",
    "network": "coston2"
  }
}
```

#### **GET** `/api/flare/media-credibility/:mediaName`

Obtener credibilidad de un medio de comunicación.

**Response:**

```json
{
  "success": true,
  "data": {
    "mediaName": "CoinDesk",
    "credibilityScore": "78",
    "validationsCount": "45",
    "lastUpdate": "1693478400",
    "isVerified": true,
    "network": "coston2"
  }
}
```

#### **GET** `/api/flare/validator/:address`

Obtener perfil de validador.

**Response:**

```json
{
  "success": true,
  "data": {
    "validatorAddress": "0x742d35Cc6634C0532925a3b8D84dCdB7E0e9b2D1",
    "reputation": "156",
    "validationsCount": "12",
    "stakedAmount": "1.5",
    "isActive": true,
    "network": "coston2"
  }
}
```

#### **GET** `/api/flare/status`

Obtener estado del oracle Flare.

**Response:**

```json
{
  "success": true,
  "data": {
    "isAvailable": true,
    "stats": {
      "network": "coston2",
      "blockNumber": 123456,
      "pricesAvailable": true,
      "randomAvailable": true,
      "contractDeployed": true,
      "timestamp": 1693478400000
    },
    "network": {
      "network": "coston2",
      "chainId": 114,
      "rpcUrl": "https://coston2-api.flare.network/ext/C/rpc",
      "explorer": "https://coston2.testnet.flarescan.com/",
      "contractAddress": "0x123abc..."
    },
    "timestamp": 1693478400000
  }
}
```

### ⏱️ Rate Limiting

#### Límites por Endpoint

| Endpoint                     | Límite       | Ventana | Nota       |
| ---------------------------- | ------------ | ------- | ---------- |
| `/api/validation/submit`     | 10 requests  | 1 hora  | Por IP     |
| `/api/oracle/validate`       | 50 requests  | 15 min  | Por wallet |
| `/api/validation/:hash/vote` | 20 requests  | 15 min  | Por wallet |
| `/api/truthboard/publish`    | 5 requests   | 1 hora  | Por IP     |
| `/api/confidential/*`        | 30 requests  | 15 min  | Por IP     |
| `/api/filecoin/*`            | 10 requests  | 1 hora  | Por IP     |
| `/api/flare/*`               | 50 requests  | 15 min  | Por IP     |
| **General**                  | 100 requests | 15 min  | Por IP     |

#### Headers de Rate Limiting

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1693478400
X-RateLimit-Window: 900
```

#### Manejo de Rate Limiting en Frontend

```javascript
const makeAPIRequest = async (url, options) => {
  try {
    const response = await fetch(url, options);

    // Verificar rate limiting
    if (response.status === 429) {
      const resetTime = response.headers.get("X-RateLimit-Reset");
      const waitTime = parseInt(resetTime) * 1000 - Date.now();

      throw new Error(
        `Rate limit excedido. Espera ${Math.ceil(waitTime / 1000)} segundos`
      );
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error en la solicitud");
    }

    return data;
  } catch (error) {
    console.error("Error en API request:", error);
    throw error;
  }
};
```

### 🔒 Autenticación y Autorización

#### Niveles de Acceso

```javascript
// Público - Sin autenticación requerida
GET /api/validation/:contentHash
GET /api/news/feed
GET /api/news/trending
GET /health

// Autenticado - Requiere firma válida
POST /api/validation/:contentHash/vote  // Validadores registrados
POST /api/oracle/validate               // Oráculos registrados
POST /api/truthboard/validate          // Validadores anónimos

// Privilegiado - Requiere stake mínimo
POST /api/oracle/register              // Stake mínimo: 10 ETH
POST /api/staking/validator/register   // Stake mínimo: 5 ETH

// Administrativo - Solo contratos
POST /api/validation/submit            // Cualquiera puede enviar
POST /api/staking/slash               // Solo smart contract
```

#### Middleware de Autenticación

```javascript
const authMiddleware = async (req, res, next) => {
  try {
    const { walletAddress, signature } = req.body;

    if (!walletAddress || !signature) {
      return res.status(401).json({
        error: "Autenticación requerida",
        code: "AUTH_REQUIRED",
      });
    }

    // Verificar firma según el endpoint
    const isValid = await verifyEndpointSignature(req.path, req.body);

    if (!isValid) {
      return res.status(401).json({
        error: "Firma inválida",
        code: "INVALID_SIGNATURE",
      });
    }

    // Agregar wallet verificada al request
    req.verifiedWallet = walletAddress;
    next();
  } catch (error) {
    res.status(500).json({
      error: "Error de autenticación",
      message: error.message,
    });
  }
};
```

### 📊 Validación de Datos

#### Esquemas de Validación

```javascript
// Validación de registro de oráculo
const oracleRegistrationSchema = {
  walletAddress: {
    type: "string",
    pattern: "^0x[a-fA-F0-9]{40}$",
    required: true,
  },
  specialization: {
    type: "string",
    enum: ["fake_news", "deepfake", "image_manipulation", "text_analysis"],
    required: true,
  },
  stake: {
    type: "string",
    pattern: "^[0-9]+\\.?[0-9]*$",
    minimum: 10.0,
    required: true,
  },
  signature: {
    type: "string",
    pattern: "^0x[a-fA-F0-9]{130}$",
    required: true,
  },
};

// Validación de voto comunitario
const communityVoteSchema = {
  walletAddress: {
    type: "string",
    pattern: "^0x[a-fA-F0-9]{40}$",
    required: true,
  },
  vote: {
    type: "integer",
    minimum: 0,
    maximum: 100,
    required: true,
  },
  signature: {
    type: "string",
    pattern: "^0x[a-fA-F0-9]{130}$",
    required: true,
  },
};
```

### 🔄 Estados y Transiciones

#### Estados de Validación

```mermaid
graph TD
    A[Submitted] --> B[Processing]
    B --> C[Oracle Analysis]
    C --> D[Community Voting]
    D --> E[Consensus Calculation]
    E --> F[Completed]
    E --> G[Disputed]
    G --> H[Re-evaluation]
    H --> F

    B --> I[Failed]
    C --> I
    D --> I
```

#### Estados de Oráculos

```javascript
const OracleStates = {
  PENDING: "pending", // Registro pendiente
  ACTIVE: "active", // Activo y validando
  SLASHED: "slashed", // Penalizado por mal comportamiento
  WITHDRAWN: "withdrawn", // Retirado voluntariamente
  DISPUTED: "disputed", // En disputa por validaciones incorrectas
};
```

### 📈 Métricas y Logging

#### Logs Estructurados

```javascript
const log = {
  timestamp: "2025-08-31T10:30:00.000Z",
  level: "INFO",
  service: "trueblock-api",
  endpoint: "/api/oracle/validate",
  walletAddress: "0x123...",
  contentHash: "0x1a2b3c...",
  vote: 1,
  confidence: 90,
  transactionHash: "0x4d5e6f...",
  processingTime: 1250, // ms
  gasUsed: 85000,
  success: true,
};
```

#### Métricas Clave a Monitorear

```javascript
const metrics = {
  // Performance
  "api.response_time": "histogram",
  "api.requests_per_second": "counter",
  "blockchain.gas_usage": "histogram",

  // Business
  "validations.submitted": "counter",
  "validations.completed": "counter",
  "oracles.active": "gauge",
  "validators.reputation_avg": "gauge",

  // Errors
  "api.errors": "counter",
  "signatures.invalid": "counter",
  "rate_limits.exceeded": "counter",

  // Blockchain
  "transactions.pending": "gauge",
  "transactions.failed": "counter",
  "blocks.processed": "counter",
};
```

### 🔧 Configuración Avanzada

#### Variables de Entorno Completas

```bash
# === CORE CONFIGURATION ===
NODE_ENV=production
PORT=3000
API_VERSION=v1
LOG_LEVEL=info

# === BLOCKCHAIN NETWORKS ===
PRIVATE_KEY=0x...
MNEMONIC="your twelve word mnemonic phrase here"

# Ethereum Mainnet/Sepolia
ETHEREUM_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
ETHEREUM_CHAIN_ID=11155111
TRUEBLOCK_CONTRACT_ADDRESS=0x112baa264d204d6e952d927761b91E9a68B9c0D2

# Citrea Bitcoin L2
CITREA_RPC_URL=https://rpc.testnet.citrea.xyz
CITREA_CHAIN_ID=5115
TRUTHBOARD_CONTRACT_ADDRESS=0x112baa264d204d6e952d927761b91E9a68B9c0D2

# Zama FHE
ZAMA_RPC_URL=https://devnet.zama.ai
ZAMA_CHAIN_ID=8009
CONFIDENTIAL_CONTRACT_ADDRESS=0x345E4DB2fa4E615842D51DAf6D2ae4a831220876
ZAMA_FHE_ADDRESS=0x000000000000000000000000000000000000005d
ZAMA_RELAYER_URL=https://relayer.zama.ai

# Base Network
BASE_RPC_URL=https://mainnet.base.org
BASE_CHAIN_ID=8453
MINIAPP_CONTRACT_ADDRESS=0x...

# Filecoin
FILECOIN_RPC_URL=https://api.node.glif.io/rpc/v1
FILECOIN_CHAIN_ID=314
FILECOIN_STORAGE_CONTRACT=0x...

# === AI SERVICES ===
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
HUGGINGFACE_API_KEY=hf_...
HUGGINGFACE_MODEL=distilbert-base-uncased

# === STORAGE SERVICES ===
IPFS_NODE_URL=http://localhost:5001
IPFS_GATEWAY_URL=https://ipfs.io/ipfs/
LIGHTHOUSE_API_KEY=...
APILON_API_KEY=...

# === DATABASE ===
DATABASE_URL=postgresql://user:pass@localhost:5432/trueblock
REDIS_URL=redis://localhost:6379

# === SECURITY ===
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=https://app.trueblock.io
RATE_LIMIT_WINDOW=900000  # 15 minutes
RATE_LIMIT_MAX=100

# === MONITORING ===
SENTRY_DSN=https://...
PROMETHEUS_PORT=9090
GRAFANA_URL=http://localhost:3001
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
- **Flare Network Track**: Oráculos de datos nativos y validación económica

---

## 🔍 Guía de Zero-Knowledge Proofs para TruthBoard

### Conceptos Básicos de ZK

#### ¿Qué son los ZK Proofs?

Los **Zero-Knowledge proofs** permiten probar que conoces un secreto sin revelarlo. En TruthBoard, esto permite:

- **Publicar** noticias sin revelar la identidad del periodista
- **Validar** contenido sin exponer quién es el validador
- **Donar** de forma anónima a periodistas
- **Mantener reputación** sin perder anonimato

#### Componentes ZK en TruthBoard

1. **Commitment**: Compromiso criptográfico con la identidad
2. **Proof**: Prueba de que conoces el secreto sin revelarlo
3. **Nullifier**: Previene doble gasto/uso del mismo secreto

### Cómo Obtener ZK Data (Commitment, Proof, Nullifier)

#### 1. Instalación de Dependencias ZK

```bash
npm install circomlib
npm install snarkjs
npm install @zk-kit/identity
npm install @zk-kit/protocols
```

#### 2. Generar Identidad ZK

```javascript
// Frontend: Generar identidad ZK para periodista
import { Identity } from "@zk-kit/identity";
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols";

const generateZKIdentity = async (userSeed) => {
  try {
    // Generar identidad única basada en seed del usuario
    const identity = new Identity(userSeed || "random-seed-" + Date.now());

    return {
      commitment: identity.commitment.toString(),
      nullifier: identity.nullifier.toString(),
      trapdoor: identity.trapdoor.toString(),
      secret: identity.secret.toString(),
    };
  } catch (error) {
    console.error("Error generando identidad ZK:", error);
    throw error;
  }
};

// Ejemplo de uso
const createAnonymousIdentity = async () => {
  // Puede usar datos del wallet para determinismo
  const userSeed = await window.ethereum.request({
    method: "personal_sign",
    params: [
      "Generate TruthBoard Anonymous Identity",
      await getWalletAddress(),
    ],
  });

  const zkIdentity = await generateZKIdentity(userSeed);

  console.log("ZK Identity creada:");
  console.log("Commitment:", zkIdentity.commitment);
  console.log("Nullifier:", zkIdentity.nullifier);

  return zkIdentity;
};
```

#### 3. Generar Proof para Publicación

```javascript
const generatePublicationProof = async (zkIdentity, content, title) => {
  try {
    // Parámetros del circuito ZK
    const signal = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(content + title)
    );

    // Generar proof usando Semaphore protocol
    const proof = await Semaphore.generateProof(zkIdentity.secret, {
      externalNullifier: signal,
      signal: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(content)),
    });

    return {
      commitment: zkIdentity.commitment,
      proof: {
        a: proof.a,
        b: proof.b,
        c: proof.c,
      },
      nullifier: proof.nullifierHash,
      signal: signal,
    };
  } catch (error) {
    console.error("Error generando proof de publicación:", error);
    throw error;
  }
};

// Uso para publicar noticia anónima
const publishAnonymousNews = async (content, title, region) => {
  // 1. Crear o recuperar identidad ZK
  const zkIdentity = await createAnonymousIdentity();

  // 2. Generar proof para esta publicación específica
  const zkProof = await generatePublicationProof(zkIdentity, content, title);

  // 3. Enviar a API
  const response = await fetch("/api/truthboard/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: content,
      title: title,
      region: region,
      publisherIdentity: {
        commitment: zkProof.commitment,
        proof: JSON.stringify(zkProof.proof),
        nullifier: zkProof.nullifier,
      },
    }),
  });

  return response.json();
};
```

#### 4. Generar Proof para Validación

```javascript
const generateValidationProof = async (zkIdentity, newsHash, vote) => {
  try {
    // Signal específico para validación
    const validationSignal = ethers.utils.keccak256(
      ethers.utils.solidityPack(["bytes32", "uint256"], [newsHash, vote])
    );

    // Generar proof de validación
    const proof = await Semaphore.generateProof(zkIdentity.secret, {
      externalNullifier: validationSignal,
      signal: validationSignal,
    });

    return {
      commitment: zkIdentity.commitment,
      proof: {
        a: proof.a,
        b: proof.b,
        c: proof.c,
      },
      nullifier: proof.nullifierHash,
      signal: validationSignal,
    };
  } catch (error) {
    console.error("Error generando proof de validación:", error);
    throw error;
  }
};

// Uso para validar noticia anónimamente
const validateNewsAnonymously = async (newsHash, vote) => {
  // 1. Recuperar identidad ZK del validador
  const zkIdentity = await createAnonymousIdentity();

  // 2. Generar proof para esta validación
  const zkProof = await generateValidationProof(zkIdentity, newsHash, vote);

  // 3. Enviar validación anónima
  const response = await fetch("/api/truthboard/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      newsHash: newsHash,
      vote: vote,
      validatorCommitment: {
        commitment: zkProof.commitment,
        proof: JSON.stringify(zkProof.proof),
        nullifier: zkProof.nullifier,
      },
    }),
  });

  return response.json();
};
```

#### 5. Gestión de Identidades ZK

```javascript
// Almacenamiento seguro de identidades ZK
const ZKIdentityManager = {
  // Guardar identidad en localStorage cifrada
  saveIdentity: async (alias, zkIdentity, password) => {
    try {
      const encryptedIdentity = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: crypto.getRandomValues(new Uint8Array(12)),
        },
        await crypto.subtle.importKey(
          "raw",
          new TextEncoder().encode(password),
          { name: "AES-GCM" },
          false,
          ["encrypt"]
        ),
        new TextEncoder().encode(JSON.stringify(zkIdentity))
      );

      localStorage.setItem(
        `zk_identity_${alias}`,
        JSON.stringify({
          encrypted: Array.from(new Uint8Array(encryptedIdentity)),
          timestamp: Date.now(),
        })
      );

      return true;
    } catch (error) {
      console.error("Error guardando identidad ZK:", error);
      return false;
    }
  },

  // Recuperar identidad del almacenamiento
  loadIdentity: async (alias, password) => {
    try {
      const stored = localStorage.getItem(`zk_identity_${alias}`);
      if (!stored) return null;

      const { encrypted } = JSON.parse(stored);

      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: new Uint8Array(12), // En producción, guardar IV
        },
        await crypto.subtle.importKey(
          "raw",
          new TextEncoder().encode(password),
          { name: "AES-GCM" },
          false,
          ["decrypt"]
        ),
        new Uint8Array(encrypted)
      );

      return JSON.parse(new TextDecoder().decode(decrypted));
    } catch (error) {
      console.error("Error cargando identidad ZK:", error);
      return null;
    }
  },

  // Listar identidades disponibles
  listIdentities: () => {
    const identities = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("zk_identity_")) {
        identities.push(key.replace("zk_identity_", ""));
      }
    }
    return identities;
  },
};
```

### Verificación ZK en Backend

```javascript
// Backend: Verificar proofs ZK
const { Semaphore } = require("@zk-kit/protocols");

const verifyZKProof = async (commitment, proof, nullifier, signal) => {
  try {
    // Verificar que el proof es válido
    const isValid = await Semaphore.verifyProof({
      commitment: commitment,
      proof: JSON.parse(proof),
      nullifierHash: nullifier,
      externalNullifier: signal,
      signal: signal,
    });

    if (!isValid) {
      return { valid: false, error: "Proof ZK inválido" };
    }

    // Verificar que el nullifier no se ha usado antes
    const nullifierExists = await checkNullifierExists(nullifier);
    if (nullifierExists) {
      return { valid: false, error: "Nullifier ya utilizado" };
    }

    // Guardar nullifier para prevenir reutilización
    await saveNullifier(nullifier);

    return { valid: true };
  } catch (error) {
    console.error("Error verificando proof ZK:", error);
    return { valid: false, error: error.message };
  }
};

// Base de datos de nullifiers (previene double-spending)
const nullifierDB = new Set(); // En producción usar database

const checkNullifierExists = async (nullifier) => {
  return nullifierDB.has(nullifier);
};

const saveNullifier = async (nullifier) => {
  nullifierDB.add(nullifier);
  // En producción: await db.nullifiers.insert({ nullifier, timestamp: Date.now() });
};
```

### Ejemplo Completo: Flujo Anónimo

```javascript
// Frontend completo: Publicar noticia anónima
const completeAnonymousPublishing = async () => {
  try {
    console.log("🔐 Iniciando publicación anónima...");

    // 1. Crear identidad ZK
    const zkIdentity = await createAnonymousIdentity();
    console.log("✅ Identidad ZK creada");

    // 2. Preparar contenido
    const content = "Investigación sobre corrupción...";
    const title = "Revelación importante";
    const region = "global";

    // 3. Generar proof
    const zkProof = await generatePublicationProof(zkIdentity, content, title);
    console.log("✅ Proof ZK generado");

    // 4. Publicar anónimamente
    const result = await publishAnonymousNews(content, title, region);
    console.log("✅ Noticia publicada anónimamente:", result);

    // 5. Guardar identidad para futuras validaciones
    await ZKIdentityManager.saveIdentity(
      "journalist_1",
      zkIdentity,
      "password123"
    );
    console.log("✅ Identidad guardada para uso futuro");

    return result;
  } catch (error) {
    console.error("❌ Error en publicación anónima:", error);
    throw error;
  }
};
```

### Consideraciones de Seguridad ZK

1. **Seed Management**: El seed de la identidad debe ser secreto y único
2. **Nullifier Uniqueness**: Cada acción debe generar un nullifier único
3. **Proof Verification**: Siempre verificar proofs en el backend
4. **Storage Security**: Cifrar identidades ZK en almacenamiento local
5. **Circuit Security**: Usar circuitos ZK auditados y confiables

### Debugging ZK Proofs

```javascript
const debugZKProof = (commitment, proof, nullifier) => {
  console.log("🔍 Debugging ZK Proof:");
  console.log("Commitment:", commitment);
  console.log("Proof:", JSON.stringify(proof, null, 2));
  console.log("Nullifier:", nullifier);
  console.log("Commitment length:", commitment.length);
  console.log("Nullifier length:", nullifier.length);

  // Verificar formato
  const commitmentRegex = /^0x[a-fA-F0-9]+$/;
  const nullifierRegex = /^0x[a-fA-F0-9]+$/;

  console.log("Commitment format OK:", commitmentRegex.test(commitment));
  console.log("Nullifier format OK:", nullifierRegex.test(nullifier));
};
```

---

**TrueBlock & TruthBoard Ecosystem** - Construyendo el futuro de la información verificable mediante tecnología descentralizada 🌐✨🔐

_"La verdad es la primera víctima de la guerra... y la primera aliada de la tecnología descentralizada"_
