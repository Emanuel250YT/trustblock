const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TruthBoard", function () {
  let truthBoard;
  let owner, user1, user2, user3;

  beforeEach(async function () {
    // Obtener accounts
    [owner, user1, user2, user3] = await ethers.getSigners();

    // Desplegar contrato
    const TruthBoard = await ethers.getContractFactory("TruthBoard");
    truthBoard = await TruthBoard.deploy();
    await truthBoard.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await truthBoard.getAddress()).to.not.equal("0x0000000000000000000000000000000000000000");
    });

    it("Should set the owner correctly", async function () {
      expect(await truthBoard.owner()).to.equal(owner.address);
    });

    it("Should not be paused initially", async function () {
      expect(await truthBoard.paused()).to.be.false;
    });
  });

  describe("Anonymous Validator Registration", function () {
    it("Should allow anonymous validator registration", async function () {
      const commitmentHash = ethers.keccak256(ethers.toUtf8Bytes("secret_identity_123"));
      const region = "North America";

      await expect(
        truthBoard.connect(user1).registerAnonymousValidator(commitmentHash, region)
      ).to.emit(truthBoard, "AnonymousValidatorRegistered")
        .withArgs(commitmentHash, region);

      const validator = await truthBoard.validators(commitmentHash);
      expect(validator.isActive).to.be.true;
      expect(validator.region).to.equal(region);
    });

    it("Should prevent duplicate validator registration", async function () {
      const commitmentHash = ethers.keccak256(ethers.toUtf8Bytes("secret_identity_123"));
      const region = "Europe";

      await truthBoard.connect(user1).registerAnonymousValidator(commitmentHash, region);

      await expect(
        truthBoard.connect(user2).registerAnonymousValidator(commitmentHash, region)
      ).to.be.revertedWith("Validator already registered");
    });
  });

  describe("Anonymous News Publishing", function () {
    let validatorCommitment;

    beforeEach(async function () {
      // Registrar un validador anónimo
      validatorCommitment = ethers.keccak256(ethers.toUtf8Bytes("validator_secret_123"));
      await truthBoard.connect(user1).registerAnonymousValidator(validatorCommitment, "Global");
    });

    it("Should allow anonymous news publishing", async function () {
      const contentHash = ethers.keccak256(ethers.toUtf8Bytes("encrypted_news_content"));
      const zkProofHash = ethers.keccak256(ethers.toUtf8Bytes("zk_proof_data"));
      const ipfsHash = "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx";

      await expect(
        truthBoard.connect(user2).publishAnonymousNews(contentHash, zkProofHash, ipfsHash)
      ).to.emit(truthBoard, "AnonymousNewsPublished")
        .withArgs(contentHash, zkProofHash, ipfsHash);

      const news = await truthBoard.newsRegistry(contentHash);
      expect(news.contentHash).to.equal(contentHash);
      expect(news.zkProofHash).to.equal(zkProofHash);
      expect(news.ipfsHash).to.equal(ipfsHash);
    });

    it("Should prevent duplicate news publishing", async function () {
      const contentHash = ethers.keccak256(ethers.toUtf8Bytes("encrypted_news_content"));
      const zkProofHash = ethers.keccak256(ethers.toUtf8Bytes("zk_proof_data"));
      const ipfsHash = "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx";

      await truthBoard.connect(user2).publishAnonymousNews(contentHash, zkProofHash, ipfsHash);

      await expect(
        truthBoard.connect(user3).publishAnonymousNews(contentHash, zkProofHash, ipfsHash)
      ).to.be.revertedWith("News already exists");
    });
  });

  describe("Anonymous Donations", function () {
    let contentHash, zkProofHash;

    beforeEach(async function () {
      // Registrar validador y publicar noticia
      const validatorCommitment = ethers.keccak256(ethers.toUtf8Bytes("validator_secret_123"));
      await truthBoard.connect(user1).registerAnonymousValidator(validatorCommitment, "Global");

      contentHash = ethers.keccak256(ethers.toUtf8Bytes("news_content_123"));
      zkProofHash = ethers.keccak256(ethers.toUtf8Bytes("zk_proof_123"));
      const ipfsHash = "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx";

      await truthBoard.connect(user2).publishAnonymousNews(contentHash, zkProofHash, ipfsHash);
    });

    it("Should allow anonymous donations to news", async function () {
      const donationAmount = ethers.parseEther("0.1");
      const donorCommitment = ethers.keccak256(ethers.toUtf8Bytes("donor_secret_123"));

      await expect(
        truthBoard.connect(user3).donateAnonymously(contentHash, donorCommitment, { value: donationAmount })
      ).to.emit(truthBoard, "AnonymousDonationReceived")
        .withArgs(contentHash, donationAmount, donorCommitment);

      const news = await truthBoard.newsRegistry(contentHash);
      expect(news.donationPool).to.equal(donationAmount);
    });

    it("Should reject donations to non-existent news", async function () {
      const nonExistentHash = ethers.keccak256(ethers.toUtf8Bytes("non_existent_news"));
      const donorCommitment = ethers.keccak256(ethers.toUtf8Bytes("donor_secret_123"));
      const donationAmount = ethers.parseEther("0.1");

      await expect(
        truthBoard.connect(user3).donateAnonymously(nonExistentHash, donorCommitment, { value: donationAmount })
      ).to.be.revertedWith("News does not exist");
    });
  });

  describe("News Validation", function () {
    let contentHash, validatorCommitment;

    beforeEach(async function () {
      // Setup completo: validador y noticia
      validatorCommitment = ethers.keccak256(ethers.toUtf8Bytes("validator_secret_123"));
      await truthBoard.connect(user1).registerAnonymousValidator(validatorCommitment, "Global");

      contentHash = ethers.keccak256(ethers.toUtf8Bytes("news_content_123"));
      const zkProofHash = ethers.keccak256(ethers.toUtf8Bytes("zk_proof_123"));
      const ipfsHash = "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx";

      await truthBoard.connect(user2).publishAnonymousNews(contentHash, zkProofHash, ipfsHash);
    });

    it("Should allow news validation", async function () {
      const isValid = true;
      const validationEvidence = "Evidence supporting validity";
      const confidenceScore = 85;

      await expect(
        truthBoard.connect(user1).validateNews(contentHash, isValid, validationEvidence, confidenceScore)
      ).to.emit(truthBoard, "NewsValidated")
        .withArgs(contentHash, user1.address, isValid, confidenceScore);
    });

    it("Should reject validation from non-registered validator", async function () {
      await expect(
        truthBoard.connect(user3).validateNews(contentHash, true, "Invalid validation", 85)
      ).to.be.revertedWith("Validator not registered or not active");
    });

    it("Should prevent duplicate validation from same validator", async function () {
      await truthBoard.connect(user1).validateNews(contentHash, true, "First validation", 85);

      await expect(
        truthBoard.connect(user1).validateNews(contentHash, true, "Second validation", 90)
      ).to.be.revertedWith("Validator already validated this news");
    });
  });

  describe("News Information Queries", function () {
    let contentHash;

    beforeEach(async function () {
      // Setup: validador y noticia
      const validatorCommitment = ethers.keccak256(ethers.toUtf8Bytes("validator_secret"));
      await truthBoard.connect(user1).registerAnonymousValidator(validatorCommitment, "Global");

      contentHash = ethers.keccak256(ethers.toUtf8Bytes("news_content"));
      const zkProofHash = ethers.keccak256(ethers.toUtf8Bytes("zk_proof"));
      const ipfsHash = "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx";

      await truthBoard.connect(user2).publishAnonymousNews(contentHash, zkProofHash, ipfsHash);
    });

    it("Should return news information", async function () {
      const newsInfo = await truthBoard.getNewsInfo(contentHash);

      expect(newsInfo.contentHash).to.equal(contentHash);
      expect(newsInfo.timestamp).to.be.gt(0);
      expect(newsInfo.donationPool).to.equal(0);
      expect(newsInfo.validationScore).to.equal(0);
      expect(newsInfo.isValidated).to.be.false;
    });

    it("Should return global statistics", async function () {
      const stats = await truthBoard.getGlobalStats();

      expect(stats.totalNews).to.be.gt(0);
      expect(stats.totalValidators).to.be.gt(0);
      expect(stats.totalDonations).to.equal(0);
      expect(stats.totalValidatedNews).to.equal(0);
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to pause the contract", async function () {
      await truthBoard.connect(owner).pause();
      expect(await truthBoard.paused()).to.be.true;
    });

    it("Should prevent operations when paused", async function () {
      await truthBoard.connect(owner).pause();

      const commitmentHash = ethers.keccak256(ethers.toUtf8Bytes("test_commitment"));
      await expect(
        truthBoard.connect(user1).registerAnonymousValidator(commitmentHash, "Global")
      ).to.be.revertedWithCustomError(truthBoard, "EnforcedPause");
    });

    it("Should allow validator fee updates by owner", async function () {
      const newFee = ethers.parseEther("0.002");

      await expect(
        truthBoard.connect(owner).updateValidatorFee(newFee)
      ).to.emit(truthBoard, "ValidatorFeeUpdated")
        .withArgs(newFee);
    });

    it("Should allow emergency withdrawal by owner", async function () {
      // Hacer una donación primero
      const validatorCommitment = ethers.keccak256(ethers.toUtf8Bytes("validator_secret"));
      await truthBoard.connect(user1).registerAnonymousValidator(validatorCommitment, "Global");

      const contentHash = ethers.keccak256(ethers.toUtf8Bytes("news_content"));
      const zkProofHash = ethers.keccak256(ethers.toUtf8Bytes("zk_proof"));
      const ipfsHash = "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx";

      await truthBoard.connect(user2).publishAnonymousNews(contentHash, zkProofHash, ipfsHash);

      const donationAmount = ethers.parseEther("0.1");
      const donorCommitment = ethers.keccak256(ethers.toUtf8Bytes("donor_secret"));
      await truthBoard.connect(user3).donateAnonymously(contentHash, donorCommitment, { value: donationAmount });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await truthBoard.connect(owner).emergencyWithdraw();
      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("ZK Proof Verification", function () {
    it("Should handle ZK proof verification calls", async function () {
      const proof = "0x1234567890abcdef"; // Mock proof
      const publicSignals = ["signal1", "signal2"];

      // Nota: Estas funciones podrían retornar true por defecto en el mock
      const result = await truthBoard.verifyValidatorZKProof(proof, publicSignals);
      expect(typeof result).to.equal("boolean");
    });
  });
});
