const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RewardDistribution", function () {
  let UserManager, userManager, QuestManager, questManager, RewardDistribution, rewardDistribution, MockERC20, mockERC20;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy MockERC20 contract
    MockERC20 = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20.deploy();
    await mockERC20.waitForDeployment();

    // Deploy QuestManager contract
    QuestManager = await ethers.getContractFactory("QuestManager");
    questManager = await QuestManager.deploy();
    await questManager.waitForDeployment();

    // Deploy UserManager contract with QuestManager address
    UserManager = await ethers.getContractFactory("UserManager");
    userManager = await UserManager.deploy(await questManager.getAddress());
    await userManager.waitForDeployment();

    // Deploy RewardDistribution contract with UserManager and QuestManager addresses
    RewardDistribution = await ethers.getContractFactory("RewardDistribution");
    rewardDistribution = await RewardDistribution.deploy(await userManager.getAddress(), await questManager.getAddress());
    await rewardDistribution.waitForDeployment();

    // Transfer some tokens to the RewardDistribution contract for rewards
    const transferAmount = "1000000000000000000000"; // 1000 MKT in wei
    await mockERC20.transfer(await rewardDistribution.getAddress(), transferAmount);
  });

  describe("Admin functions", function () {
    it("Should allow admin to set a reward", async function () {
      const rewardAmount = "100000000000000000000"; // 100 MKT in wei
      await rewardDistribution.setReward(1, "token", await mockERC20.getAddress(), 0, rewardAmount);
      const reward = await rewardDistribution.rewards(1);
      expect(reward.rewardType).to.equal("token");
      expect(reward.rewardAddress).to.equal(await mockERC20.getAddress());
      expect(reward.rewardAmount.toString()).to.equal(rewardAmount);
    });

    it("Should not allow non-admin to set a reward", async function () {
      const rewardAmount = "100000000000000000000"; // 100 MKT in wei
      await expect(
        rewardDistribution.connect(addr1).setReward(1, "token", await mockERC20.getAddress(), 0, rewardAmount)
      ).to.be.revertedWith("Only admin can perform this action");
    });
  });

  describe("Reward distribution", function () {
    beforeEach(async function () {
      // Register user and create quest
      await userManager.registerUser(addr1.address);
      await questManager.createQuest(1, Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000) + 86400, 3, "token");
      const rewardAmount = "100000000000000000000"; // 100 MKT in wei
      await rewardDistribution.setReward(1, "token", await mockERC20.getAddress(), 0, rewardAmount);
    });

    it("Should distribute reward to user", async function () {
      const rewardAmount = "100000000000000000000"; // 100 MKT in wei

      // Initially, addr1 has no tokens
      const initialBalance = await mockERC20.balanceOf(addr1.address);

      // Distribute reward
      await rewardDistribution.distributeReward(1, addr1.address);

      // Check reward distribution status
      const isDistributed = await rewardDistribution.isRewardDistributed(1, addr1.address);
      expect(isDistributed).to.be.true;

      // Check user's token balance
      const finalBalance = await mockERC20.balanceOf(addr1.address);
      const expectedFinalBalance = BigInt(initialBalance) + BigInt(rewardAmount);
      expect(finalBalance.toString()).to.equal(expectedFinalBalance.toString());
    });

    it("Should not distribute reward more than once", async function () {
      await rewardDistribution.distributeReward(1, addr1.address);
      await expect(rewardDistribution.distributeReward(1, addr1.address)).to.be.revertedWith("Reward already distributed");
    });

    it("Should not distribute reward to unregistered user", async function () {
      await expect(rewardDistribution.distributeReward(1, addr2.address)).to.be.revertedWith("User not registered");
    });
  });
});

