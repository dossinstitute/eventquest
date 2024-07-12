import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory, Contract, Signer } from "ethers";
import Web3 from "web3";

const web3 = new Web3();

describe("Quest", function () {
  let QuestManager: ContractFactory;
  let ConcreteQuest: ContractFactory;
  let questManager: Contract;
  let concreteQuest: Contract;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    QuestManager = await ethers.getContractFactory("QuestManager");
    [owner, addr1, addr2] = await ethers.getSigners();
    questManager = await QuestManager.deploy();
    await questManager.waitForDeployment();

    ConcreteQuest = await ethers.getContractFactory("ConcreteQuest");
    concreteQuest = await ConcreteQuest.deploy(questManager.target, "Test Quest", "TestType");
    await concreteQuest.waitForDeployment();
  });

  describe("Initialize Quest", function () {
    it("Should initialize a new quest", async function () {
      const initialData = web3.utils.asciiToHex("Initial Data");
      await concreteQuest.connect(owner).initializeQuest(1, initialData, 1234567890);

      const quest = await concreteQuest.quests(1);
      expect(quest.data).to.equal(initialData);
      expect(quest.isActive).to.be.true;
      expect(quest.isCompleted).to.be.false;
      expect(quest.initiator).to.equal(await owner.getAddress());
      expect(quest.expirationTime).to.equal(1234567890);
      expect(quest.questContract).to.equal(concreteQuest.target);

      const [ids, contracts] = await concreteQuest.getActiveQuests();
      expect(ids).to.deep.equal([1]);
      expect(contracts).to.deep.equal([concreteQuest.target]);
    });

    it("Should emit QuestInitialized event", async function () {
      await expect(concreteQuest.connect(owner).initializeQuest(1, web3.utils.asciiToHex("Initial Data"), 1234567890))
        .to.emit(concreteQuest, "QuestInitialized")
        .withArgs(1, await owner.getAddress());
    });

    it("Should register with QuestManager", async function () {
      await concreteQuest.connect(owner).initializeQuest(1, web3.utils.asciiToHex("Initial Data"), 1234567890);

      const quest = await questManager.getQuest(1);
      expect(quest.name).to.equal("Test Quest");
      expect(quest.questAddress).to.equal(concreteQuest.target);
      expect(quest.questType).to.equal("TestType");
    });

    it("Should not initialize a quest with an existing ID", async function () {
      await concreteQuest.connect(owner).initializeQuest(1, web3.utils.asciiToHex("Initial Data"), 1234567890);
      await expect(concreteQuest.connect(owner).initializeQuest(1, web3.utils.asciiToHex("New Data"), 1234567891))
        .to.be.revertedWith("Quest ID already used.");
    });
  });

  describe("Interact with Quest", function () {
    beforeEach(async function () {
      await concreteQuest.connect(owner).initializeQuest(1, web3.utils.asciiToHex("Initial Data"), 1234567890);
    });

    it("Should allow interaction with an active quest", async function () {
      await concreteQuest.connect(addr1).interact(1, await addr1.getAddress(), "Test Interaction", web3.utils.asciiToHex("Target Data"));

      await expect(concreteQuest.connect(addr1).interact(1, await addr1.getAddress(), "Test Interaction", web3.utils.asciiToHex("Target Data")))
        .to.emit(concreteQuest, "InteractionCompleted")
        .withArgs(1, await addr1.getAddress(), "Test Interaction", web3.utils.asciiToHex("Target Data"));
    });

    it("Should not allow interaction with an inactive quest", async function () {
      await concreteQuest.connect(owner).markQuestAsCompleted(1);
      await expect(concreteQuest.connect(addr1).interact(1, await addr1.getAddress(), "Test Interaction", web3.utils.asciiToHex("Target Data")))
        .to.be.revertedWith("Quest is not active.");
    });
  });

  describe("Complete Quest", function () {
    beforeEach(async function () {
      await concreteQuest.connect(owner).initializeQuest(1, web3.utils.asciiToHex("Initial Data"), 1234567890);
    });

    it("Should mark a quest as completed", async function () {
      // Ensure quest is active before completion
      const [isActiveBefore, isCompletedBefore] = await concreteQuest.getQuestState(1);
      expect(isActiveBefore).to.be.true;
      expect(isCompletedBefore).to.be.false;

      // Complete the quest
      await expect(concreteQuest.connect(owner).markQuestAsCompleted(1))
        .to.emit(concreteQuest, "InteractionCompleted")
        .withArgs(1, "0x0000000000000000000000000000000000000000", "completion", "0x");

      // Ensure quest is inactive and completed after completion
      const [isActiveAfter, isCompletedAfter] = await concreteQuest.getQuestState(1);
      expect(isActiveAfter).to.be.false;
      expect(isCompletedAfter).to.be.true;
    });

    it("Should not mark a non-active quest as completed", async function () {
      await concreteQuest.connect(owner).markQuestAsCompleted(1);
      await expect(concreteQuest.connect(owner).markQuestAsCompleted(1))
        .to.be.revertedWith("Quest is not active.");
    });
  });

  describe("Get Active Quests", function () {
    beforeEach(async function () {
      await concreteQuest.connect(owner).initializeQuest(1, web3.utils.asciiToHex("Initial Data"), 1234567890);
      await concreteQuest.connect(owner).initializeQuest(2, web3.utils.asciiToHex("Second Quest"), 1234567891);
    });

    it("Should return active quests", async function () {
      const [ids, contracts] = await concreteQuest.getActiveQuests();

      expect(ids.length).to.equal(2);
      expect(ids[0]).to.equal(1);
      expect(ids[1]).to.equal(2);
      expect(contracts[0]).to.equal(concreteQuest.target);
      expect(contracts[1]).to.equal(concreteQuest.target);
    });

    it("Should not include completed quests", async function () {
      await concreteQuest.connect(owner).markQuestAsCompleted(1);

      const [ids, contracts] = await concreteQuest.getActiveQuests();

      expect(ids.length).to.equal(1);
      expect(ids[0]).to.equal(2);
      expect(contracts[0]).to.equal(concreteQuest.target);
    });
  });
});

