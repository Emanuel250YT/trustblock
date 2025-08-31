# Variables de Entorno - Limpieza Final

## ✅ Variables Conservadas (Realmente utilizadas en el código)

### Configuración del Servidor
- `NODE_ENV` - Para modo desarrollo/producción
- `PORT` - Puerto del servidor
- `TRUST_PROXY` - Configuración de proxy 
- `PROXY_COUNT` - Número de proxies
- `DEBUG_PROXY` - Debug de proxy

### Blockchain Principal
- `PRIVATE_KEY` - Clave privada principal
- `CONTRACT_ADDRESS` - Dirección del contrato principal
- `BLOCKCHAIN_RPC_URL` - URL RPC personalizada
- `BASE_RPC_URL` - URL RPC de Base network
- `BLOCKCHAIN_NETWORK` - Red blockchain

### Citrea (TruthBoard)
- `CITREA_RPC_URL` - URL RPC de Citrea
- `CITREA_MAINNET_RPC_URL` - URL RPC de Citrea mainnet (usado en hardhat)
- `CITREA_PRIVATE_KEY` - Clave privada para Citrea (usado en hardhat)
- `TRUTHBOARD_CONTRACT_ADDRESS` - Dirección del contrato TruthBoard

### Filecoin
- `FILECOIN_RPC_URL` - URL RPC de Filecoin
- `FILECOIN_PRIVATE_KEY` - Clave privada para Filecoin
- `TRUTHBOARD_FILECOIN_CONTRACT_ADDRESS` - Contrato en Filecoin

### ZAMA FHE
- `ZAMA_RELAYER_URL` - URL del relayer de ZAMA
- `CHAIN_ID` - ID de la cadena

### Lighthouse (único servicio IPFS usado)
- `LIGHTHOUSE_API_KEY` - API key de Lighthouse

### AI Services (usados en validación y oráculos)
- `OPENAI_API_KEY` - API key de OpenAI
- `HUGGINGFACE_API_KEY` - API key de Hugging Face

## ❌ Variables Eliminadas (Confirmado que NO se usan)

- `DATABASE_URL` - No se usa MongoDB 
- `RPC_URL` - Reemplazada por `BLOCKCHAIN_RPC_URL`
- `TRUTHBOARD_CONFIDENTIAL_CONTRACT_ADDRESS` - No se usa
- `ZAMA_FHEVM_ADDRESS` - No se usa
- `LIGHTHOUSE_BASE_URL` - No se usa en código principal
- `LIGHTHOUSE_GATEWAY_URL` - No se usa en código principal
- `LIGHTHOUSE_MAX_FILE_SIZE` - No se usa
- `LIGHTHOUSE_DEFAULT_DURATION` - No se usa
- `AI_ORACLE_API_KEY` - No se usa
- `JWT_SECRET` - No se usa
- `ZK_CIRCUIT_PATH` - No se usa
- `ZK_PROVING_KEY_PATH` - No se usa
- `ZK_VERIFICATION_KEY_PATH` - No se usa
- `PINATA_API_KEY` - No se usa Pinata
- `PINATA_SECRET_KEY` - No se usa Pinata
- `APILON_*` - No se usa Apilon

## 📊 Resultados Finales

**Antes:** 40+ variables de entorno
**Después:** 18 variables esenciales

✅ Servidor funcionando correctamente en puerto 3000
✅ Modo simulación por defecto para desarrollo
✅ Configuración limpia y minimalista
✅ Solo variables realmente utilizadas en el código
