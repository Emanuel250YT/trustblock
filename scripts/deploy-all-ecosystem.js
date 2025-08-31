const { ethers } = require("hardhat");

/**
 * Script de deployment completo para todo el ecosistema TrueBlock
 * Incluye Ethereum, Citrea, Filecoin, Base, Zama FHE, y Flare
 */
async function main() {
  console.log("🚀 Iniciando deployment completo del ecosistema TrueBlock...");

  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);

  console.log(`👤 Deployer: ${deployerAddress}`);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH`);

  const deploymentResults = {
    deployer: deployerAddress,
    timestamp: new Date().toISOString(),
    contracts: {},
    networks: {}
  };

  try {
    // Detectar red actual
    const network = await ethers.provider.getNetwork();
    const chainId = Number(network.chainId);

    console.log(`📡 Red detectada: Chain ID ${chainId}`);

    // Configurar deployments según la red
    const networkConfigs = getNetworkConfigs();
    const currentNetworkConfig = detectCurrentNetwork(chainId, networkConfigs);

    if (!currentNetworkConfig) {
      throw new Error(`Red no soportada: Chain ID ${chainId}`);
    }

    console.log(`✅ Configuración cargada para: ${currentNetworkConfig.name}`);
    deploymentResults.networks[currentNetworkConfig.name] = {
      chainId: chainId,
      rpcUrl: currentNetworkConfig.rpcUrl,
      explorer: currentNetworkConfig.explorer
    };

    // Desplegar contratos según la red
    await deployContractsForNetwork(currentNetworkConfig, deploymentResults);

    // Guardar resultados
    await saveDeploymentResults(deploymentResults, currentNetworkConfig.name);

    console.log("\n🎉 ¡Deployment completo exitoso!");
    console.log("📋 Resumen:");
    Object.entries(deploymentResults.contracts).forEach(([name, address]) => {
      console.log(`   ${name}: ${address}`);
    });

    return deploymentResults;

  } catch (error) {
    console.error("❌ Error durante el deployment:", error);
    throw error;
  }
}

function getNetworkConfigs() {
  return {
    // Hardhat Local
    31337: {
      name: "hardhat",
      rpcUrl: "http://127.0.0.1:8545",
      explorer: "http://localhost:8545/",
      contracts: ["TrueBlockValidator", "TruthBoard", "TrueBlockMiniApp", "TruthBoardFilecoin", "TrueBlockFlareOracle"]
    },
    // Ethereum Sepolia (Testing)
    11155111: {
      name: "sepolia",
      rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
      explorer: "https://sepolia.etherscan.io/",
      contracts: ["TrueBlockValidator", "TruthBoard"]
    },
    // Base Mainnet
    8453: {
      name: "base",
      rpcUrl: "https://mainnet.base.org",
      explorer: "https://basescan.org/",
      contracts: ["TrueBlockMiniApp"]
    },
    // Base Sepolia
    84532: {
      name: "base-sepolia",
      rpcUrl: "https://sepolia.base.org",
      explorer: "https://sepolia.basescan.org/",
      contracts: ["TrueBlockMiniApp"]
    },
    // Citrea Devnet
    5115: {
      name: "citrea_devnet",
      rpcUrl: "https://rpc.devnet.citrea.xyz",
      explorer: "https://explorer.devnet.citrea.xyz/",
      contracts: ["TruthBoard"]
    },
    // Citrea Mainnet
    62298: {
      name: "citrea_mainnet",
      rpcUrl: "https://rpc.citrea.xyz",
      explorer: "https://explorer.citrea.xyz/",
      contracts: ["TruthBoard"]
    },
    // Filecoin Mainnet
    314: {
      name: "filecoin_mainnet",
      rpcUrl: "https://api.node.glif.io/rpc/v1",
      explorer: "https://fvm.starboard.ventures/explorer/",
      contracts: ["TruthBoardFilecoin"]
    },
    // Filecoin Testnet
    314159: {
      name: "filecoin_testnet",
      rpcUrl: "https://api.calibration.node.glif.io/rpc/v1",
      explorer: "https://fvm.starboard.ventures/explorer/calibration/",
      contracts: ["TruthBoardFilecoin"]
    },
    // Flare Mainnet
    14: {
      name: "flare",
      rpcUrl: "https://flare-api.flare.network/ext/C/rpc",
      explorer: "https://flarescan.com/",
      contracts: ["TrueBlockFlareOracle"]
    },
    // Flare Coston
    16: {
      name: "coston",
      rpcUrl: "https://costonapi.flare.network/ext/C/rpc",
      explorer: "https://coston.testnet.flarescan.com/",
      contracts: ["TrueBlockFlareOracle"]
    },
    // Flare Coston2
    114: {
      name: "coston2",
      rpcUrl: "https://coston2-api.flare.network/ext/C/rpc",
      explorer: "https://coston2.testnet.flarescan.com/",
      contracts: ["TrueBlockFlareOracle"]
    }
  };
}

function detectCurrentNetwork(chainId, configs) {
  return configs[chainId] || null;
}

async function deployContractsForNetwork(networkConfig, results) {
  console.log(`\n🔨 Desplegando contratos para ${networkConfig.name}...`);

  for (const contractName of networkConfig.contracts) {
    try {
      console.log(`📄 Desplegando ${contractName}...`);

      const contractAddress = await deployContract(contractName, networkConfig);

      if (contractAddress) {
        results.contracts[contractName] = contractAddress;
        console.log(`✅ ${contractName} desplegado en: ${contractAddress}`);
      }

    } catch (error) {
      console.error(`❌ Error desplegando ${contractName}:`, error.message);
      // Continuar con otros contratos
    }
  }
}

async function deployContract(contractName, networkConfig) {
  const ContractFactory = await ethers.getContractFactory(contractName);

  let contract;

  switch (contractName) {
    case "TrueBlockValidator":
      contract = await ContractFactory.deploy();
      break;

    case "TruthBoard":
      contract = await ContractFactory.deploy();
      break;

    case "TruthBoardFilecoin":
      // Para hardhat local, usar dirección dummy
      if (networkConfig.name === "hardhat") {
        contract = await ContractFactory.deploy(
          "0x0000000000000000000000000000000000000001" // filecoinAPI dummy
        );
      } else {
        // Para Filecoin real, usar dirección específica
        contract = await ContractFactory.deploy(
          "0x0000000000000000000000000000000000000001" // TODO: usar dirección real de Filecoin API
        );
      }
      break; case "TrueBlockMiniApp":
      contract = await ContractFactory.deploy();
      break;

    case "TrueBlockFlareOracle":
      // Para hardhat local, usar direcciones dummy
      if (networkConfig.name === "hardhat") {
        contract = await ContractFactory.deploy(
          "0x0000000000000000000000000000000000000001", // ftso dummy
          "0x0000000000000000000000000000000000000002", // fdc dummy  
          "0x0000000000000000000000000000000000000003"  // secureRandom dummy
        );
      } else {
        // Direcciones específicas de Flare según la red
        const flareAddresses = getFlareAddresses(networkConfig.name);
        contract = await ContractFactory.deploy(
          flareAddresses.ftso,
          flareAddresses.fdc,
          flareAddresses.secureRandom
        );
      }
      break; case "TruthBoardConfidential":
      // Para Zama FHE en Sepolia
      contract = await ContractFactory.deploy();
      break;

    default:
      throw new Error(`Contrato no reconocido: ${contractName}`);
  }

  await contract.waitForDeployment();
  return await contract.getAddress();
}

function getFlareAddresses(networkName) {
  const addresses = {
    flare: {
      ftso: "0x3d893C53D9e8056135C26C8c638B76C8b60D4778",
      fdc: "0x0000000000000000000000000000000000000000",
      secureRandom: "0x0000000000000000000000000000000000000000"
    },
    coston: {
      ftso: "0x3d893C53D9e8056135C26C8c638B76C8b60D4778",
      fdc: "0x0000000000000000000000000000000000000000",
      secureRandom: "0x0000000000000000000000000000000000000000"
    },
    coston2: {
      ftso: "0x3d893C53D9e8056135C26C8c638B76C8b60D4778",
      fdc: "0x0000000000000000000000000000000000000000",
      secureRandom: "0x0000000000000000000000000000000000000000"
    }
  };

  return addresses[networkName] || addresses.coston2;
}

async function saveDeploymentResults(results, networkName) {
  try {
    const fs = require('fs');
    const path = require('path');

    const deploymentsDir = path.join(__dirname, '../deployments');
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const filename = `deployment-${networkName}-${Date.now()}.json`;
    const filepath = path.join(deploymentsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
    console.log(`📝 Resultados guardados en: ${filepath}`);

    // Actualizar .env con las direcciones
    updateEnvFile(results.contracts, networkName);

  } catch (error) {
    console.warn("⚠️ No se pudieron guardar los resultados:", error.message);
  }
}

function updateEnvFile(contracts, networkName) {
  try {
    const fs = require('fs');
    const path = require('path');

    const envFile = path.join(__dirname, '../../.env');
    let envContent = '';

    if (fs.existsSync(envFile)) {
      envContent = fs.readFileSync(envFile, 'utf8');
    }

    // Agregar/actualizar direcciones de contratos
    Object.entries(contracts).forEach(([contractName, address]) => {
      const envVarName = `${contractName.toUpperCase()}_${networkName.toUpperCase()}_ADDRESS`;
      const envLine = `${envVarName}=${address}`;

      if (envContent.includes(envVarName)) {
        // Reemplazar línea existente
        const lines = envContent.split('\n');
        const updatedLines = lines.map(line => {
          if (line.startsWith(envVarName)) {
            return envLine;
          }
          return line;
        });
        envContent = updatedLines.join('\n');
      } else {
        // Agregar nueva línea
        envContent += envContent.endsWith('\n') ? '' : '\n';
        envContent += `\n# ${contractName} on ${networkName}\n`;
        envContent += envLine + '\n';
      }
    });

    fs.writeFileSync(envFile, envContent);
    console.log(`✅ .env actualizado con direcciones de ${networkName}`);

  } catch (error) {
    console.warn("⚠️ No se pudo actualizar .env:", error.message);
  }
}

