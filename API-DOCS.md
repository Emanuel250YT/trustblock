# TrueBlock & TruthBoard API Documentation

## Información General

La plataforma TrueBlock ofrece múltiples APIs especializadas para diferentes casos de uso:

- **TrueBlock**: Validación descentralizada de noticias con IA y comunidad
- **TruthBoard**: Periodismo anónimo con Zero-Knowledge proofs en Citrea
- **Confidential**: Validación FHE (Fully Homomorphic Encryption) con Zama
- **Filecoin**: Almacenamiento permanente y descentralizado

**Base URL**: `http://localhost:3000` (desarrollo) / `https://api.trueblock.app` (producción)

**Rate Limit**: 100 requests por 15 minutos por IP

---

## 📊 Endpoints de Sistema

### Health Check
```http
GET /health
```

**Respuesta exitosa (200)**:
```json
{
  "status": "OK",
  "message": "TrueBlock & TruthBoard API están funcionando",
  "timestamp": "2025-08-30T10:30:00.000Z",
  "version": "1.0.0",
  "services": {
    "trueblock": "Active - Decentralized news validation",
    "truthboard": "Active - Anonymous journalism with ZK on Citrea",
    "filecoin": "Active - Permanent storage & retrieval",
    "confidential": "Active - FHE encrypted validation with Zama"
  }
}
```

### Información de la API
```http
GET /api/info
```

**Respuesta exitosa (200)**:
```json
{
  "platforms": {
    "trueblock": {
      "name": "TrueBlock API",
      "description": "Plataforma descentralizada para validación de noticias",
      "blockchain": "Ethereum/Polygon compatible",
      "features": [...],
      "endpoints": {...}
    }
  },
  "version": "1.0.0"
}
```

---

## 🔍 TrueBlock - Validación de Noticias

### Enviar Noticia para Validación
```http
POST /api/validation/submit
```

**Cuerpo de la Solicitud**:
```json
{
  "url": "https://example.com/news-article", // Opcional si se provee content
  "content": "Texto completo de la noticia...", // Opcional si se provee url
  "title": "Título de la noticia" // Opcional
}
```

**Validaciones**:
- Al menos `url` o `content` es requerido
- `title` se auto-genera si no se proporciona

**Respuesta exitosa (201)**:
```json
{
  "success": true,
  "message": "Noticia enviada para validación",
  "data": {
    "contentHash": "QmXYZ123...",
    "transactionHash": "0xabc123...",
    "processedContent": {
      "title": "Título procesado",
      "summary": "Resumen auto-generado...",
      "timestamp": "2025-08-30T10:30:00.000Z"
    }
  }
}
```

**Respuesta de error (400)**:
```json
{
  "error": "URL o contenido requerido",
  "message": "Debes proporcionar al menos una URL o contenido de texto"
}
```

### Obtener Estado de Validación
```http
GET /api/validation/status/:contentHash
```

