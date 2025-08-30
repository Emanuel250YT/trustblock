const hre = require("hardhat");

async function main() {
  console.log("🚀 Desplegando TrueBlockValidator...");

  // Obtener el deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Desplegando con cuenta:", deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

  // Desplegar el contrato
  const TrueBlockValidator = await hre.ethers.getContractFactory("TrueBlockValidator");
  const trueBlockValidator = await TrueBlockValidator.deploy();

  await trueBlockValidator.waitForDeployment();

  const contractAddress = await trueBlockValidator.getAddress();
  console.log("✅ TrueBlockValidator desplegado en:", contractAddress);

  // Guardar dirección en .env
  console.log("\n📋 Configura tu .env con:");
  console.log(`CONTRACT_ADDRESS=${contractAddress}`);

  // Verificar en explorer (si no es localhost)
  const network = await hre.network.config;
  if (network.chainId !== 31337) { // No localhost
    console.log("\n🔍 Esperando para verificar contrato...");
    await new Promise(resolve => setTimeout(resolve, 30000)); // Esperar 30 segundos

    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contrato verificado en explorer");
    } catch (error) {
      console.log("❌ Error verificando contrato:", error.message);
    }
  }

  // Mostrar información del gas usado
  const deployTransaction = trueBlockValidator.deploymentTransaction();
  if (deployTransaction) {
    console.log("⛽ Gas usado:", deployTransaction.gasLimit?.toString());
    console.log("💸 Precio del gas:", hre.ethers.formatUnits(deployTransaction.gasPrice || 0, "gwei"), "gwei");
  }

  console.log("\n🎉 ¡Despliegue completado exitosamente!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error en despliegue:", error);
    process.exit(1);
  });