// Función para deployment selectivo
async function deploySpecificContracts(contractNames) {
  console.log(`🎯 Deployment selectivo: ${contractNames.join(', ')}`);

  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  const networkConfigs = getNetworkConfigs();
  const currentNetworkConfig = detectCurrentNetwork(chainId, networkConfigs);

  if (!currentNetworkConfig) {
    throw new Error(`Red no soportada: Chain ID ${chainId}`);
  }

  const deploymentResults = {
    deployer: await (await ethers.getSigners())[0].getAddress(),
    timestamp: new Date().toISOString(),
    contracts: {},
    networks: { [currentNetworkConfig.name]: { chainId } }
  };

  for (const contractName of contractNames) {
    if (currentNetworkConfig.contracts.includes(contractName)) {
      try {
        const address = await deployContract(contractName, currentNetworkConfig);
        deploymentResults.contracts[contractName] = address;
        console.log(`✅ ${contractName}: ${address}`);
      } catch (error) {
        console.error(`❌ Error desplegando ${contractName}:`, error.message);
      }
    } else {
      console.warn(`⚠️ ${contractName} no está configurado para ${currentNetworkConfig.name}`);
    }
  }

  await saveDeploymentResults(deploymentResults, currentNetworkConfig.name);
  return deploymentResults;
}

// Exportar funciones para uso modular
module.exports = {
  main,
  deploySpecificContracts,
  getNetworkConfigs,
  detectCurrentNetwork
};

// Ejecutar deployment si es llamado directamente
if (require.main === module) {
  main()
    .then((results) => {
      console.log("🎉 Deployment completado exitosamente!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Error en deployment:", error);
      process.exit(1);
    });
}