**Parámetros de URL**:
- `contentHash`: Hash IPFS del contenido

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "contentHash": "QmXYZ123...",
    "status": "validated", // pending, validating, validated, rejected
    "score": 85,
    "validations": {
      "ai_oracles": 3,
      "community_validators": 12,
      "total_votes": 15
    },
    "breakdown": {
      "fake_news_score": 10,
      "deepfake_score": 5,
      "bias_score": 20,
      "credibility_score": 90
    },
    "timestamp": "2025-08-30T10:30:00.000Z"
  }
}
```

### Votar en Validación
```http
POST /api/validation/vote
```

**Cuerpo de la Solicitud**:
```json
{
  "contentHash": "QmXYZ123...",
  "walletAddress": "0x1234567890abcdef...",
  "vote": true, // true = real, false = fake
  "confidence": 85, // 1-100
  "evidence": "Enlace o descripción de la evidencia",
  "signature": "0xsignature..."
}
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Voto registrado exitosamente",
  "data": {
    "voteId": "vote_123",
    "transactionHash": "0xdef456...",
    "reward": "0.05 ETH",
    "newReputation": 750
  }
}
```

---

## 🤖 Oráculos de IA

### Registrar Oráculo
```http
POST /api/oracle/register
```

**Cuerpo de la Solicitud**:
```json
{
  "walletAddress": "0x1234567890abcdef...",
  "specialization": "fake_news", // fake_news, deepfake, image_manipulation, text_analysis
  "stake": "10.0", // Mínimo en ETH
  "signature": "0xsignature..."
}
```

**Respuesta exitosa (201)**:
```json
{
  "success": true,
  "message": "Oráculo registrado exitosamente",
  "data": {
    "oracleId": "oracle_123",
    "transactionHash": "0xabc123...",
    "specialization": "fake_news",
    "stake": "10.0 ETH",
    "status": "active"
  }
}
```

### Ejecutar Validación de Oráculo
```http
POST /api/oracle/validate
```

**Cuerpo de la Solicitud**:
```json
{
  "contentHash": "QmXYZ123...",
  "oracleAddress": "0x1234567890abcdef...",
  "validationType": "fake_news", // fake_news, deepfake, image_manipulation, text_analysis
  "signature": "0xsignature..."
}
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Validación completada",
  "data": {
    "validationId": "val_123",
    "score": 85,
    "confidence": 95,
    "details": {
      "fake_probability": 15,
      "bias_detected": false,
      "source_credibility": 90,
      "fact_check_results": {...}
    },
    "transactionHash": "0xdef456..."
  }
}
```

### Obtener Estadísticas de Oráculo
```http
GET /api/oracle/stats/:oracleAddress
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "oracleAddress": "0x1234567890abcdef...",
    "specialization": "fake_news",
    "totalValidations": 1250,
    "accuracy": 92.5,
    "reputation": 850,
    "stake": "15.5 ETH",
    "rewards": "2.3 ETH",
    "performance": {
      "last_7_days": 45,
      "success_rate": 94.2,
      "avg_response_time": "2.3s"
    }
  }
}
```

---

## 💰 Sistema de Staking

### Registrar Validador Comunitario
```http
POST /api/staking/validator/register
```

**Cuerpo de la Solicitud**:
```json
{
  "walletAddress": "0x1234567890abcdef...",
  "category": "journalist", // journalist, fact_checker, expert, community
  "stake": "5.0", // Mínimo en ETH según categoría
  "signature": "0xsignature..."
}
```

**Respuesta exitosa (201)**:
```json
{
  "success": true,
  "message": "Validador registrado exitosamente",
  "data": {
    "validatorId": "val_123",
    "transactionHash": "0xabc123...",
    "category": "journalist",
    "stake": "5.0 ETH",
    "reputation": 500,
    "status": "active"
  }
}
```

### Hacer Stake
```http
POST /api/staking/stake
```

**Cuerpo de la Solicitud**:
```json
{
  "walletAddress": "0x1234567890abcdef...",
  "amount": "2.5",
  "signature": "0xsignature..."
}
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Stake aumentado exitosamente",
  "data": {
    "newStakeAmount": "7.5 ETH",
    "transactionHash": "0xdef456...",
    "stakingRewards": "0.15 ETH"
  }
}
```

### Retirar Stake (Unstake)
```http
POST /api/staking/unstake
```

**Cuerpo de la Solicitud**:
```json
{
  "walletAddress": "0x1234567890abcdef...",
  "amount": "1.0",
  "signature": "0xsignature..."
}
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Unstake iniciado",
  "data": {
    "unstakeAmount": "1.0 ETH",
    "cooldownPeriod": "7 days",
    "availableAt": "2025-09-06T10:30:00.000Z",
    "transactionHash": "0xghi789..."
  }
}
```

### Obtener Estado de Staking
```http
GET /api/staking/status/:walletAddress
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "walletAddress": "0x1234567890abcdef...",
    "totalStaked": "6.5 ETH",
    "availableRewards": "0.25 ETH",
    "reputation": 720,
    "validatorCategory": "journalist",
    "pendingUnstakes": [
      {
        "amount": "1.0 ETH",
        "availableAt": "2025-09-06T10:30:00.000Z"
      }
    ],
    "slashingHistory": []
  }
}
```

---

## 📰 Feed de Noticias

### Obtener Feed de Noticias
```http
GET /api/news/feed?page=1&limit=20&status=verified&category=politics&minScore=75
```

**Parámetros de consulta**:
- `page`: Número de página (default: 1)
- `limit`: Noticias por página (max: 50, default: 20)
- `status`: Estado de validación (`verified`, `fake`, `uncertain`, `pending`)
- `category`: Categoría de la noticia
- `minScore`: Puntuación mínima de validación

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": [
    {
      "contentHash": "QmXYZ123...",
      "title": "Título de la noticia",
      "summary": "Resumen de la noticia...",
      "url": "https://example.com/news",
      "status": "verified",
      "score": 85,
      "category": "politics",
      "timestamp": "2025-08-30T10:30:00.000Z",
      "validations": {
        "total": 15,
        "ai_oracles": 3,
        "community": 12
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Obtener Detalle de Noticia
```http
GET /api/news/:contentHash
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "contentHash": "QmXYZ123...",
    "title": "Título completo",
    "content": "Contenido completo de la noticia...",
    "url": "https://example.com/news",
    "status": "verified",
    "finalScore": 85,
    "detailedAnalysis": {
      "fake_news_probability": 15,
      "bias_score": 20,
      "credibility_score": 90,
      "fact_check_results": {...}
    },
    "validationHistory": [...],
    "ipfsHash": "QmXYZ123...",
    "filecoinArchive": "bafybeiabc123..."
  }
}
```

### Buscar Noticias
```http
POST /api/news/search
```

**Cuerpo de la Solicitud**:
```json
{
  "query": "elecciones 2024",
  "filters": {
    "status": "verified",
    "dateFrom": "2025-01-01",
    "dateTo": "2025-08-30",
    "minScore": 70
  },
  "page": 1,
  "limit": 20
}
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "results": [...],
    "totalResults": 45,
    "searchTime": "0.23s"
  },
  "meta": {...}
}
```

---

## 🔒 TruthBoard - Periodismo Anónimo

### Publicar Noticia Anónima
```http
POST /api/truthboard/publish
```

**Cuerpo de la Solicitud**:
```json
{
  "content": "Contenido completo de la noticia investigativa...",
  "title": "Título de la investigación",
  "region": "latam", // latam, usa, europe, asia, africa, global
  "publisherIdentity": {
    "zkProof": "proof_data...",
    "commitment": "commitment_hash...",
    "nullifier": "nullifier_hash..."
  }
}
```

**Respuesta exitosa (201)**:
```json
{
  "success": true,
  "message": "Noticia publicada anónimamente",
  "data": {
    "articleId": "zk_article_123",
    "citreaTransactionHash": "0xabc123...",
    "ipfsHash": "QmXYZ123...",
    "zkProofVerified": true,
    "donationAddress": "0xdonation123...",
    "anonymityScore": 95
  }
}
```

### Registrar Validador Anónimo
```http
POST /api/truthboard/validator/register
```

**Cuerpo de la Solicitud**:
```json
{
  "identity": {
    "zkProof": "proof_data...",
    "commitment": "commitment_hash...",
    "nullifier": "nullifier_hash..."
  },
  "region": "latam",
  "stake": "1.0" // en cBTC o token nativo
}
```

**Respuesta exitosa (201)**:
```json
{
  "success": true,
  "message": "Validador anónimo registrado",
  "data": {
    "validatorId": "zk_val_123",
    "citreaTransactionHash": "0xdef456...",
    "anonymousReputation": 500,
    "region": "latam"
  }
}
```

### Validar Artículo Anónimamente
```http
POST /api/truthboard/validate
```

**Cuerpo de la Solicitud**:
```json
{
  "articleId": "zk_article_123",
  "validatorIdentity": {
    "zkProof": "proof_data...",
    "nullifier": "nullifier_hash..."
  },
  "validation": {
    "score": 85,
    "confidence": 90,
    "evidence": "Hash de evidencia en IPFS",
    "encrypted": true
  }
}
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Validación anónima registrada",
  "data": {
    "validationId": "zk_validation_123",
    "citreaTransactionHash": "0xghi789...",
    "anonymousReward": "0.01 cBTC",
    "proofVerified": true
  }
}
```

### Hacer Donación Anónima
```http
POST /api/truthboard/donate
```

**Cuerpo de la Solicitud**:
```json
{
  "articleId": "zk_article_123",
  "amount": "0.05", // en cBTC
  "donorIdentity": {
    "zkProof": "proof_data...",
    "nullifier": "nullifier_hash..."
  },
  "message": "Hash cifrado del mensaje opcional"
}
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Donación anónima procesada",
  "data": {
    "donationId": "zk_donation_123",
    "citreaTransactionHash": "0xjkl012...",
    "amount": "0.05 cBTC",
    "anonymityPreserved": true
  }
}
```

### Obtener Estadísticas de TruthBoard
```http
GET /api/truthboard/stats
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "totalArticles": 1250,
    "activeValidators": 89,
    "totalDonations": "15.7 cBTC",
    "averageAnonymityScore": 94.2,
    "regionStats": {
      "latam": 340,
      "usa": 280,
      "europe": 350,
      "asia": 180,
      "africa": 100
    },
    "citreaNetworkStatus": "healthy",
    "bitcoinAnchorHeight": 850000
  }
}
```

---

## 🗃️ Filecoin - Almacenamiento Permanente

### Archivar Noticia Validada
```http
POST /api/filecoin/archive/news
```

**Cuerpo de la Solicitud**:
```json
{
  "contentHash": "QmXYZ123...",
  "title": "Título de la noticia",
  "content": "Contenido completo...",
  "validationScore": 85,
  "validators": [
    {
      "address": "0x1234...",
      "vote": true,
      "confidence": 90
    }
  ]
}
```

**Validaciones**:
- `validationScore` debe ser ≥ 75
- Solo noticias verificadas se archivan permanentemente

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Noticia archivada permanentemente en Filecoin",
  "data": {
    "filecoinCid": "bafybeiabc123...",
    "dealId": "deal_123",
    "storageProvider": "f01234",
    "storageCost": "0.001 FIL",
    "retrievalUrl": "https://gateway.ipfs.io/ipfs/bafybeiabc123...",
    "expirationDate": "2026-08-30T10:30:00.000Z"
  }
}
```

