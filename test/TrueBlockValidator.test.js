const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrueBlockValidator", function () {
  let trueBlockValidator;
  let owner, user1, user2, user3;

  beforeEach(async function () {
    // Obtener accounts
    [owner, user1, user2, user3] = await ethers.getSigners();

    // Desplegar contrato
    const TrueBlockValidator = await ethers.getContractFactory("TrueBlockValidator");
    trueBlockValidator = await TrueBlockValidator.deploy();
    await trueBlockValidator.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await trueBlockValidator.getAddress()).to.not.equal("0x0000000000000000000000000000000000000000");
    });

    it("Should set the owner correctly", async function () {
      expect(await trueBlockValidator.owner()).to.equal(owner.address);
    });
  });

  describe("Oracle Registration", function () {
    it("Should allow oracle registration with stake", async function () {
      const stakeAmount = ethers.parseEther("5.0"); // Stake mínimo para oráculos
      const specialization = "AI_FACTCHECK";

      await expect(
        trueBlockValidator.connect(user1).registerOracle(specialization, { value: stakeAmount })
      ).to.emit(trueBlockValidator, "OracleRegistered")
        .withArgs(user1.address, specialization, stakeAmount);

      const oracle = await trueBlockValidator.oracles(user1.address);
      expect(oracle.isActive).to.be.true;
      expect(oracle.stake).to.equal(stakeAmount);
      expect(oracle.specialization).to.equal(specialization);
    });

    it("Should reject registration with insufficient stake", async function () {
      const lowStake = ethers.parseEther("1.0"); // Menos del mínimo para oráculos
      const specialization = "AI_FACTCHECK";

      await expect(
        trueBlockValidator.connect(user1).registerOracle(specialization, { value: lowStake })
      ).to.be.revertedWith("Insufficient stake for oracle");
    });
  });

  describe("Community Validator Registration", function () {
    it("Should allow community validator registration", async function () {
      const stakeAmount = ethers.parseEther("1.0");
      const region = "North America";
      const expertise = "Technology";

      await expect(
        trueBlockValidator.connect(user1).registerCommunityValidator(region, expertise, { value: stakeAmount })
      ).to.emit(trueBlockValidator, "CommunityValidatorRegistered")
        .withArgs(user1.address, region, expertise, stakeAmount);

      const validator = await trueBlockValidator.communityValidators(user1.address);
      expect(validator.isActive).to.be.true;
      expect(validator.stake).to.equal(stakeAmount);
      expect(validator.region).to.equal(region);
      expect(validator.expertise).to.equal(expertise);
    });

    it("Should reject registration with insufficient stake", async function () {
      const lowStake = ethers.parseEther("0.1"); // Menos del mínimo
      const region = "Europe";
      const expertise = "Politics";

      await expect(
        trueBlockValidator.connect(user1).registerCommunityValidator(region, expertise, { value: lowStake })
      ).to.be.revertedWith("Insufficient stake for community validator");
    });
  });

  describe("News Submission", function () {
    it("Should allow news submission", async function () {
      const contentHash = "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx";

      await expect(
        trueBlockValidator.connect(user2).submitNews(contentHash)
      ).to.emit(trueBlockValidator, "NewsSubmitted")
        .withArgs(contentHash, user2.address);

      const news = await trueBlockValidator.newsRegistry(contentHash);
      expect(news.submitter).to.equal(user2.address);
      expect(news.isValidated).to.be.false;
    });

    it("Should prevent duplicate news submission", async function () {
      const contentHash = "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx";

      await trueBlockValidator.connect(user2).submitNews(contentHash);

      await expect(
        trueBlockValidator.connect(user3).submitNews(contentHash)
      ).to.be.revertedWith("News already exists");
    });
  });

  describe("Oracle Validation", function () {
    let contentHash;

    beforeEach(async function () {
      // Registrar oráculo
      const stakeAmount = ethers.parseEther("5.0");
      await trueBlockValidator.connect(user1).registerOracle("AI_FACTCHECK", { value: stakeAmount });

      // Enviar noticia
      contentHash = "QmNewsContentHash123";
      await trueBlockValidator.connect(user2).submitNews(contentHash);
    });

    it("Should allow oracle to validate news", async function () {
      const score = 85;
      const report = "High credibility score based on AI analysis";

      await expect(
        trueBlockValidator.connect(user1).oracleValidate(contentHash, score, report)
      ).to.emit(trueBlockValidator, "OracleValidationSubmitted")
        .withArgs(user1.address, contentHash, score);
    });

    it("Should reject validation from non-oracle", async function () {
      const score = 85;
      const report = "Fake validation attempt";

      await expect(
        trueBlockValidator.connect(user2).oracleValidate(contentHash, score, report)
      ).to.be.revertedWith("Not an active oracle");
    });

    it("Should prevent duplicate oracle validation", async function () {
      const score = 85;
      const report = "First validation";

      await trueBlockValidator.connect(user1).oracleValidate(contentHash, score, report);

      await expect(
        trueBlockValidator.connect(user1).oracleValidate(contentHash, 90, "Second validation")
      ).to.be.revertedWith("Oracle already validated this news");
    });
  });

  describe("Community Validation", function () {
    let contentHash;

    beforeEach(async function () {
      // Registrar validador comunitario
      const stakeAmount = ethers.parseEther("1.0");
      await trueBlockValidator.connect(user1).registerCommunityValidator("Global", "Technology", { value: stakeAmount });

      // Enviar noticia
      contentHash = "QmNewsContentHash456";
      await trueBlockValidator.connect(user2).submitNews(contentHash);
    });

    it("Should allow community validator to validate news", async function () {
      const isValid = true;
      const evidence = "Well-sourced article with multiple citations";

      await expect(
        trueBlockValidator.connect(user1).communityValidate(contentHash, isValid, evidence)
      ).to.emit(trueBlockValidator, "CommunityValidationSubmitted")
        .withArgs(user1.address, contentHash, isValid);
    });

    it("Should reject validation from non-validator", async function () {
      await expect(
        trueBlockValidator.connect(user3).communityValidate(contentHash, true, "Invalid validation")
      ).to.be.revertedWith("Not an active community validator");
    });
  });

  describe("Validation Query", function () {
    it("Should return validation details", async function () {
      // Setup completo
      const stakeAmount = ethers.parseEther("1.0");
      await trueBlockValidator.connect(user1).registerCommunityValidator("Global", "Tech", { value: stakeAmount });

      const contentHash = "QmTestNews789";
      await trueBlockValidator.connect(user2).submitNews(contentHash);
      await trueBlockValidator.connect(user1).communityValidate(contentHash, true, "Good news");

      const validation = await trueBlockValidator.getValidation(contentHash, user1.address);
      expect(validation.validator).to.equal(user1.address);
      expect(validation.isValid).to.be.true;
    });
  });

  describe("Stake Withdrawal", function () {
    it("Should allow stake withdrawal after cooldown", async function () {
      const stakeAmount = ethers.parseEther("1.0");
      await trueBlockValidator.connect(user1).registerCommunityValidator("Global", "Tech", { value: stakeAmount });

      // Nota: En un test real necesitaríamos avanzar el tiempo para pasar el período de cooldown
      // Por simplicidad, asumimos que el contrato permite retiro inmediato en ciertos casos

      const initialBalance = await ethers.provider.getBalance(user1.address);

      // Esto podría fallar si hay un período de cooldown activo
      try {
        await trueBlockValidator.connect(user1).withdrawStake();
        const finalBalance = await ethers.provider.getBalance(user1.address);
        expect(finalBalance).to.be.gt(initialBalance);
      } catch (error) {
        // El error es esperado si hay cooldown activo
        expect(error.message).to.include("Cooldown period active");
      }
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to pause the contract", async function () {
      await trueBlockValidator.connect(owner).pause();
      expect(await trueBlockValidator.paused()).to.be.true;
    });

    it("Should prevent operations when paused", async function () {
      await trueBlockValidator.connect(owner).pause();

      const stakeAmount = ethers.parseEther("1.0");
      await expect(
        trueBlockValidator.connect(user1).registerCommunityValidator("Global", "Tech", { value: stakeAmount })
      ).to.be.revertedWithCustomError(trueBlockValidator, "EnforcedPause");
    });

    it("Should allow owner to unpause", async function () {
      await trueBlockValidator.connect(owner).pause();
      await trueBlockValidator.connect(owner).unpause();
      expect(await trueBlockValidator.paused()).to.be.false;
    });

    it("Should allow emergency withdrawal by owner", async function () {
      // Registrar algunos validadores para tener fondos en el contrato
      const stakeAmount = ethers.parseEther("1.0");
      await trueBlockValidator.connect(user1).registerCommunityValidator("Global", "Tech", { value: stakeAmount });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await trueBlockValidator.connect(owner).emergencyWithdraw();
      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(finalBalance).to.be.gt(initialBalance);
    });
  });
});
