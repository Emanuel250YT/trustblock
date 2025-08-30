# Variables de Entorno - Resumen de Limpieza

## Variables Eliminadas (No utilizadas en el código)
Las siguientes variables fueron eliminadas del `.env.example` porque no se usan en el código actual:

- `DATABASE_URL` - No se usa MongoDB en la implementación actual
- `RPC_URL` - Reemplazada por `BLOCKCHAIN_RPC_URL` 
- `TRUEBLOCK_VALIDATOR_ADDRESS` - No se usa en el código
- `TRUTHBOARD_CONFIDENTIAL_CONTRACT_ADDRESS` - No se usa
- `ZAMA_FHEVM_ADDRESS` - No se usa
- `LIGHTHOUSE_BASE_URL` - No se usa
- `LIGHTHOUSE_GATEWAY_URL` - No se usa
- `LIGHTHOUSE_MAX_FILE_SIZE` - No se usa
- `LIGHTHOUSE_DEFAULT_DURATION` - No se usa
- `IPFS_API_URL` - No se usa
- `IPFS_API_KEY` - No se usa
- `IPFS_GATEWAY_URL` - No se usa
- `LOTUS_API_URL` - No se usa
- `ESTUARY_API_TOKEN` - No se usa
- `SYMBIOTIC_*` - Todo el conjunto de variables Symbiotic no se usa
- `AI_ORACLE_API_KEY` - No se usa
- `JWT_SECRET` - No se usa
- `ZK_CIRCUIT_PATH` - No se usa
- `ZK_PROVING_KEY_PATH` - No se usa
- `ZK_VERIFICATION_KEY_PATH` - No se usa

## Variables Conservadas (Utilizadas en el código)
Estas variables se mantienen porque son realmente utilizadas:

### Configuración del Servidor
- `NODE_ENV` - Para modo desarrollo/producción
- `PORT` - Puerto del servidor
- `TRUST_PROXY` - Configuración de proxy
- `PROXY_COUNT` - Número de proxies
- `DEBUG_PROXY` - Debug de proxy

### Blockchain
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

### Servicios IPFS
- `PINATA_API_KEY` - API key de Pinata
- `PINATA_SECRET_KEY` - Secret key de Pinata
- `LIGHTHOUSE_API_KEY` - API key de Lighthouse

### Servicios AI
- `OPENAI_API_KEY` - API key de OpenAI
- `HUGGINGFACE_API_KEY` - API key de Hugging Face

### Apilon
- `APILON_API_URL` - URL de la API de Apilon
- `APILON_API_KEY` - API key de Apilon
- `APILON_STORAGE_PROVIDER` - Proveedor de almacenamiento
- `APILON_DEAL_DURATION` - Duración del deal
- `APILON_REPLICATION_FACTOR` - Factor de replicación
- `APILON_VERIFIED_DEAL` - Deal verificado

## Estado Actual
✅ `.env.example` actualizado con solo las variables necesarias
✅ `.env` limpiado y configurado para desarrollo
✅ Servidor funcionando correctamente en puerto 3001
✅ Modo simulación activado por defecto para desarrollo sin APIs externas
