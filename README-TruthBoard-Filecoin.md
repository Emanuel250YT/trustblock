# TruthBoard + Filecoin Integration

## 🎯 **Integración Completa Implementada**

### **🏗️ Arquitectura de 3 Capas**

```
┌─────────────────────────────────────────────────────────────┐
│                 TruthBoard + Filecoin                       │
│                 Programmable Storage                        │
├─────────────────┬─────────────────┬─────────────────────────┤
│    Citrea L2    │  Filecoin FVM   │      IPFS Layer         │
│  (ZK + Meta)    │ (Smart Storage) │   (Content Storage)     │
├─────────────────┼─────────────────┼─────────────────────────┤
│ • Anonymous     │ • Auto Archive  │ • News Content          │
│   Publishing    │ • Deal Logic    │ • Evidence Files        │
│ • ZK Validation │ • Payment Auto  │ • Encrypted Data        │
│ • Reputation    │ • Policy Engine │ • Public Snapshots     │
│ • Bitcoin Anchor│ • DAO Funding   │ • Audit Trails         │
└─────────────────┴─────────────────┴─────────────────────────┘
```

---

## ✅ **Componentes Implementados**

### **1. Smart Contract FVM (TruthBoardFilecoin.sol)**

- **Almacenamiento Automático**: Policies configurables para auto-archivado
- **Gestión de Deals**: Creación y tracking de storage deals
- **Financiamiento DAO**: Pool comunitario y fondos DAO
- **Audit Trail**: Trazabilidad completa de evidencia
- **Reputación On-chain**: Sistema de scoring para validadores

### **2. Filecoin Storage Service (filecoinStorageService.js)**

- **IPFS Integration**: Web3.Storage + Estuary APIs
- **Deal Management**: Creación automática de deals
- **Content Retrieval**: Recuperación garantizada desde múltiples gateways
- **Statistics**: Métricas completas de almacenamiento
- **Network Status**: Monitoring de red Filecoin

### **3. API Endpoints (/api/filecoin/\*)**

- **Archive News**: POST `/api/filecoin/archive/news`
- **Store Evidence**: POST `/api/filecoin/evidence/store`
- **Create Snapshots**: POST `/api/filecoin/snapshot/create`
- **Retrieve Content**: GET `/api/filecoin/retrieve/:hash`
- **Network Status**: GET `/api/filecoin/network/status`

### **4. ZK TruthBoard Integration**

- **Auto-Archive**: Noticias con score ≥75 se archivan automáticamente
- **Evidence Storage**: Evidencia de validación permanente
- **Enhanced Stats**: Estadísticas incluyendo métricas Filecoin

---

## 🚀 **Casos de Uso Implementados**

### **📰 Archivado Automático de Noticias**

```bash
# Noticia validada con score alto → Auto-archive en Filecoin
POST /api/truthboard/validate
{
  "newsHash": "0x1234...",
  "vote": 85,  # Score ≥75 trigger auto-archive
  "validatorCommitment": "0xabcd..."
}

# Resultado incluye archivado Filecoin
{
  "success": true,
  "vote": 85,
  "filecoinArchived": true  # ✅ Automático
}
```

### **📋 Almacenamiento de Evidencia**

```bash
# Evidencia de validación → Filecoin permanente
POST /api/filecoin/evidence/store
{
  "newsHash": "0x1234...",
  "evidenceFiles": ["evidence1.pdf", "evidence2.json"],
  "validationScore": 88,
  "validators": ["0xval1...", "0xval2..."]
}
```

### **📸 Snapshots Públicos**

```bash
# Crear snapshot público inmutable
POST /api/filecoin/snapshot/create
{
  "blockNumber": 1000000,
  "merkleRoot": "0xroot...",
  "statistics": {
    "totalNews": 500,
    "validatedNews": 425,
    "averageScore": 82
  }
}
```

### **🔍 Recuperación Garantizada**

```bash
# Recuperar contenido archivado
GET /api/filecoin/retrieve/0x1234...

{
  "success": true,
  "contentHash": "0x1234...",
  "cid": "bafybeiexample...",
  "content": { ... },
  "source": "Filecoin/IPFS"
}
```

---

## ⚙️ **Políticas de Archivado**

### **📝 Noticias (NEWS_CONTENT)**

```javascript
{
  minReputationScore: 70,    // Reputación mínima del publicador
  minValidationScore: 80,    // Score mínimo para archivar
  storageDuration: "2 years", // Duración del almacenamiento
  autoArchive: true,         // Archivado automático
  communityFunded: true      // Financiado por la comunidad
}
```

### **📋 Evidencia (VALIDATION_EVIDENCE)**

```javascript
{
  minReputationScore: 60,
  minValidationScore: 75,
  storageDuration: "3 years",
  autoArchive: true,
  communityFunded: true
}
```

### **📸 Snapshots (PUBLIC_SNAPSHOT)**

```javascript
{
  minReputationScore: 0,     // Sin restricción
  minValidationScore: 0,     // Sin restricción
  storageDuration: "5 years", // Almacenamiento largo
  autoArchive: false,        // Manual por admin
  daoApproved: true          // Requiere aprobación DAO
}
```

---

## 🎮 **Flujo de Trabajo Automatizado**

### **1. Publicación Anónima**

```
User publishes news → ZK proof → Citrea blockchain
                                      ↓
Content encrypted → IPFS → Ready for validation
```

### **2. Validación + Auto-Archive**