### Almacenar Evidencia
```http
POST /api/filecoin/evidence/store
```

**Cuerpo de la Solicitud**:
```json
{
  "contentHash": "QmXYZ123...",
  "evidenceType": "image", // image, document, video, link
  "evidenceData": "base64_encoded_data_or_url",
  "validatorAddress": "0x1234567890abcdef...",
  "description": "Evidencia que demuestra la veracidad"
}
```

**Respuesta exitosa (201)**:
```json
{
  "success": true,
  "message": "Evidencia almacenada permanentemente",
  "data": {
    "evidenceId": "evidence_123",
    "filecoinCid": "bafybeievidence123...",
    "ipfsHash": "QmEvidenceHash...",
    "dealId": "deal_456",
    "storageProvider": "f05678"
  }
}
```

### Recuperar Contenido
```http
GET /api/filecoin/retrieve/:hash
```

**Parámetros de URL**:
- `hash`: CID de Filecoin o hash IPFS

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "cid": "bafybeiabc123...",
    "content": {...},
    "metadata": {
      "timestamp": "2025-08-30T10:30:00.000Z",
      "size": "1.2 MB",
      "storageProvider": "f01234",
      "dealStatus": "active"
    },
    "retrievalUrl": "https://gateway.ipfs.io/ipfs/bafybeiabc123..."
  }
}
```

### Estadísticas de Almacenamiento
```http
GET /api/filecoin/statistics
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "totalStored": "125.7 GB",
    "totalDeals": 1580,
    "activeDeals": 1245,
    "storageProviders": 45,
    "totalCost": "12.5 FIL",
    "averageRetrievalTime": "2.3s",
    "replicationFactor": 3,
    "networkHealth": "excellent"
  }
}
```

---

## 🔐 Confidential - Validación FHE

### Inicializar Servicio FHE
```http
POST /api/confidential/initialize
```

**Cuerpo de la Solicitud**:
```json
{
  "contractAddress": "0x1234567890abcdef...",
  "relayerConfig": {
    "endpoint": "https://relayer.zama.ai",
    "apiKey": "your_api_key"
  }
}
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Servicio FHE inicializado correctamente",
  "stats": {
    "contractAddress": "0x1234567890abcdef...",
    "fheLibVersion": "0.4.0",
    "relayerStatus": "connected",
    "encryptionReady": true
  }
}
```

### Registrar Validador Confidencial
```http
POST /api/confidential/register-validator
```

**Cuerpo de la Solicitud**:
```json
{
  "validatorAddress": "0x1234567890abcdef...",
  "initialReputation": 50, // Opcional, default: 50
  "validationHistory": [] // Opcional
}
```

**Respuesta exitosa (201)**:
```json
{
  "success": true,
  "message": "Validador registrado con reputación cifrada",
  "data": {
    "validatorId": "conf_val_123",
    "encryptedReputation": "encrypted_data...",
    "zkProof": "proof_of_registration...",
    "transactionHash": "0xabc123..."
  }
}
```

### Enviar Validación Confidencial
```http
POST /api/confidential/submit-validation
```

**Cuerpo de la Solicitud**:
```json
{
  "contentHash": "QmXYZ123...",
  "validatorAddress": "0x1234567890abcdef...",
  "encryptedVote": {
    "vote": "encrypted_boolean...", // Voto cifrado
    "confidence": "encrypted_score...", // Confianza cifrada
    "evidence": "encrypted_evidence_hash..." // Evidencia cifrada
  },
  "zkProof": "proof_of_valid_vote..."
}
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Validación confidencial registrada",
  "data": {
    "validationId": "conf_validation_123",
    "encryptedResult": "encrypted_aggregation...",
    "proofVerified": true,
    "transactionHash": "0xdef456...",
    "anonymityPreserved": true
  }
}
```

### Agregar Validaciones Confidenciales
```http
POST /api/confidential/aggregate-validations
```

**Cuerpo de la Solicitud**:
```json
{
  "contentHash": "QmXYZ123...",
  "validationIds": ["conf_validation_123", "conf_validation_124"],
  "aggregationProof": "proof_of_aggregation..."
}
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Validaciones agregadas preservando confidencialidad",
  "data": {
    "aggregationId": "conf_agg_123",
    "encryptedResult": {
      "totalVotes": "encrypted_count...",
      "positiveVotes": "encrypted_count...",
      "averageConfidence": "encrypted_average..."
    },
    "finalScore": 85, // Solo se revela si supera umbral
    "consensusReached": true
  }
}
```

### Actualizar Reputación Confidencial
```http
POST /api/confidential/update-reputation
```

**Cuerpo de la Solicitud**:
```json
{
  "validatorAddress": "0x1234567890abcdef...",
  "validationResult": "correct", // correct, incorrect
  "impactScore": "encrypted_impact...",
  "zkProof": "proof_of_performance..."
}
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Reputación actualizada confidencialmente",
  "data": {
    "validatorAddress": "0x1234567890abcdef...",
    "newEncryptedReputation": "encrypted_reputation...",
    "reputationDelta": "encrypted_change...",
    "proofVerified": true
  }
}
```

### Obtener Estadísticas de Validador Confidencial
```http
GET /api/confidential/validator-stats/:address
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "validatorAddress": "0x1234567890abcdef...",
    "encryptedStats": {
      "totalValidations": "encrypted_count...",
      "successRate": "encrypted_percentage...",
      "reputation": "encrypted_score..."
    },
    "publicStats": {
      "registrationDate": "2025-08-01T10:30:00.000Z",
      "isActive": true,
      "reputationTier": "high" // low, medium, high (basado en rangos cifrados)
    },
    "privacyLevel": "maximum"
  }
}
```

---

## 📋 Códigos de Error Comunes

### Errores del Cliente (4xx)

**400 - Bad Request**:
```json
{
  "error": "Parámetros inválidos",
  "message": "Descripción específica del error",
  "details": {
    "field": "campo_problematico",
    "expected": "valor_esperado"
  }
}
```

**401 - Unauthorized**:
```json
{
  "error": "No autorizado",
  "message": "Firma inválida o token expirado"
}
```

**404 - Not Found**:
```json
{
  "error": "Recurso no encontrado",
  "message": "El contentHash especificado no existe"
}
```

**429 - Too Many Requests**:
```json
{
  "error": "Demasiadas solicitudes",
  "message": "Límite de rate limiting excedido. Intenta de nuevo en 15 minutos.",
  "retryAfter": 900
}
```

### Errores del Servidor (5xx)

**500 - Internal Server Error**:
```json
{
  "error": "Error interno del servidor",
  "message": "Algo salió mal procesando tu solicitud"
}
```

**503 - Service Unavailable**:
```json
{
  "error": "Servicio no disponible",
  "message": "El servicio de blockchain está temporalmente fuera de línea"
}
```

---

## 🔐 Autenticación y Firmas

### Firmas de Wallet

La mayoría de endpoints que modifican estado requieren una firma criptográfica:

1. **Mensaje a firmar**: Se forma concatenando los parámetros principales
2. **Algoritmo**: ECDSA con secp256k1 (estándar Ethereum)
3. **Formato**: Firma hexadecimal (0x...)

**Ejemplo de mensaje para validación**:
```
TrueBlock Validation
Content Hash: QmXYZ123...
Validator: 0x1234567890abcdef...
Vote: true
Timestamp: 1693392600
```

### Headers Requeridos

```http
Content-Type: application/json
X-API-Version: 1.0
User-Agent: TrueBlock-Client/1.0
```

---

## 📊 Rate Limiting

- **Global**: 100 requests por 15 minutos por IP
- **Validación**: 10 validaciones por hora por wallet
- **Publicación**: 5 artículos por día por wallet (TruthBoard)
- **Búsqueda**: 50 búsquedas por minuto

---

## 🔧 Variables de Entorno

Para desarrollo local, configura estas variables en `.env`:

```env
NODE_ENV=development
PORT=3000
BLOCKCHAIN_RPC_URL=https://polygon-rpc.com
PRIVATE_KEY=your_private_key
IPFS_API_URL=https://ipfs.infura.io:5001
FILECOIN_API_URL=https://api.node.glif.io
ZAMA_RELAYER_URL=https://relayer.zama.ai
CITREA_RPC_URL=https://rpc.citrea.xyz
```

---

## 📚 SDKs y Ejemplos

### JavaScript/TypeScript
```javascript
import { TrueBlockAPI } from '@trueblock/sdk';

