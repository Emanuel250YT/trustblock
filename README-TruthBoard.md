# TrueBlock & TruthBoard

**Plataformas descentralizadas para combatir la desinformación y promover el periodismo anónimo**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)

## 🎯 **Descripción del Proyecto**

### **TrueBlock**

Sistema multicapa de validación de noticias contra desinformación que combina:

- **Oráculos de IA** especializados en detección de fake news
- **Validación comunitaria** descentralizada
- **Sistema de staking/slashing** para incentivos económicos
- **Consenso on-chain** inmutable

### **TruthBoard**

Plataforma de periodismo anónimo con privacidad total que ofrece:

- **Publicación anónima** con Zero-Knowledge proofs
- **Validación preservando privacidad**
- **Donaciones anónimas** a periodistas
- **Anclaje en Bitcoin** via Citrea rollup para inmutabilidad
- **Resistencia a censura**

## 🏗️ **Arquitectura del Sistema**

```
┌─────────────────────┬─────────────────────┐
│     TrueBlock       │     TruthBoard      │
│ (Public Validation) │ (Anonymous Privacy) │
├─────────────────────┼─────────────────────┤
│ • AI Oracles        │ • ZK Proofs         │
│ • Community Vote    │ • Anonymous Publish │
│ • Staking/Slashing  │ • Private Donation  │
│ • Ethereum/Polygon  │ • Citrea Rollup     │
└─────────────────────┴─────────────────────┘
```

## 🚀 **Características Principales**

### **TrueBlock Features**

- ✅ **Validación Multicapa**: IA + Comunidad + Consensus
- ✅ **Oráculos Especializados**: Registro y gestión de oráculos de IA
- ✅ **Sistema de Incentivos**: Staking/slashing con recompensas/penalizaciones
- ✅ **Almacenamiento Descentralizado**: IPFS para contenido
- ✅ **API REST Completa**: Endpoints para todas las funcionalidades

### **TruthBoard Features**

- 🔒 **Zero-Knowledge Proofs**: Identidad anónima verificable
- 🔒 **Publicación Anónima**: Sin revelar identidad del periodista
- 🔒 **Donaciones Privadas**: Soporte económico anónimo
- 🔒 **Bitcoin Settlement**: Anclaje inmutable via Citrea
- 🔒 **Resistencia a Censura**: Descentralización total

## 🛠️ **Stack Tecnológico**

### **Backend**

- **Node.js** + **Express.js** - Servidor API REST
- **Ethers.js** - Interacción con blockchain
- **Hardhat** - Framework de desarrollo Solidity

### **Blockchain**

- **Solidity 0.8.20** - Smart contracts
- **OpenZeppelin** - Librerías de seguridad
- **Ethereum/Polygon** - TrueBlock deployment
- **Citrea Bitcoin Rollup** - TruthBoard deployment

### **Privacy & ZK**

- **Zero-Knowledge Proofs** - Anonimato verificable
- **Commitment Schemes** - Identidades anónimas
- **Encrypted Storage** - Contenido privado

## 📁 **Estructura del Proyecto**

```
trustblock/
├── contracts/                 # Smart contracts
│   ├── TrueBlockValidator.sol # Validación multicapa
│   └── TruthBoard.sol        # Periodismo anónimo ZK
├── src/
│   ├── routes/               # API endpoints
│   │   ├── validation.js     # Validación de noticias
│   │   ├── oracle.js         # Gestión de oráculos
│   │   ├── staking.js        # Staking/slashing
│   │   ├── news.js           # Gestión de noticias
│   │   └── truthboard.js     # TruthBoard ZK API
│   ├── services/             # Lógica de negocio
│   │   ├── blockchainService.js
│   │   ├── validationService.js
│   │   ├── oracleService.js
│   │   ├── stakingService.js
│   │   ├── newsService.js
│   │   └── zkTruthBoardService.js
│   └── index.js              # Servidor principal
├── scripts/
│   ├── deploy.js             # Deploy TrueBlock
│   └── deploy-truthboard.js  # Deploy TruthBoard
└── README.md
```

## ⚡ **Instalación y Configuración**

### **1. Clonar el Repositorio**

```bash
git clone https://github.com/your-username/trustblock.git
cd trustblock
```

### **2. Instalar Dependencias**

```bash
npm install
```

### **3. Configurar Variables de Entorno**

```bash
cp .env.example .env
```

Editar `.env`:

```env
# TrueBlock (Ethereum/Polygon)
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=your_contract_address_here
RPC_URL=http://localhost:8545

# TruthBoard (Citrea)
CITREA_RPC_URL=https://rpc.devnet.citrea.xyz
TRUTHBOARD_CONTRACT_ADDRESS=your_truthboard_contract_address_here
CITREA_PRIVATE_KEY=your_citrea_private_key_here

# API Keys
AI_ORACLE_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_here
```

### **4. Compilar Smart Contracts**

```bash
npm run compile-contracts
```

### **5. Ejecutar el Servidor**

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 🚢 **Deployment**

