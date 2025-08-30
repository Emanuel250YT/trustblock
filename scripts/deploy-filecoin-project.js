require('dotenv').config();
const LighthouseService = require('../src/services/lighthouseService');
const fs = require('fs');
const path = require('path');

/**
 * Script para hacer deploy de archivos del proyecto TrueBlock en Filecoin
 * Sube archivos importantes del proyecto para almacenamiento permanente
 */

class TrueBlockFilecoinDeploy {
  constructor() {
    this.lighthouse = new LighthouseService();
    this.deployedFiles = [];
  }

  async deployProject() {
    console.log('🚀 Iniciando deploy de TrueBlock en Filecoin...\n');

    const deployTasks = [
      () => this.deployREADME(),
      () => this.deployPackageJson(),
      () => this.deployEnvironmentExample(),
      () => this.deployContractABIs(),
      () => this.createProjectManifest()
    ];

    for (const task of deployTasks) {
      try {
        await task();
        await this.sleep(1000);
      } catch (error) {
        console.error(`❌ Error en deploy: ${error.message}`);
      }
    }

    await this.generateDeployReport();
  }

  async deployREADME() {
    console.log('📖 1. Desplegando README...');

    const readmePath = path.join(process.cwd(), 'README.md');

    if (fs.existsSync(readmePath)) {
      const readmeContent = fs.readFileSync(readmePath, 'utf8');

      const result = await this.lighthouse.uploadText(readmeContent, 'TrueBlock_README.md');

      this.deployedFiles.push({
        type: 'documentation',
        name: 'README.md',
        hash: result.hash,
        size: result.size,
        url: result.lighthouse_url
      });

      console.log(`   ✅ README desplegado: ${result.hash}`);
    } else {
      console.log('   ⚠️ README.md no encontrado');
    }
  }

  async deployPackageJson() {
    console.log('📦 2. Desplegando package.json...');

    const packagePath = path.join(process.cwd(), 'package.json');

    if (fs.existsSync(packagePath)) {
      const packageContent = fs.readFileSync(packagePath, 'utf8');

      const result = await this.lighthouse.uploadText(packageContent, 'TrueBlock_package.json');

      this.deployedFiles.push({
        type: 'configuration',
        name: 'package.json',
        hash: result.hash,
        size: result.size,
        url: result.lighthouse_url
      });

      console.log(`   ✅ package.json desplegado: ${result.hash}`);
    } else {
      console.log('   ⚠️ package.json no encontrado');
    }
  }

  async deployEnvironmentExample() {
    console.log('⚙️ 3. Desplegando ejemplo de configuración...');

    const envExample = `# TrueBlock Environment Configuration
# Configuración desplegada en Filecoin: ${new Date().toISOString()}

# Database
DATABASE_URL=mongodb://localhost:27017/trustblock

# Blockchain - TrueBlock (original)
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=deployed_contract_address
RPC_URL=https://ethereum-sepolia-rpc.publicnode.com

# Citrea Bitcoin Rollup - TruthBoard
CITREA_RPC_URL=https://rpc.testnet.citrea.xyz
CITREA_MAINNET_RPC_URL=https://rpc.citrea.xyz
TRUTHBOARD_CONTRACT_ADDRESS=deployed_truthboard_address
CITREA_PRIVATE_KEY=your_citrea_private_key

# TruthBoard Confidential - Zama FHE
TRUTHBOARD_CONFIDENTIAL_CONTRACT_ADDRESS=deployed_confidential_address
ZAMA_RELAYER_URL=https://relayer.zama.ai
ZAMA_FHEVM_ADDRESS=0x000000000000000000000000000000000000005d

# Lighthouse.storage Configuration
LIGHTHOUSE_API_KEY=your_lighthouse_api_key
LIGHTHOUSE_BASE_URL=https://node.lighthouse.storage
LIGHTHOUSE_GATEWAY_URL=https://gateway.lighthouse.storage/ipfs
LIGHTHOUSE_MAX_FILE_SIZE=104857600
LIGHTHOUSE_DEFAULT_DURATION=2592000

# AI and Security
AI_ORACLE_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_here

# ZK Configuration
ZK_CIRCUIT_PATH=./circuits
ZK_PROVING_KEY_PATH=./proving_keys
ZK_VERIFICATION_KEY_PATH=./verification_keys
`;

    const result = await this.lighthouse.uploadText(envExample, 'TrueBlock_env_example.txt');

    this.deployedFiles.push({
      type: 'configuration',
      name: 'environment_example',
      hash: result.hash,
      size: result.size,
      url: result.lighthouse_url
    });

    console.log(`   ✅ Configuración ejemplo desplegada: ${result.hash}`);
  }

