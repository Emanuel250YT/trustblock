const { expect } = require("chai");
const { ethers } = require("hardhat");

// Configuración global para las pruebas
before(async function () {
  console.log("🧪 Iniciando suite de pruebas TrueBlock");
  console.log("📋 Configurando entorno de pruebas...");
});

after(async function () {
  console.log("✅ Suite de pruebas completada");
});

// Utilidades compartidas para las pruebas
class TestHelpers {
  static async deployAllContracts() {
    const [owner, ...users] = await ethers.getSigners();

    // Deploy TrueBlockValidator
    const TrueBlockValidator = await ethers.getContractFactory("TrueBlockValidator");
    const trueBlockValidator = await TrueBlockValidator.deploy();
    await trueBlockValidator.waitForDeployment();

    // Deploy TruthBoard
    const TruthBoard = await ethers.getContractFactory("TruthBoard");
    const truthBoard = await TruthBoard.deploy();
    await truthBoard.waitForDeployment();

    // Deploy TruthBoardFilecoin
    const TruthBoardFilecoin = await ethers.getContractFactory("TruthBoardFilecoin");
    const filecoinAPI = "0x0000000000000000000000000000000000000000";
    const truthBoardFilecoin = await TruthBoardFilecoin.deploy(filecoinAPI);
    await truthBoardFilecoin.waitForDeployment();

    return {
      owner,
      users,
      trueBlockValidator,
      truthBoard,
      truthBoardFilecoin
    };
  }

  static generateRandomHash(prefix = "test") {
    return ethers.keccak256(ethers.toUtf8Bytes(`${prefix}_${Date.now()}_${Math.random()}`));
  }

  static async registerValidator(contract, user, stakeAmount = "1.0") {
    const stake = ethers.parseEther(stakeAmount);
    return await contract.connect(user).registerValidator({ value: stake });
  }

  static async submitTestNews(contract, user, title = "Test News", category = "Technology") {
    return await contract.connect(user).submitNews(
      title,
      "Test news content for automated testing",
      category,
      ["https://test-source.com"],
      "Global"
    );
  }
}

module.exports = {
  TestHelpers,
  expect,
  ethers
};