### **TrueBlock (Ethereum/Polygon)**

```bash
# Local
npm run deploy

# Base Network
npx hardhat run scripts/deploy.js --network base

# Polygon
npx hardhat run scripts/deploy.js --network polygon
```

### **TruthBoard (Citrea Bitcoin Rollup)**

```bash
# Citrea Devnet
npm run deploy:truthboard:citrea-devnet

# Citrea Testnet
npm run deploy:truthboard:citrea-testnet

# Citrea Mainnet
npm run deploy:truthboard:citrea-mainnet
```

## 📚 **API Documentation**

### **TrueBlock Endpoints**

#### **Validación de Noticias**

```bash
# Validar noticia
POST /api/validation/validate
{
  "contentHash": "0x...",
  "url": "https://example.com/news",
  "validatorId": "validator123"
}

# Obtener resultado de validación
GET /api/validation/result/{hash}
```

#### **Gestión de Oráculos**

```bash
# Registrar oráculo
POST /api/oracle/register
{
  "name": "AI Oracle 1",
  "apiEndpoint": "https://api.oracle.com",
  "specialization": "political_news"
}

# Consultar oráculo
POST /api/oracle/consult
{
  "oracleId": "oracle123",
  "content": "Noticia a validar..."
}
```

#### **Staking**

```bash
# Hacer stake
POST /api/staking/stake
{
  "validatorId": "validator123",
  "amount": "1.5"
}

# Retirar stake
POST /api/staking/withdraw
{
  "validatorId": "validator123",
  "amount": "0.5"
}
```

### **TruthBoard Endpoints**

#### **Publicación Anónima**

```bash
# Publicar noticia anónima
POST /api/truthboard/publish
{
  "content": "Contenido de la noticia...",
  "title": "Título de la noticia",
  "region": "Latin America",
  "publisherIdentity": "anonymous_hash_commitment"
}
```

#### **Validación Anónima**

```bash
# Validar anónimamente
POST /api/truthboard/validate
{
  "newsHash": "0x...",
  "vote": 85,
  "validatorCommitment": "0x..."
}
```

#### **Donaciones Anónimas**

```bash
# Donar anónimamente
POST /api/truthboard/donate
{
  "newsHash": "0x...",
  "amount": "0.1",
  "donorIdentity": "anonymous_commitment"
}
```

#### **Información de la Plataforma**

```bash
# Estadísticas
GET /api/truthboard/stats

# Estado de Citrea
GET /api/truthboard/citrea/status

# Health check
GET /api/truthboard/health
```

## 🧪 **Testing**

```bash
# Ejecutar tests
npm test

# Tests específicos
npx hardhat test test/TrueBlockValidator.test.js
npx hardhat test test/TruthBoard.test.js
```

## 🔒 **Seguridad**

- **Rate Limiting**: 100 requests por 15 minutos
- **Helmet.js**: Headers de seguridad
- **CORS**: Configuración de origen cruzado
- **Input Validation**: Validación de todos los inputs
- **ZK Proofs**: Privacidad matemáticamente demostrable
- **Smart Contract Audits**: Contratos seguros con OpenZeppelin

## 🌍 **Casos de Uso**

### **TrueBlock**

- **Medios de Comunicación**: Validar noticias antes de publicar
- **Fact-checkers**: Herramientas para verificación
- **Ciudadanos**: Verificar veracidad de información
- **Investigadores**: Datos sobre desinformación

### **TruthBoard**

- **Periodistas en Regímenes Autoritarios**: Publicación segura
- **Whistleblowers**: Revelaciones anónimas
- **Activistas**: Denuncia sin represalias
- **Ciudadanos**: Información libre de censura

## 🛣️ **Roadmap**

### **Fase 1: Fundación** ✅

- [x] Smart contracts básicos
- [x] API REST completa
- [x] Sistema de validación
- [x] ZK proofs básicos

### **Fase 2: Privacidad Avanzada** 🔄

- [ ] Integración con circom/snarkjs
- [ ] ZK circuits optimizados
- [ ] Wallet connect integration
- [ ] Frontend React

### **Fase 3: Escalabilidad** 📋

- [ ] Layer 2 optimizations
- [ ] IPFS clustering
- [ ] Mobile app
- [ ] Browser extension

### **Fase 4: Governanza** 📋

- [ ] DAO governance
- [ ] Token economics
- [ ] Incentive mechanisms
- [ ] Global expansion

## 🤝 **Contribución**

1. **Fork** el proyecto
2. **Crear** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abrir** un Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 **Contacto**

- **Team**: TrueBlock Team
- **Email**: contact@trueblock.app
- **Website**: https://trueblock.app
- **Twitter**: @TrueBlockApp

## 🙏 **Reconocimientos**

- **OpenZeppelin** - Smart contract security
- **Hardhat** - Development framework
- **Citrea** - Bitcoin rollup infrastructure
- **Ethereum Foundation** - Blockchain technology

---

**TrueBlock & TruthBoard** - _Combatiendo la desinformación y promoviendo la libertad de prensa_
