const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrueBlock Contracts - Simple Tests", function () {
  let trueBlockValidator, truthBoard, truthBoardFilecoin;
  let owner, user1, user2, user3;

  before(async function () {
    // Obtener accounts
    [owner, user1, user2, user3] = await ethers.getSigners();

    // Desplegar todos los contratos
    console.log("🚀 Desplegando contratos para pruebas...");

    const TrueBlockValidator = await ethers.getContractFactory("TrueBlockValidator");
    trueBlockValidator = await TrueBlockValidator.deploy();
    await trueBlockValidator.waitForDeployment();

    const TruthBoard = await ethers.getContractFactory("TruthBoard");
    truthBoard = await TruthBoard.deploy();
    await truthBoard.waitForDeployment();

    const TruthBoardFilecoin = await ethers.getContractFactory("TruthBoardFilecoin");
    const filecoinAPI = "0x0000000000000000000000000000000000000000";
    truthBoardFilecoin = await TruthBoardFilecoin.deploy(filecoinAPI);
    await truthBoardFilecoin.waitForDeployment();

    console.log("✅ Contratos desplegados exitosamente");
  });

  describe("Deployment Tests", function () {
    it("Should deploy all contracts successfully", async function () {
      expect(await trueBlockValidator.getAddress()).to.not.equal("0x0000000000000000000000000000000000000000");
      expect(await truthBoard.getAddress()).to.not.equal("0x0000000000000000000000000000000000000000");
      expect(await truthBoardFilecoin.getAddress()).to.not.equal("0x0000000000000000000000000000000000000000");
    });

    it("Should set correct owners", async function () {
      expect(await trueBlockValidator.owner()).to.equal(owner.address);
      expect(await truthBoard.owner()).to.equal(owner.address);
      expect(await truthBoardFilecoin.owner()).to.equal(owner.address);
    });

    it("Should not be paused initially", async function () {
      expect(await trueBlockValidator.paused()).to.be.false;
      expect(await truthBoard.paused()).to.be.false;
      expect(await truthBoardFilecoin.paused()).to.be.false;
    });
  });

  describe("TrueBlockValidator Basic Functions", function () {
    it("Should allow oracle registration", async function () {
      const stakeAmount = ethers.parseEther("5.0");
      const specialization = "AI_FACTCHECK";

      await expect(
        trueBlockValidator.connect(user1).registerOracle(specialization, { value: stakeAmount })
      ).to.emit(trueBlockValidator, "OracleRegistered");

      const oracle = await trueBlockValidator.oracles(user1.address);
      expect(oracle.isActive).to.be.true;
    });

    it("Should allow community validator registration", async function () {
      const stakeAmount = ethers.parseEther("1.0");
      const category = "Technology";

      await expect(
        trueBlockValidator.connect(user2).registerCommunityValidator(category, { value: stakeAmount })
      ).to.emit(trueBlockValidator, "CommunityValidatorRegistered");

      const validator = await trueBlockValidator.communityValidators(user2.address);
      expect(validator.isActive).to.be.true;
    });

    it("Should allow news submission", async function () {
      const contentHash = "QmTestNewsContent123";

      await expect(
        trueBlockValidator.connect(user3).submitNews(contentHash)
      ).to.emit(trueBlockValidator, "NewsSubmitted");
    });
  });

  describe("TruthBoard Basic Functions", function () {
    it("Should allow anonymous validator registration", async function () {
      const commitmentHash = ethers.keccak256(ethers.toUtf8Bytes("secret_identity_123"));
      const region = "North America";

      await expect(
        truthBoard.connect(user1).registerAnonymousValidator(commitmentHash, region)
      ).to.emit(truthBoard, "AnonymousValidatorRegistered");

      const validator = await truthBoard.validators(commitmentHash);
      expect(validator.isActive).to.be.true;
    });

    it("Should allow anonymous news publishing", async function () {
      const contentHash = ethers.keccak256(ethers.toUtf8Bytes("encrypted_news_content"));
      const zkProofHash = ethers.keccak256(ethers.toUtf8Bytes("zk_proof_data"));
      const ipfsHash = "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx";

      await expect(
        truthBoard.connect(user2).publishAnonymousNews(contentHash, zkProofHash, ipfsHash)
      ).to.emit(truthBoard, "AnonymousNewsPublished");

      const news = await truthBoard.newsRegistry(contentHash);
      expect(news.contentHash).to.equal(contentHash);
    });

    it("Should allow anonymous donations", async function () {
      const contentHash = ethers.keccak256(ethers.toUtf8Bytes("encrypted_news_content"));
      const donationAmount = ethers.parseEther("0.1");
      const donorCommitment = ethers.keccak256(ethers.toUtf8Bytes("donor_secret_123"));

      await expect(
        truthBoard.connect(user3).donateAnonymously(contentHash, donorCommitment, { value: donationAmount })
      ).to.emit(truthBoard, "AnonymousDonationReceived");
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owners to pause contracts", async function () {
      await trueBlockValidator.connect(owner).pause();
      await truthBoard.connect(owner).pause();
      await truthBoardFilecoin.connect(owner).pause();

      expect(await trueBlockValidator.paused()).to.be.true;
      expect(await truthBoard.paused()).to.be.true;
      expect(await truthBoardFilecoin.paused()).to.be.true;
    });

    it("Should allow owners to unpause contracts", async function () {
      await trueBlockValidator.connect(owner).unpause();
      await truthBoard.connect(owner).unpause();
      await truthBoardFilecoin.connect(owner).unpause();

      expect(await trueBlockValidator.paused()).to.be.false;
      expect(await truthBoard.paused()).to.be.false;
      expect(await truthBoardFilecoin.paused()).to.be.false;
    });

    it("Should allow emergency withdrawals", async function () {
      const initialBalance = await ethers.provider.getBalance(owner.address);

      await trueBlockValidator.connect(owner).emergencyWithdraw();
      await truthBoard.connect(owner).emergencyWithdraw();

      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("Integration Test", function () {
    it("Should demonstrate complete news validation flow", async function () {
      console.log("🔄 Ejecutando flujo completo de validación de noticias...");

      // 1. Registrar oráculo
      const oracleStake = ethers.parseEther("5.0");
      await trueBlockValidator.connect(user1).registerOracle("AI_FACTCHECK", { value: oracleStake });

      // 2. Registrar validador comunitario
      const validatorStake = ethers.parseEther("1.0");
      await trueBlockValidator.connect(user2).registerCommunityValidator("Technology", { value: validatorStake });

      // 3. Enviar noticia
      const newsHash = "QmIntegrationTestNews123";
      await trueBlockValidator.connect(user3).submitNews(newsHash);

      // 4. Verificar que la noticia fue registrada
      const news = await trueBlockValidator.newsRegistry(newsHash);
      expect(news.submitter).to.equal(user3.address);

      console.log("✅ Flujo de integración completado exitosamente");
    });
  });

  describe("Contract Addresses for .env", function () {
    it("Should provide contract addresses for .env file", async function () {
      const trueBlockAddress = await trueBlockValidator.getAddress();
      const truthBoardAddress = await truthBoard.getAddress();
      const truthBoardFilecoinAddress = await truthBoardFilecoin.getAddress();

      console.log("\n📋 Direcciones de contratos para tu .env:");
      console.log(`CONTRACT_ADDRESS=${trueBlockAddress}`);
      console.log(`TRUTHBOARD_CONTRACT_ADDRESS=${truthBoardAddress}`);
      console.log(`TRUTHBOARD_FILECOIN_CONTRACT_ADDRESS=${truthBoardFilecoinAddress}`);

      // Verificar que las direcciones son válidas
      expect(trueBlockAddress).to.match(/^0x[a-fA-F0-9]{40}$/);
      expect(truthBoardAddress).to.match(/^0x[a-fA-F0-9]{40}$/);
      expect(truthBoardFilecoinAddress).to.match(/^0x[a-fA-F0-9]{40}$/);
    });
  });
});
