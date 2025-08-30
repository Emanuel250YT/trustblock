const hre = require("hardhat");

async function main() {
  console.log("🔐 Desplegando TruthBoardConfidential con Zama FHE...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Mock FHEVM address (en testnet/mainnet usar la dirección real)
  const MOCK_FHEVM_ADDRESS = "0x0000000000000000000000000000000000000001";

  // Desplegar TruthBoardConfidential
  console.log("\n📋 Desplegando TruthBoardConfidential...");
  const TruthBoardConfidential = await hre.ethers.getContractFactory("TruthBoardConfidential");
  const truthBoardConfidential = await TruthBoardConfidential.deploy(MOCK_FHEVM_ADDRESS);

  await truthBoardConfidential.waitForDeployment();
  const confidentialAddress = await truthBoardConfidential.getAddress();

  console.log("✅ TruthBoardConfidential desplegado en:", confidentialAddress);

  // Verificar despliegue
  console.log("\n🔍 Verificando despliegue...");
  const newsCounter = await truthBoardConfidential.getTotalNews();
  console.log("Total de noticias iniciales:", newsCounter.toString());

  // Datos del despliegue
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    contracts: {
      TruthBoardConfidential: confidentialAddress,
      FHEVM_Address: MOCK_FHEVM_ADDRESS
    },
    timestamp: new Date().toISOString(),
    block: await hre.ethers.provider.getBlockNumber()
  };

  console.log("\n📊 Información del despliegue:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Guardar información en archivo
  const fs = require('fs');
  const path = require('path');

  const deploymentPath = path.join(__dirname, '..', 'deployments', `confidential-${hre.network.name}.json`);

  // Crear directorio si no existe
  const deploymentDir = path.dirname(deploymentPath);
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`📄 Información guardada en: ${deploymentPath}`);

  // Simular registro de validador
  console.log("\n🧪 Simulando operaciones confidenciales...");

  // Mock encrypted reputation (en implementación real sería cifrado por FHE)
  const mockEncryptedReputation = hre.ethers.hexlify(hre.ethers.randomBytes(32));

  console.log("Registrando validador de prueba...");
  const tx1 = await truthBoardConfidential.registerValidator(mockEncryptedReputation);
  await tx1.wait();
  console.log("✅ Validador registrado con reputación cifrada");

  // Verificar stats del validador
  const stats = await truthBoardConfidential.getValidatorStats(deployer.address);
  console.log("📈 Stats del validador:", {
    isActive: stats[0],
    validationsCount: stats[1].toString(),
    lastValidation: stats[2].toString()
  });

  console.log("\n🎉 Despliegue de TruthBoardConfidential completado exitosamente!");
  console.log("🔒 Sistema de validación confidencial listo para usar");

  return deploymentInfo;
}

main()
  .then((result) => {
    console.log("\n✨ Despliegue finalizado:", result.contracts.TruthBoardConfidential);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en el despliegue:", error);
    process.exit(1);
  });
