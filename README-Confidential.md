# TruthBoard Confidential 🔒

Sistema de validación confidencial de noticias usando **Fully Homomorphic Encryption (FHE)** de Zama Protocol.

## 🌟 Características Principales

### 🔐 Privacidad Completa

- **Identidad Protegida**: Los validadores permanecen completamente anónimos
- **Votos Cifrados**: Las validaciones se procesan sin revelar contenido
- **Reputación Confidencial**: Las puntuaciones se actualizan sin descifrar
- **Operaciones Homomórficas**: Cálculos directos sobre datos cifrados

### ⚡ Tecnología Avanzada

- **Zama FHE Protocol**: Cifrado homomórfico de última generación
- **TFHE Algorithm**: Torus Fully Homomorphic Encryption
- **Smart Contracts**: Solidity con interfaces FHE
- **Relayer SDK**: Integración seamless con Zama infrastructure

### 🛡️ Seguridad Criptográfica

- **Pruebas Criptográficas**: Verificación sin revelación de datos
- **Integridad Garantizada**: Validación de datos cifrados
- **Resistencia a Manipulación**: Imposible alterar votos sin detección
- **Consenso Confidencial**: Agregación segura de validaciones

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    TruthBoard Confidential                 │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React/Next.js)                                  │
│  ├── ZamaContext (FHE Client)                             │
│  ├── ConfidentialValidationForm                           │
│  └── Encrypted UI Components                              │
├─────────────────────────────────────────────────────────────┤
│  Backend API (Express.js)                                  │
│  ├── /api/confidential/* routes                           │
│  ├── ZamaFHEService                                       │
│  └── Relayer SDK Integration                              │
├─────────────────────────────────────────────────────────────┤
│  Smart Contracts (Solidity)                               │
│  ├── TruthBoardConfidential.sol                          │
│  ├── IFHEVM.sol (FHE Interface)                          │
│  └── Zama Protocol Integration                            │
├─────────────────────────────────────────────────────────────┤
│  Zama Infrastructure                                       │
│  ├── FHEVM (Fully Homomorphic EVM)                       │
│  ├── Relayer Network                                      │
│  └── Key Management System                                │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Instalación y Configuración

### Prerrequisitos

```bash
Node.js >= 18.0.0
npm >= 9.0.0
Hardhat CLI
Git
```

### 1. Clonar y Configurar Backend

```bash
cd trustblock
npm install
```

### 2. Configurar Variables de Entorno

```env
# TruthBoard Confidential - Zama FHE
TRUTHBOARD_CONFIDENTIAL_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
ZAMA_RELAYER_URL=http://localhost:8080
ZAMA_FHEVM_ADDRESS=0x0000000000000000000000000000000000000001
```

### 3. Desplegar Contratos

```bash
# Iniciar red local
npx hardhat node

# En otra terminal - Desplegar contrato confidencial
npx hardhat run scripts/deploy-confidential.js --network localhost
```

### 4. Iniciar Backend API

```bash
npm run dev
# Backend disponible en http://localhost:3000
```

### 5. Configurar Frontend (Opcional)

```bash
cd frontend
npm install
npm run dev
# Frontend disponible en http://localhost:3001
```

## 📡 API Endpoints

### Sistema FHE

```
POST /api/confidential/initialize
GET  /api/confidential/service-info
```

### Validadores

```
POST /api/confidential/register-validator
GET  /api/confidential/validator-stats/:address
POST /api/confidential/update-reputation
```

### Validaciones

```
POST /api/confidential/submit-validation
POST /api/confidential/aggregate-validations
POST /api/confidential/verify-proof
```

## 🔧 Uso del Sistema

### 1. Inicializar Servicio FHE

```javascript
const response = await fetch("/api/confidential/initialize", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  }),
});
```

### 2. Registrar Validador

```javascript
const response = await fetch("/api/confidential/register-validator", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    validatorAddress: "0x...",
    initialReputation: 50,
  }),
});
```

### 3. Enviar Validación Confidencial

```javascript
const response = await fetch("/api/confidential/submit-validation", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    newsId: "news_001",
    validatorAddress: "0x...",
    isValid: true,
    confidenceLevel: 85,
  }),
});
```

### 4. Agregar Validaciones

```javascript
const response = await fetch('/api/confidential/aggregate-validations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    newsId: 'news_001',
    encryptedVotes: [...] // Array de votos cifrados
  })
});
```

## 🔐 Flujo de Validación Confidencial

### Paso 1: Cifrado del Voto

```
Validador → [Voto: isValid=true, confidence=85%] → FHE Encryption → [Datos Cifrados]
```

### Paso 2: Envío Seguro

```
[Datos Cifrados] → Smart Contract → [Almacenamiento On-chain] → Event Emitted
```

### Paso 3: Agregación Homomórfica

```
[Voto_1_Cifrado] + [Voto_2_Cifrado] + ... → [Resultado_Cifrado] → [Consenso]
```

### Paso 4: Actualización de Reputación

```
[Reputación_Actual_Cifrada] + [Delta_Cifrado] → [Nueva_Reputación_Cifrada]
```

## 🛠️ Archivos Principales

### Smart Contracts

- `contracts/TruthBoardConfidential.sol` - Contrato principal FHE
- `contracts/interfaces/IFHEVM.sol` - Interfaz Zama FHE
- `scripts/deploy-confidential.js` - Script de despliegue

### Backend Services

- `src/services/zamaFHEService.js` - Servicio FHE principal
- `src/routes/confidential.js` - Rutas API confidenciales
- `src/index.js` - Servidor Express actualizado

### Frontend (Template)

- `frontend/src/contexts/ZamaContext.tsx` - Contexto React FHE
- `frontend/src/components/ConfidentialValidationForm.tsx` - Formulario de validación
- `frontend/src/app/page.tsx` - Página principal

## 📊 Monitoreo y Estadísticas

### Métricas del Sistema

- **Validaciones Totales**: Procesadas confidencialmente
- **Validadores Activos**: Con reputación cifrada
- **Confianza Promedio**: Calculada homomórficamente
- **Operaciones FHE**: Realizadas sin descifrado

### Logs de Seguridad

```bash
✅ Zama FHE Service inicializado
🔒 Validación confidencial enviada
🔄 Reputación actualizada confidencialmente
🧮 Agregación homomórfica completada
```

## 🔒 Consideraciones de Seguridad

### Protecciones Implementadas

- **Cifrado End-to-End**: Datos nunca expuestos en plaintext
- **Operaciones Homomórficas**: Cálculos sin descifrado
- **Pruebas Criptográficas**: Verificación sin revelación
- **Anonimato Garantizado**: Identidades completamente protegidas

### Limitaciones Actuales

- **Mock FHEVM**: En desarrollo, usando simulación
- **Relayer Local**: Para testing, no producción
- **Claves de Prueba**: Usar claves reales en mainnet

## 🚀 Roadmap Futuro

### Fase 1: Integración Completa

- [ ] Integración con Zama Devnet
- [ ] Cliente FHE real (no simulado)
- [ ] Optimización de gas costs

### Fase 2: Características Avanzadas

- [ ] Validación multi-nivel
- [ ] Reputación adaptativa
- [ ] Consensos complejos

### Fase 3: Escalabilidad

- [ ] Layer 2 integration
- [ ] Batch processing
- [ ] Cross-chain operations

## 📚 Recursos Adicionales

- [Zama Documentation](https://docs.zama.ai/)
- [TFHE Specification](https://www.zama.ai/tfhe)
- [FHE Tutorial](https://docs.zama.ai/tfhe-rs)
- [Relayer SDK Guide](https://github.com/zama-ai/relayer-sdk)

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

**TruthBoard Confidential** - Protegiendo la verdad con privacidad total 🔒✨