const api = new TrueBlockAPI({
  baseURL: 'https://api.trueblock.app',
  apiKey: 'your_api_key'
});

// Enviar noticia para validación
const result = await api.validation.submit({
  url: 'https://example.com/news',
  title: 'Breaking News'
});
```

### Python
```python
from trueblock import TrueBlockAPI

api = TrueBlockAPI(
    base_url='https://api.trueblock.app',
    api_key='your_api_key'
)

# Obtener feed de noticias
feed = api.news.get_feed(page=1, limit=20, status='verified')
```

---

## 🚀 Webhooks (Próximamente)

TrueBlock soportará webhooks para notificaciones en tiempo real:

- Validación completada
- Nueva donación recibida (TruthBoard)
- Cambio de reputación
- Resultado de agregación confidencial

---

## 📞 Soporte

- **Documentación**: [https://docs.trueblock.app](https://docs.trueblock.app)
- **GitHub**: [https://github.com/trueblock/api](https://github.com/trueblock/api)
- **Discord**: [https://discord.gg/trueblock](https://discord.gg/trueblock)
- **Email**: [support@trueblock.app](mailto:support@trueblock.app)

---

## 📄 Licencia

Esta API está licenciada bajo MIT License. Ver [LICENSE](LICENSE) para más detalles.