  async deployContractABIs() {
    console.log('📜 4. Desplegando ABIs de contratos...');

    const artifactsDir = path.join(process.cwd(), 'artifacts', 'contracts');

    if (fs.existsSync(artifactsDir)) {
      const contractFiles = fs.readdirSync(artifactsDir);

      for (const contractDir of contractFiles) {
        const contractPath = path.join(artifactsDir, contractDir);

        if (fs.statSync(contractPath).isDirectory()) {
          const jsonFiles = fs.readdirSync(contractPath).filter(f => f.endsWith('.json') && !f.includes('.dbg'));

          for (const jsonFile of jsonFiles) {
            try {
              const jsonPath = path.join(contractPath, jsonFile);
              const contractData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

              const abiData = {
                contractName: contractData.contractName || jsonFile.replace('.json', ''),
                abi: contractData.abi,
                bytecode: contractData.bytecode,
                deployedOn: new Date().toISOString(),
                networks: {
                  sepolia: process.env.CONTRACT_ADDRESS,
                  citrea_testnet: process.env.TRUTHBOARD_CONTRACT_ADDRESS,
                  zama_sepolia: process.env.TRUTHBOARD_CONFIDENTIAL_CONTRACT_ADDRESS
                }
              };

              const result = await this.lighthouse.uploadText(
                JSON.stringify(abiData, null, 2),
                `TrueBlock_${contractData.contractName}_ABI.json`
              );

              this.deployedFiles.push({
                type: 'contract_abi',
                name: contractData.contractName,
                hash: result.hash,
                size: result.size,
                url: result.lighthouse_url
              });

              console.log(`   ✅ ABI ${contractData.contractName}: ${result.hash}`);

            } catch (error) {
              console.log(`   ⚠️ Error procesando ${jsonFile}: ${error.message}`);
            }
          }
        }
      }
    } else {
      console.log('   ⚠️ Directorio artifacts no encontrado');
    }
  }

  async createProjectManifest() {
    console.log('📋 5. Creando manifiesto del proyecto...');

    const manifest = {
      project: "TrueBlock",
      description: "Plataforma descentralizada de validación de noticias",
      version: "1.0.0",
      deployed_at: new Date().toISOString(),
      networks: {
        ethereum_sepolia: {
          chain_id: 11155111,
          contract_address: process.env.CONTRACT_ADDRESS,
          rpc_url: "https://ethereum-sepolia-rpc.publicnode.com"
        },
        citrea_testnet: {
          chain_id: 5115,
          contract_address: process.env.TRUTHBOARD_CONTRACT_ADDRESS,
          rpc_url: "https://rpc.testnet.citrea.xyz"
        },
        zama_sepolia: {
          chain_id: 11155111,
          contract_address: process.env.TRUTHBOARD_CONFIDENTIAL_CONTRACT_ADDRESS,
          rpc_url: "https://ethereum-sepolia-rpc.publicnode.com"
        }
      },
      storage: {
        provider: "Lighthouse Storage",
        network: "Filecoin",
        api_endpoint: "https://node.lighthouse.storage"
      },
      deployed_files: this.deployedFiles,
      repository: "https://github.com/Emanuel250YT/trustblock",
      documentation: "Consulta el README y los archivos desplegados en Filecoin para más información"
    };

    const result = await this.lighthouse.uploadText(
      JSON.stringify(manifest, null, 2),
      'TrueBlock_Project_Manifest.json'
    );

    this.deployedFiles.push({
      type: 'manifest',
      name: 'project_manifest',
      hash: result.hash,
      size: result.size,
      url: result.lighthouse_url
    });

    console.log(`   ✅ Manifiesto creado: ${result.hash}`);

    return result;
  }

  async generateDeployReport() {
    console.log('\n📊 REPORTE DE DEPLOY EN FILECOIN');
    console.log('='.repeat(60));

    const totalSize = this.deployedFiles.reduce((sum, file) => sum + (file.size || 0), 0);
    const totalFiles = this.deployedFiles.length;

    console.log(`📁 Archivos desplegados: ${totalFiles}`);
    console.log(`📊 Tamaño total: ${this.lighthouse.formatBytes(totalSize)}`);
    console.log();

    const groupedFiles = this.deployedFiles.reduce((groups, file) => {
      const type = file.type || 'other';
      if (!groups[type]) groups[type] = [];
      groups[type].push(file);
      return groups;
    }, {});

    for (const [type, files] of Object.entries(groupedFiles)) {
      console.log(`📂 ${type.toUpperCase()}:`);
      files.forEach(file => {
        console.log(`   • ${file.name}`);
        console.log(`     Hash: ${file.hash}`);
        console.log(`     URL: ${file.url}`);
        console.log();
      });
    }

    console.log('🎯 DEPLOY COMPLETADO EXITOSAMENTE!');
    console.log('   Todos los archivos están almacenados permanentemente en Filecoin');
    console.log('   y son accesibles vía IPFS en cualquier momento.');
    console.log();
    console.log('🔗 Para acceder a los archivos:');
    console.log('   • Usa las URLs de Lighthouse para visualización directa');
    console.log('   • Usa las URLs de IPFS Gateway para acceso descentralizado');
    console.log('   • Los hashes IPFS garantizan la inmutabilidad del contenido');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Ejecutar deploy
async function main() {
  const deploy = new TrueBlockFilecoinDeploy();
  await deploy.deployProject();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = TrueBlockFilecoinDeploy;
