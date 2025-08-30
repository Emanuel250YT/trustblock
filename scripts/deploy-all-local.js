const hre = require("hardhat");

async function main() {
  console.log("🚀 Desplegando todos los contratos localmente...");

  // Obtener el deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Desplegando con cuenta:", deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

  console.log("\n1. Desplegando TrueBlockValidator...");
  const TrueBlockValidator = await hre.ethers.getContractFactory("TrueBlockValidator");
  const trueBlockValidator = await TrueBlockValidator.deploy();
  await trueBlockValidator.waitForDeployment();
  const trueBlockAddress = await trueBlockValidator.getAddress();
  console.log("✅ TrueBlockValidator desplegado en:", trueBlockAddress);

  console.log("\n2. Desplegando TruthBoard...");
  const TruthBoard = await hre.ethers.getContractFactory("TruthBoard");
  const truthBoard = await TruthBoard.deploy();
  await truthBoard.waitForDeployment();
  const truthBoardAddress = await truthBoard.getAddress();
  console.log("✅ TruthBoard desplegado en:", truthBoardAddress);

  console.log("\n3. Desplegando TruthBoardFilecoin...");
  const TruthBoardFilecoin = await hre.ethers.getContractFactory("TruthBoardFilecoin");
  const filecoinAPI = "0x0000000000000000000000000000000000000000";
  const truthBoardFilecoin = await TruthBoardFilecoin.deploy(filecoinAPI);
  await truthBoardFilecoin.waitForDeployment();
  const truthBoardFilecoinAddress = await truthBoardFilecoin.getAddress();
  console.log("✅ TruthBoardFilecoin desplegado en:", truthBoardFilecoinAddress);

  console.log("\n📋 Resumen de contratos desplegados:");
  console.log("TrueBlockValidator:", trueBlockAddress);
  console.log("TruthBoard:", truthBoardAddress);
  console.log("TruthBoardFilecoin:", truthBoardFilecoinAddress);

  console.log("\n🔧 Actualiza tu .env con:");
  console.log(`CONTRACT_ADDRESS=${trueBlockAddress}`);
  console.log(`TRUTHBOARD_CONTRACT_ADDRESS=${truthBoardAddress}`);
  console.log(`TRUTHBOARD_FILECOIN_CONTRACT_ADDRESS=${truthBoardFilecoinAddress}`);

  console.log("\n🎉 ¡Todos los contratos desplegados exitosamente!");

  return {
    trueBlockAddress,
    truthBoardAddress,
    truthBoardFilecoinAddress
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
