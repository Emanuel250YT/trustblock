const hre = require("hardhat");
const { ethers } = hre;

/**
 * Script para desplegar TrueBlockFlareOracle en Flare Network
 * Soporta Mainnet, Coston y Coston2
 */
async function main() {
  console.log("🚀 Iniciando deployment de TrueBlockFlareOracle en Flare...");

  // Configuraciones de red para Flare
  const networks = {
    flare: {
      name: "Flare Mainnet",
      chainId: 14,
      ftsoAddress: "0x0000000000000000000000000000000000000001", // Dummy para testing
      fdcAddress: "0x0000000000000000000000000000000000000002",
      secureRandomAddress: "0x0000000000000000000000000000000000000003"
    },
    coston: {
      name: "Coston Testnet",
      chainId: 16,
      ftsoAddress: "0x0000000000000000000000000000000000000001",
      fdcAddress: "0x0000000000000000000000000000000000000002",
      secureRandomAddress: "0x0000000000000000000000000000000000000003"
    },
    coston2: {
      name: "Coston2 Testnet",
      chainId: 114,
      ftsoAddress: "0x0000000000000000000000000000000000000001",
      fdcAddress: "0x0000000000000000000000000000000000000002",
      secureRandomAddress: "0x0000000000000000000000000000000000000003"
    }
  };

  // Detectar red actual
  const network = await hre.network.provider.send("eth_chainId");
  const chainId = parseInt(network, 16);

  let currentNetwork = null;
  for (const [key, config] of Object.entries(networks)) {
    if (config.chainId === chainId) {
      currentNetwork = { name: key, ...config };
      break;
    }
  }

  if (!currentNetwork) {
    console.error(`❌ Red no soportada. Chain ID: ${chainId}`);
    console.log("Redes soportadas:");
    Object.entries(networks).forEach(([key, config]) => {
      console.log(`  - ${config.name} (Chain ID: ${config.chainId})`);
    });
    return;
  }

  console.log(`📡 Desplegando en ${currentNetwork.name} (Chain ID: ${chainId})`);

  // Obtener deployer
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);

  console.log(`👤 Deployer: ${deployerAddress}`);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} FLR`);

  if (balance < ethers.parseEther("0.1")) {
    console.warn("⚠️ Balance bajo. Asegúrate de tener suficiente FLR para el deployment");
  }

  try {
    // Compilar contratos
    console.log("🔨 Compilando contratos...");
    await hre.run("compile");

    // Desplegar TrueBlockFlareOracle
    console.log("📄 Desplegando TrueBlockFlareOracle...");

    const TrueBlockFlareOracle = await ethers.getContractFactory("TrueBlockFlareOracle");

    const oracle = await TrueBlockFlareOracle.deploy(
      currentNetwork.ftsoAddress,
      currentNetwork.fdcAddress,
      currentNetwork.secureRandomAddress
    );

    await oracle.waitForDeployment();
    const oracleAddress = await oracle.getAddress();

    console.log(`✅ TrueBlockFlareOracle desplegado en: ${oracleAddress}`);

    // Verificar deployment
    console.log("🔍 Verificando deployment...");

    const deployedCode = await ethers.provider.getCode(oracleAddress);
    if (deployedCode === "0x") {
      throw new Error("El contrato no se desplegó correctamente");
    }

    // Configurar deployment info
    const deploymentInfo = {
      network: currentNetwork.name,
      chainId: chainId,
      contractAddress: oracleAddress,
      deployer: deployerAddress,
      timestamp: new Date().toISOString(),
      blockNumber: await ethers.provider.getBlockNumber(),
      interfaces: {
        ftso: currentNetwork.ftsoAddress,
        fdc: currentNetwork.fdcAddress,
        secureRandom: currentNetwork.secureRandomAddress
      },
      explorer: getExplorerUrl(currentNetwork.name, oracleAddress)
    };

    // Guardar info de deployment
    const fs = require('fs');
    const path = require('path');

    const deploymentsDir = path.join(__dirname, '../deployments');
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentFile = path.join(deploymentsDir, `flare-${currentNetwork.name}.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

    console.log(`📝 Deployment info guardada en: ${deploymentFile}`);

    // Actualizar .env con direcciones
    updateEnvFile(currentNetwork.name, oracleAddress);

    // Mostrar resumen
    console.log("\n🎉 ¡Deployment completado exitosamente!");
    console.log("📋 Resumen:");
    console.log(`   Red: ${currentNetwork.name}`);
    console.log(`   Contrato: ${oracleAddress}`);
    console.log(`   Explorer: ${deploymentInfo.explorer}`);
    console.log(`   Block: ${deploymentInfo.blockNumber}`);

    // Ejecutar tests básicos
    console.log("\n🧪 Ejecutando tests básicos...");
    await runBasicTests(oracle, currentNetwork);

    // Mostrar próximos pasos
    console.log("\n📝 Próximos pasos:");
    console.log("1. Verificar el contrato en el explorer");
    console.log("2. Configurar las variables de entorno");
    console.log("3. Registrar validadores iniciales");
    console.log("4. Configurar oráculos de datos");

    return {
      success: true,
      contractAddress: oracleAddress,
      network: currentNetwork.name,
      explorer: deploymentInfo.explorer
    };

  } catch (error) {
    console.error("❌ Error durante el deployment:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

function getExplorerUrl(networkName, contractAddress) {
  const explorers = {
    flare: `https://flarescan.com/address/${contractAddress}`,
    coston: `https://coston.testnet.flarescan.com/address/${contractAddress}`,
    coston2: `https://coston2.testnet.flarescan.com/address/${contractAddress}`
  };

  return explorers[networkName] || `https://flarescan.com/address/${contractAddress}`;
}

function updateEnvFile(networkName, contractAddress) {
  try {
    const fs = require('fs');
    const path = require('path');

    const envFile = path.join(__dirname, '../../.env');
    let envContent = '';

    if (fs.existsSync(envFile)) {
      envContent = fs.readFileSync(envFile, 'utf8');
    }

    const envVarName = `FLARE_${networkName.toUpperCase()}_CONTRACT`;
    const envLine = `${envVarName}=${contractAddress}`;

    // Verificar si ya existe la variable
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
      envContent += `\n# Flare ${networkName.charAt(0).toUpperCase() + networkName.slice(1)} Contract\n`;
      envContent += envLine + '\n';
    }

    fs.writeFileSync(envFile, envContent);
    console.log(`✅ .env actualizado con ${envVarName}`);

  } catch (error) {
    console.warn("⚠️ No se pudo actualizar .env:", error.message);
  }
}

async function runBasicTests(oracle, network) {
  try {
    console.log("  📊 Verificando owner...");
    const owner = await oracle.owner();
    console.log(`     Owner: ${owner}`);

    console.log("  🔢 Probando número aleatorio...");
    const randomNumber = await oracle.getSecureRandomNumber();
    console.log(`     Random: ${randomNumber}`);

    console.log("  💰 Probando precio FTSO...");
    try {
      const btcPrice = await oracle.getPriceFromFTSO("BTC");
      console.log(`     BTC Price: ${btcPrice.toString()}`);
    } catch (error) {
      console.log(`     BTC Price: Error (${error.message})`);
    }

    console.log("✅ Tests básicos completados");

  } catch (error) {
    console.warn("⚠️ Error en tests básicos:", error.message);
  }
}

// Ejecutar deployment si es llamado directamente
if (require.main === module) {
  main()
    .then((result) => {
      if (result.success) {
        console.log("🎉 Deployment exitoso!");
        process.exit(0);
      } else {
        console.error("❌ Deployment falló");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("💥 Error fatal:", error);
      process.exit(1);
    });
}

module.exports = { main };