```
Validators vote → Score calculated → If ≥75 → Auto-archive
                                              ↓
Evidence collected → IPFS → Filecoin Deal → Permanent storage
```

### **3. Snapshot Periódico**

```
Weekly/Monthly → Platform stats → Merkle root → Public snapshot
                                                       ↓
Community governance → DAO funding → Filecoin archive → 5 years
```

---

## 💰 **Economía del Almacenamiento**

### **Costos de Storage**

- **Base**: ~$0.000001 per GB per year
- **News Content**: +0% (base rate)
- **Evidence**: +25% (premium for critical data)
- **Public Snapshots**: +50% (long-term preservation)

### **Financiamiento**

- **Community Pool**: Fondos comunitarios para auto-archive
- **DAO Treasury**: Fondos governance para snapshots públicos
- **Individual**: Usuarios pueden financiar storage específico

### **Rewards**

- Validadores obtienen reputation score por evidencia archivada
- Community pool se repone con donaciones y fees
- Storage deals exitosos aumentan reputation del ecosistema

---

## 🔒 **Garantías de Permanencia**

### **Immutability Stack**

1. **Citrea Layer**: ZK proofs + Bitcoin anchoring
2. **IPFS Layer**: Content-addressed storage
3. **Filecoin Layer**: Cryptographic proof of storage
4. **Bitcoin L1**: Final settlement layer

### **Redundancy**

- **Multiple Miners**: Large files stored with 3+ miners
- **Gateway Failover**: 4+ IPFS gateways for retrieval
- **Deal Monitoring**: Smart contracts track deal health
- **Automatic Renewal**: Policies for deal extension

### **Retrievability**

- **< 1 minute**: IPFS hot storage
- **< 5 minutes**: Filecoin retrieval
- **99.9% uptime**: Guaranteed by network incentives
- **Global CDN**: Multiple gateway locations

---

## 📊 **Métricas y Monitoring**

```bash
GET /api/filecoin/statistics
{
  "totalDealsCreated": 847,
  "totalDataStored": "45.2 TB",
  "storageReliability": "99.9%",
  "retrievalSuccessRate": "98.7%",
  "storageByType": {
    "news_content": 312,
    "validation_evidence": 458,
    "public_snapshots": 12,
    "audit_trails": 65
  }
}
```

---

## 🚀 **Deployment y Configuración**

### **1. Deploy Smart Contract FVM**

```bash
npm run deploy:filecoin:mainnet
# O testnet para testing
npm run deploy:filecoin:testnet
```

### **2. Configurar Environment Variables**

```env
# Filecoin FVM
FILECOIN_RPC_URL=https://api.node.glif.io/rpc/v1
FILECOIN_PRIVATE_KEY=your_filecoin_private_key
TRUTHBOARD_FILECOIN_CONTRACT_ADDRESS=deployed_contract

# IPFS Storage APIs
WEB3_STORAGE_TOKEN=your_web3_storage_token
ESTUARY_API_TOKEN=your_estuary_token
```

### **3. Fund Community Pool**

```javascript
// Enviar FIL al contrato para auto-financing
await contract.fundCommunityPool({ value: ethers.parseEther("100") });
```

### **4. Configure Archive Policies**

```javascript
// Ajustar políticas según necesidades de la comunidad
await contract.updateArchivePolicy(
  StorageType.NEWS_CONTENT,
  70, // min reputation
  80, // min validation score
  2 * 365 * 24 * 60 * 60, // 2 years
  true, // auto archive
  true // community funded
);
```

---

## 🎯 **Valor Agregado**

### **Para Periodistas**

- **Permanencia Garantizada**: Sus investigaciones nunca se pierden
- **Proof of Publication**: Timestamp inmutable en Bitcoin
- **Censorship Resistance**: Múltiples layers de descentralización
- **Economic Incentives**: Rewards por contenido validado

### **Para Validadores**

- **Evidence Preservation**: Su trabajo de validación persiste
- **Reputation Building**: Score on-chain basado en accuracy
- **Automatic Compensation**: Rewards por evidencia archivada
- **Audit Trail**: Transparencia completa de sus validaciones

### **Para la Sociedad**

- **Historical Record**: Archivo público de información validada
- **Transparency**: Snapshots públicos del estado de la verdad
- **Accountability**: Audit trail immutable de desinformación
- **Global Access**: Información accesible desde cualquier lugar

---

## 🔮 **Roadmap Filecoin**

### **Phase 1: Foundation** ✅

- [x] Smart contract FVM deployment
- [x] IPFS integration
- [x] Auto-archive policies
- [x] API endpoints

### **Phase 2: Advanced Features** 🔄

- [ ] Real-time deal monitoring
- [ ] Advanced encryption for sensitive content
- [ ] Integration with Filecoin Station
- [ ] Retrieval marketplace integration

### **Phase 3: Governance** 📋

- [ ] DAO voting on archive policies
- [ ] Community-driven storage priorities
- [ ] Decentralized funding mechanisms
- [ ] Cross-chain bridge for payments

### **Phase 4: Scale** 📋

- [ ] Petabyte-scale archive infrastructure
- [ ] AI-powered content categorization
- [ ] Global regulatory compliance tools
- [ ] Enterprise integration APIs

---

¡**TruthBoard + Filecoin** está completamente implementado y listo para combatir la desinformación con **almacenamiento permanente, trazabilidad total y resistencia a la censura**! 🎉
