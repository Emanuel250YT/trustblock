const hre = require("hardhat");

async function main() {
  console.log("🚀 Desplegando TrueBlock Mini-App en Base...");
  console.log("🎯 Track: Base Mini-Apps - Simple, Snappy, and Fun!");

  // Obtener el deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Desplegando con cuenta:", deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

  // Verificar que estamos en Base
  const network = await hre.network;
  console.log("🌐 Red:", network.name);
  
  if (network.name !== "base" && network.name !== "base-sepolia") {
    console.log("⚠️  Advertencia: No estás en Base network!");
    console.log("💡 Usa: --network base o --network base-sepolia");
  }

  // Desplegar el contrato mini-app
  console.log("\n📦 Compilando TrueBlockMiniApp...");
  const TrueBlockMiniApp = await hre.ethers.getContractFactory("TrueBlockMiniApp");
  
  console.log("🚀 Desplegando contrato...");
  const trueBlockMiniApp = await TrueBlockMiniApp.deploy();

  await trueBlockMiniApp.waitForDeployment();

  const contractAddress = await trueBlockMiniApp.getAddress();
  console.log("✅ TrueBlockMiniApp desplegado en:", contractAddress);

  // Guardar información del despliegue
  const deploymentInfo = {
    network: network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contractName: "TrueBlockMiniApp",
    track: "Base Mini-Apps",
    description: "Truth checking mini-app for Base - simple, snappy, and fun!"
  };

  console.log("\n📋 Información del despliegue:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Guardar en archivo de deployments
  const fs = require('fs');
  const deploymentsDir = './deployments';
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const deploymentFile = `${deploymentsDir}/base-miniapp-${network.name}.json`;
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`💾 Información guardada en: ${deploymentFile}`);

  // Verificar en explorer (si no es localhost)
  if (network.config.chainId !== 31337) {
    console.log("\n🔍 Esperando para verificar contrato en explorer...");
    await new Promise(resolve => setTimeout(resolve, 30000)); // Esperar 30 segundos

    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contrato verificado en explorer");
    } catch (error) {
      console.log("❌ Error verificando contrato:", error.message);
      console.log("💡 Puedes verificar manualmente en el explorer");
    }
  }

  // Mostrar información del gas usado
  const deployTransaction = trueBlockMiniApp.deploymentTransaction();
  if (deployTransaction) {
    console.log("\n⛽ Información del gas:");
    console.log("Gas usado:", deployTransaction.gasLimit?.toString());
    console.log("Precio del gas:", hre.ethers.formatUnits(deployTransaction.gasPrice || 0, "gwei"), "gwei");
  }

  // Mostrar próximos pasos
  console.log("\n🎯 Próximos pasos para el hackathon:");
  console.log("1. 📱 Conecta tu wallet a Base App");
  console.log("2. 🔗 Interactúa con el contrato en:", contractAddress);
  console.log("3. 🧪 Prueba las funciones del mini-app");
  console.log("4. 🎨 Crea una UI simple y divertida");
  console.log("5. 🚀 ¡Demuestra tu mini-app a los jueces!");

  console.log("\n🎉 ¡TrueBlock Mini-App desplegado exitosamente en Base!");
  console.log("🌟 ¡Perfecto para el track Base Mini-Apps!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error en despliegue:", error);
    process.exit(1);
  });
