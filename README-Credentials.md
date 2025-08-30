# **README - Configuración de Credenciales**

Este archivo explica cómo configurar las credenciales necesarias para que el proyecto funcione correctamente. Asegúrate de completar todos los campos requeridos en el archivo `.env` antes de iniciar el servidor.

---

## **1. Base de Datos**

- **`DATABASE_URL`**: URL de conexión a la base de datos MongoDB.
  - Ejemplo: `mongodb://localhost:27017/trustblock`

---

## **2. Blockchain - TrueBlock**

- **`PRIVATE_KEY`**: Llave privada de tu cuenta en la red blockchain (Ethereum/Polygon).
  - Genera una cuenta en Metamask o cualquier wallet compatible y copia la llave privada.
  - Ejemplo: `0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef`.
- **`CONTRACT_ADDRESS`**: Dirección del contrato desplegado para TrueBlock.
  - Se obtiene después de desplegar el contrato.
- **`RPC_URL`**: URL del nodo RPC para interactuar con la red blockchain.
  - Ejemplo: `https://polygon-rpc.com`.

---

## **3. Citrea Bitcoin Rollup - TruthBoard**

- **`CITREA_RPC_URL`**: URL del nodo RPC para la red de desarrollo de Citrea.
  - Ejemplo: `https://rpc.devnet.citrea.xyz`.
- **`CITREA_MAINNET_RPC_URL`**: URL del nodo RPC para la red principal de Citrea.
  - Ejemplo: `https://rpc.citrea.xyz`.
- **`TRUTHBOARD_CONTRACT_ADDRESS`**: Dirección del contrato desplegado para TruthBoard.
  - Se obtiene después de desplegar el contrato en Citrea.
- **`CITREA_PRIVATE_KEY`**: Llave privada de tu cuenta en la red Citrea.
  - Similar al campo `PRIVATE_KEY`, pero para la red Citrea.

---

## **4. Filecoin Virtual Machine (FVM) - Capa de Almacenamiento**

- **`FILECOIN_RPC_URL`**: URL del nodo RPC para interactuar con la red Filecoin.
  - Ejemplo: `https://api.node.glif.io/rpc/v1`.
- **`FILECOIN_PRIVATE_KEY`**: Llave privada de tu cuenta en la red Filecoin.
  - Similar a los campos anteriores, pero para Filecoin.
- **`TRUTHBOARD_FILECOIN_CONTRACT_ADDRESS`**: Dirección del contrato desplegado para la integración de Filecoin.
  - Se obtiene después de desplegar el contrato en la red Filecoin.
- **`LOTUS_API_URL`**: URL del nodo Lotus para interactuar con Filecoin.
  - Ejemplo: `https://api.node.glif.io/rpc/v1`.
- **`ESTUARY_API_TOKEN`**: Token de API para usar el servicio Estuary.
  - Regístrate en [Estuary](https://estuary.tech) y genera un token.
  - Integración directa con Filecoin para almacenamiento descentralizado.

---

## **5. Claves de API**

- **`AI_ORACLE_API_KEY`**: Clave de API para el oráculo de IA (como OpenAI).
  - Regístrate en [OpenAI](https://openai.com) y genera una clave.
- **`IPFS_API_KEY`**: Clave de API para interactuar con IPFS.
  - Usa el mismo token de Estuary para IPFS.

---

## **6. Seguridad**

- **`JWT_SECRET`**: Secreto para firmar tokens JWT.
  - Genera una cadena aleatoria segura.
  - Ejemplo: `tu_jwt_secret_aqui_para_desarrollo`.

---

## **7. Configuración de ZK**

- **`ZK_CIRCUIT_PATH`**: Ruta a los circuitos ZK en tu proyecto.
  - Ejemplo: `./circuits`.
- **`ZK_PROVING_KEY_PATH`**: Ruta a las claves de prueba ZK.
  - Ejemplo: `./proving_keys`.
- **`ZK_VERIFICATION_KEY_PATH`**: Ruta a las claves de verificación ZK.
  - Ejemplo: `./verification_keys`.

---

## **Notas Finales**

- **Generar Llaves Privadas**: Usa wallets como Metamask o herramientas como `eth-key` para generar llaves privadas.
- **Tokens de API**: Regístrate en los servicios correspondientes (Estuary, OpenAI) para obtener los tokens necesarios.
- **Rutas Locales**: Asegúrate de que las rutas a circuitos y claves existan en tu proyecto.

Si necesitas ayuda para generar o configurar algún campo, ¡avísame!
