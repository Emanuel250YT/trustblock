const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TruthBoardFilecoin", function () {
  let truthBoardFilecoin;
  let owner, user1, user2, user3;
  const filecoinAPI = "0x0000000000000000000000000000000000000000"; // Mock address

  beforeEach(async function () {
    // Obtener accounts
    [owner, user1, user2, user3] = await ethers.getSigners();

    // Desplegar contrato
    const TruthBoardFilecoin = await ethers.getContractFactory("TruthBoardFilecoin");
    truthBoardFilecoin = await TruthBoardFilecoin.deploy(filecoinAPI);
    await truthBoardFilecoin.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await truthBoardFilecoin.getAddress()).to.not.equal("0x0000000000000000000000000000000000000000");
    });

    it("Should set the owner correctly", async function () {
      expect(await truthBoardFilecoin.owner()).to.equal(owner.address);
    });

    it("Should initialize archive policies", async function () {
      const newsPolicy = await truthBoardFilecoin.archivePolicies(0); // NEWS_CONTENT
      const evidencePolicy = await truthBoardFilecoin.archivePolicies(1); // VALIDATION_EVIDENCE

      expect(newsPolicy.minReputationScore).to.equal(50);
      expect(evidencePolicy.minReputationScore).to.equal(30);
    });
  });

  describe("Journalist Registration", function () {
    it("Should allow journalist registration", async function () {
      const ipfsHash = "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx";
      const region = "North America";

      await expect(
        truthBoardFilecoin.connect(user1).registerJournalist(ipfsHash, region)
      ).to.emit(truthBoardFilecoin, "JournalistRegistered")
        .withArgs(user1.address, ipfsHash, region);

      const journalist = await truthBoardFilecoin.journalists(user1.address);
      expect(journalist.isActive).to.be.true;
      expect(journalist.ipfsProfile).to.equal(ipfsHash);
      expect(journalist.region).to.equal(region);
    });

    it("Should prevent duplicate registration", async function () {
      const ipfsHash = "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx";
      const region = "Europe";

      await truthBoardFilecoin.connect(user1).registerJournalist(ipfsHash, region);

      await expect(
        truthBoardFilecoin.connect(user1).registerJournalist(ipfsHash, region)
      ).to.be.revertedWith("Already registered");
    });
  });

  describe("News Submission", function () {
    beforeEach(async function () {
      // Registrar periodista
      const ipfsHash = "QmJournalistProfile123";
      await truthBoardFilecoin.connect(user1).registerJournalist(ipfsHash, "Global");
    });

    it("Should allow news submission by registered journalist", async function () {
      const contentHash = "QmNewsContent123";
      const sources = ["https://source1.com", "https://source2.com"];
      const category = "Politics";

      await expect(
        truthBoardFilecoin.connect(user1).submitNews(contentHash, sources, category)
      ).to.emit(truthBoardFilecoin, "NewsSubmitted");

      const newsCount = await truthBoardFilecoin.getNewsCount();
      expect(newsCount).to.equal(1);

      const news = await truthBoardFilecoin.getNews(0);
      expect(news.contentHash).to.equal(contentHash);
      expect(news.author).to.equal(user1.address);
      expect(news.category).to.equal(category);
    });

    it("Should reject submission from non-registered journalist", async function () {
      const contentHash = "QmNewsContent123";
      const sources = ["https://source1.com"];
      const category = "Technology";

      await expect(
        truthBoardFilecoin.connect(user2).submitNews(contentHash, sources, category)
      ).to.be.revertedWith("Not a registered journalist");
    });
  });

  describe("Validation Process", function () {
    let newsId;

    beforeEach(async function () {
      // Registrar periodista y enviar noticia
      await truthBoardFilecoin.connect(user1).registerJournalist("QmJournalist1", "Global");
      await truthBoardFilecoin.connect(user2).registerJournalist("QmJournalist2", "Global");

      await truthBoardFilecoin.connect(user1).submitNews(
        "QmNewsContent123",
        ["https://source1.com"],
        "Technology"
      );
      newsId = 0;
    });

    it("Should allow validation by registered journalist", async function () {
      const isValid = true;
      const evidenceHash = "QmValidationEvidence123";

      await expect(
        truthBoardFilecoin.connect(user2).validateNews(newsId, isValid, evidenceHash)
      ).to.emit(truthBoardFilecoin, "NewsValidated");

      const validation = await truthBoardFilecoin.getValidation(newsId, 0);
      expect(validation.validator).to.equal(user2.address);
      expect(validation.isValid).to.equal(isValid);
      expect(validation.evidenceHash).to.equal(evidenceHash);
    });

    it("Should prevent self-validation", async function () {
      await expect(
        truthBoardFilecoin.connect(user1).validateNews(newsId, true, "QmEvidence")
      ).to.be.revertedWith("Cannot validate own news");
    });

    it("Should prevent duplicate validation", async function () {
      await truthBoardFilecoin.connect(user2).validateNews(newsId, true, "QmEvidence1");

      await expect(
        truthBoardFilecoin.connect(user2).validateNews(newsId, true, "QmEvidence2")
      ).to.be.revertedWith("Already validated");
    });
  });

  describe("Reputation System", function () {
    beforeEach(async function () {
      // Setup completo
      await truthBoardFilecoin.connect(user1).registerJournalist("QmJournalist1", "Global");
      await truthBoardFilecoin.connect(user2).registerJournalist("QmJournalist2", "Global");
      await truthBoardFilecoin.connect(user3).registerJournalist("QmJournalist3", "Global");

      await truthBoardFilecoin.connect(user1).submitNews("QmNews1", ["https://source1.com"], "Tech");
    });

    it("Should update reputation after validation", async function () {
      const newsId = 0;
      const initialReputation = (await truthBoardFilecoin.journalists(user1.address)).reputationScore;

      // Validaciones positivas
      await truthBoardFilecoin.connect(user2).validateNews(newsId, true, "QmEvidence1");
      await truthBoardFilecoin.connect(user3).validateNews(newsId, true, "QmEvidence2");

      await truthBoardFilecoin.connect(owner).updateReputation(user1.address, newsId);

      const finalReputation = (await truthBoardFilecoin.journalists(user1.address)).reputationScore;
      expect(finalReputation).to.be.gt(initialReputation);
    });

    it("Should decrease reputation for false news", async function () {
      const newsId = 0;
      const initialReputation = (await truthBoardFilecoin.journalists(user1.address)).reputationScore;

      // Validaciones negativas
      await truthBoardFilecoin.connect(user2).validateNews(newsId, false, "QmEvidence1");
      await truthBoardFilecoin.connect(user3).validateNews(newsId, false, "QmEvidence2");

      await truthBoardFilecoin.connect(owner).updateReputation(user1.address, newsId);

      const finalReputation = (await truthBoardFilecoin.journalists(user1.address)).reputationScore;
      expect(finalReputation).to.be.lt(initialReputation);
    });
  });

  describe("Archive Functionality", function () {
    beforeEach(async function () {
      // Setup con periodista de alta reputación
      await truthBoardFilecoin.connect(user1).registerJournalist("QmJournalist1", "Global");

      // Aumentar reputación manualmente para las pruebas
      await truthBoardFilecoin.connect(owner).updateJournalistReputation(user1.address, 80);

      await truthBoardFilecoin.connect(user1).submitNews("QmNews1", ["https://source1.com"], "Tech");
    });

    it("Should allow archiving eligible news", async function () {
      const newsId = 0;
      const dealId = 12345;

      await expect(
        truthBoardFilecoin.connect(owner).archiveNews(newsId, dealId)
      ).to.emit(truthBoardFilecoin, "NewsArchived")
        .withArgs(newsId, dealId);

      const archivedNews = await truthBoardFilecoin.archivedNews(newsId);
      expect(archivedNews.isArchived).to.be.true;
      expect(archivedNews.filecoinDealId).to.equal(dealId);
    });

    it("Should respect archive policies", async function () {
      // Crear periodista con baja reputación
      await truthBoardFilecoin.connect(user2).registerJournalist("QmJournalist2", "Global");
      await truthBoardFilecoin.connect(user2).submitNews("QmNews2", ["https://source1.com"], "Tech");

      const newsId = 1;

      await expect(
        truthBoardFilecoin.connect(owner).archiveNews(newsId, 12345)
      ).to.be.revertedWith("News does not meet archive policy requirements");
    });
  });

  describe("Community Pool", function () {
    it("Should allow funding the community pool", async function () {
      const fundingAmount = ethers.parseEther("1.0");

      await expect(
        truthBoardFilecoin.connect(user1).fundCommunityPool({ value: fundingAmount })
      ).to.emit(truthBoardFilecoin, "CommunityPoolFunded")
        .withArgs(user1.address, fundingAmount);

      const poolBalance = await truthBoardFilecoin.communityPoolBalance();
      expect(poolBalance).to.equal(fundingAmount);
    });

    it("Should allow owner to withdraw from community pool", async function () {
      // Financiar el pool primero
      const fundingAmount = ethers.parseEther("1.0");
      await truthBoardFilecoin.connect(user1).fundCommunityPool({ value: fundingAmount });

      const withdrawAmount = ethers.parseEther("0.5");
      const initialBalance = await ethers.provider.getBalance(owner.address);

      await truthBoardFilecoin.connect(owner).withdrawFromCommunityPool(withdrawAmount);

      const finalBalance = await ethers.provider.getBalance(owner.address);
      const poolBalance = await truthBoardFilecoin.communityPoolBalance();

      expect(poolBalance).to.equal(fundingAmount - withdrawAmount);
      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("Archive Policy Management", function () {
    it("Should allow owner to update archive policies", async function () {
      const contentType = 0; // NEWS_CONTENT
      const newMinReputation = 75;
      const newMinValidation = 85;
      const newStorageDuration = 365 * 24 * 60 * 60 * 3; // 3 years
      const autoArchive = true;
      const communityFunded = false;

      await expect(
        truthBoardFilecoin.connect(owner).updateArchivePolicy(
          contentType,
          newMinReputation,
          newMinValidation,
          newStorageDuration,
          autoArchive,
          communityFunded
        )
      ).to.emit(truthBoardFilecoin, "ArchivePolicyUpdated");

      const policy = await truthBoardFilecoin.archivePolicies(contentType);
      expect(policy.minReputationScore).to.equal(newMinReputation);
      expect(policy.minValidationScore).to.equal(newMinValidation);
      expect(policy.storageDuration).to.equal(newStorageDuration);
      expect(policy.autoArchive).to.equal(autoArchive);
      expect(policy.communityFunded).to.equal(communityFunded);
    });

    it("Should reject policy updates from non-owner", async function () {
      await expect(
        truthBoardFilecoin.connect(user1).updateArchivePolicy(0, 75, 85, 123456, true, false)
      ).to.be.revertedWithCustomError(truthBoardFilecoin, "OwnableUnauthorizedAccount");
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to pause the contract", async function () {
      await truthBoardFilecoin.connect(owner).pause();
      expect(await truthBoardFilecoin.paused()).to.be.true;
    });

    it("Should prevent operations when paused", async function () {
      await truthBoardFilecoin.connect(owner).pause();

      await expect(
        truthBoardFilecoin.connect(user1).registerJournalist("QmTest", "Global")
      ).to.be.revertedWithCustomError(truthBoardFilecoin, "EnforcedPause");
    });

    it("Should allow emergency withdrawal by owner", async function () {
      // Financiar el contrato primero
      await truthBoardFilecoin.connect(user1).fundCommunityPool({ value: ethers.parseEther("1.0") });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await truthBoardFilecoin.connect(owner).emergencyWithdraw();
      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("Integration Tests", function () {
    it("Should handle complete news lifecycle", async function () {
      // 1. Registrar periodistas
      await truthBoardFilecoin.connect(user1).registerJournalist("QmJournalist1", "Global");
      await truthBoardFilecoin.connect(user2).registerJournalist("QmJournalist2", "Global");
      await truthBoardFilecoin.connect(user3).registerJournalist("QmJournalist3", "Global");

      // 2. Enviar noticia
      await truthBoardFilecoin.connect(user1).submitNews(
        "QmNewsContent123",
        ["https://source1.com", "https://source2.com"],
        "Technology"
      );

      // 3. Validar noticia
      await truthBoardFilecoin.connect(user2).validateNews(0, true, "QmEvidence1");
      await truthBoardFilecoin.connect(user3).validateNews(0, true, "QmEvidence2");

      // 4. Actualizar reputación
      await truthBoardFilecoin.connect(owner).updateReputation(user1.address, 0);

      // 5. Verificar que todo funcionó
      const news = await truthBoardFilecoin.getNews(0);
      const journalist = await truthBoardFilecoin.journalists(user1.address);

      expect(news.validationCount).to.equal(2);
      expect(journalist.reputationScore).to.be.gt(50); // Reputación inicial
    });
  });
});
