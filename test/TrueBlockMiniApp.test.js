const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrueBlock Mini-App", function () {
  let TrueBlockMiniApp;
  let trueBlockMiniApp;
  let owner;
  let user1;
  let user2;
  let user3;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2, user3] = await ethers.getSigners();

    // Deploy contract
    TrueBlockMiniApp = await ethers.getContractFactory("TrueBlockMiniApp");
    trueBlockMiniApp = await TrueBlockMiniApp.deploy();
    await trueBlockMiniApp.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await trueBlockMiniApp.getAddress()).to.not.equal(ethers.ZeroAddress);
    });

    it("Should set the right owner", async function () {
      expect(await trueBlockMiniApp.owner()).to.equal(owner.address);
    });
  });

  describe("Truth Check Submission", function () {
    it("Should allow users to submit truth checks", async function () {
      const content = "This is a test truth check";
      const category = "news";

      await expect(
        trueBlockMiniApp.connect(user1).submitTruthCheck(content, category)
      ).to.emit(trueBlockMiniApp, "TruthCheckSubmitted");

      // Check if stats updated
      const stats = await trueBlockMiniApp.getMiniAppStats();
      expect(stats[0]).to.equal(1); // totalChecks
      expect(stats[2]).to.equal(1); // totalUsers
    });

    it("Should not allow empty content", async function () {
      await expect(
        trueBlockMiniApp.connect(user1).submitTruthCheck("", "news")
      ).to.be.revertedWith("Content cannot be empty");
    });

    it("Should not allow empty category", async function () {
      await expect(
        trueBlockMiniApp.connect(user1).submitTruthCheck("Content", "")
      ).to.be.revertedWith("Category cannot be empty");
    });
  });

  describe("Voting", function () {
    let checkId;

    beforeEach(async function () {
      // Submit a truth check first
      const content = "Test content for voting";
      const category = "fact";
      
      const tx = await trueBlockMiniApp.connect(user1).submitTruthCheck(content, category);
      const receipt = await tx.wait();
      
      // Get the check ID from the event
      const event = receipt.logs.find(log => log.eventName === "TruthCheckSubmitted");
      checkId = event.args.checkId;
    });

    it("Should allow users to vote on truth checks", async function () {
      const truthScore = 85;

      await expect(
        trueBlockMiniApp.connect(user2).voteOnTruthCheck(checkId, truthScore)
      ).to.emit(trueBlockMiniApp, "TruthCheckVoted");

      // Check if vote was recorded
      const checkDetails = await trueBlockMiniApp.getCheckDetails(checkId);
      expect(checkDetails[3]).to.equal(1); // totalVotes
      expect(checkDetails[2]).to.equal(85); // truthScore
    });

    it("Should not allow voting on non-existent checks", async function () {
      const fakeCheckId = ethers.keccak256(ethers.toUtf8Bytes("fake"));
      
      await expect(
        trueBlockMiniApp.connect(user2).voteOnTruthCheck(fakeCheckId, 50)
      ).to.be.revertedWith("Check does not exist");
    });

    it("Should not allow voting twice on the same check", async function () {
      await trueBlockMiniApp.connect(user2).voteOnTruthCheck(checkId, 85);
      
      await expect(
        trueBlockMiniApp.connect(user2).voteOnTruthCheck(checkId, 90)
      ).to.be.revertedWith("Already voted");
    });

    it("Should not allow invalid scores", async function () {
      await expect(
        trueBlockMiniApp.connect(user2).voteOnTruthCheck(checkId, 101)
      ).to.be.revertedWith("Score must be 0-100");
    });
  });

  describe("Verification", function () {
    let checkId;

    beforeEach(async function () {
      // Submit a truth check
      const content = "Test content for verification";
      const category = "quote";
      
      const tx = await trueBlockMiniApp.connect(user1).submitTruthCheck(content, category);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(log => log.eventName === "TruthCheckSubmitted");
      checkId = event.args.checkId;
    });

    it("Should verify check after minimum votes", async function () {
      // Vote with 5 different users (minimum required)
      const users = [user2, user3, owner, user1];
      const scores = [80, 75, 85, 90];

      for (let i = 0; i < users.length; i++) {
        await trueBlockMiniApp.connect(users[i]).voteOnTruthCheck(checkId, scores[i]);
      }

      // Add one more vote to reach minimum
      await trueBlockMiniApp.connect(ethers.Wallet.createRandom()).voteOnTruthCheck(checkId, 88);

      // Check if verified
      const checkDetails = await trueBlockMiniApp.getCheckDetails(checkId);
      expect(checkDetails[4]).to.be.true; // isVerified
    });

    it("Should emit verification event", async function () {
      // Add 5 votes
      const users = [user2, user3, owner, user1, ethers.Wallet.createRandom()];
      const scores = [80, 75, 85, 90, 88];

      for (let i = 0; i < users.length; i++) {
        await trueBlockMiniApp.connect(users[i]).voteOnTruthCheck(checkId, scores[i]);
      }

      // Check if verification event was emitted
      const stats = await trueBlockMiniApp.getMiniAppStats();
      expect(stats[1]).to.equal(1); // verifiedChecks
    });
  });

  describe("User Profiles", function () {
    it("Should create user profile on first submission", async function () {
      const content = "First submission";
      const category = "news";

      await trueBlockMiniApp.connect(user1).submitTruthCheck(content, category);

      const profile = await trueBlockMiniApp.getUserProfile(user1.address);
      expect(profile[0]).to.equal(50); // reputation (starting value)
      expect(profile[1]).to.equal(1); // totalChecks
      expect(profile[3]).to.be.true; // isActive
    });

    it("Should update user profile on subsequent submissions", async function () {
      // First submission
      await trueBlockMiniApp.connect(user1).submitTruthCheck("First", "news");
      
      // Second submission
      await trueBlockMiniApp.connect(user1).submitTruthCheck("Second", "fact");

      const profile = await trueBlockMiniApp.getUserProfile(user1.address);
      expect(profile[1]).to.equal(2); // totalChecks
    });
  });

  describe("Statistics", function () {
    it("Should return correct statistics", async function () {
      // Submit multiple checks
      await trueBlockMiniApp.connect(user1).submitTruthCheck("Check 1", "news");
      await trueBlockMiniApp.connect(user2).submitTruthCheck("Check 2", "fact");
      await trueBlockMiniApp.connect(user3).submitTruthCheck("Check 3", "meme");

      const stats = await trueBlockMiniApp.getMiniAppStats();
      expect(stats[0]).to.equal(3); // totalChecks
      expect(stats[2]).to.equal(3); // totalUsers
      expect(stats[3]).to.equal(0); // totalVotes (no votes yet)
    });
  });

  describe("Recent Checks", function () {
    it("Should return recent checks", async function () {
      // Submit multiple checks
      await trueBlockMiniApp.connect(user1).submitTruthCheck("Check 1", "news");
      await trueBlockMiniApp.connect(user2).submitTruthCheck("Check 2", "fact");
      await trueBlockMiniApp.connect(user3).submitTruthCheck("Check 3", "meme");

      const recentChecks = await trueBlockMiniApp.getRecentChecks(2);
      expect(recentChecks.length).to.equal(2);
    });

    it("Should handle limit correctly", async function () {
      // Submit 5 checks
      for (let i = 1; i <= 5; i++) {
        await trueBlockMiniApp.connect(user1).submitTruthCheck(`Check ${i}`, "news");
      }

      const recentChecks = await trueBlockMiniApp.getRecentChecks(3);
      expect(recentChecks.length).to.equal(3);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple users voting on same check", async function () {
      const content = "Edge case test";
      const category = "fact";
      
      const tx = await trueBlockMiniApp.connect(user1).submitTruthCheck(content, category);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(log => log.eventName === "TruthCheckSubmitted");
      const checkId = event.args.checkId;

      // Multiple users vote
      await trueBlockMiniApp.connect(user2).voteOnTruthCheck(checkId, 50);
      await trueBlockMiniApp.connect(user3).voteOnTruthCheck(checkId, 75);
      await trueBlockMiniApp.connect(owner).voteOnTruthCheck(checkId, 80);

      const checkDetails = await trueBlockMiniApp.getCheckDetails(checkId);
      expect(checkDetails[2]).to.equal(68); // Average score: (50+75+80)/3 = 68.33... = 68
      expect(checkDetails[3]).to.equal(3); // totalVotes
    });
  });
});
