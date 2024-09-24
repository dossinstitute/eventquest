import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory, Contract, Signer } from "ethers";
import Web3 from "web3";

const web3 = new Web3();

describe("QuestManager", function () {
  let QuestManager: ContractFactory;
  let questManager: Contract;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    QuestManager = await ethers.getContractFactory("QuestManager");
    [owner, addr1, addr2] = await ethers.getSigners();
    questManager = await QuestManager.deploy();
    await questManager.waitForDeployment();
  });

  describe("Register Quest", function () {
    it("Should register a new quest", async function () {
      await questManager.connect(owner).registerQuest(1, "Quest 1", await addr1.getAddress(), "Type A");

      const quest = await questManager.getQuest(1);
      expect(quest.name).to.equal("Quest 1");
      expect(quest.questAddress).to.equal(await addr1.getAddress());
      expect(quest.questType).to.equal("Type A");
    });

    it("Should emit QuestRegistered event", async function () {
      await expect(questManager.connect(owner).registerQuest(1, "Quest 1", await addr1.getAddress(), "Type A"))
        .to.emit(questManager, "QuestRegistered")
        .withArgs(1, "Quest 1", await addr1.getAddress(), "Type A");
    });

    it("Should not register a quest with an existing ID", async function () {
      await questManager.connect(owner).registerQuest(1, "Quest 1", await addr1.getAddress(), "Type A");
      await expect(questManager.connect(owner).registerQuest(1, "Quest 2", await addr2.getAddress(), "Type B"))
        .to.be.revertedWith("Quest ID already exists.");
    });
  });

  describe("Get Quest", function () {
    it("Should return the correct quest details", async function () {
      await questManager.connect(owner).registerQuest(1, "Quest 1", await addr1.getAddress(), "Type A");
      const quest = await questManager.getQuest(1);

      expect(quest.name).to.equal("Quest 1");
      expect(quest.questAddress).to.equal(await addr1.getAddress());
      expect(quest.questType).to.equal("Type A");
    });

    it("Should revert for non-existing quest ID", async function () {
      await expect(questManager.getQuest(1)).to.be.revertedWith("Quest ID does not exist.");
    });
  });

  describe("Get All Quest IDs", function () {
    it("Should return all registered quest IDs", async function () {
      await questManager.connect(owner).registerQuest(1, "Quest 1", await addr1.getAddress(), "Type A");
      await questManager.connect(owner).registerQuest(2, "Quest 2", await addr2.getAddress(), "Type B");

      const questIds = await questManager.getAllQuestIds();
      expect(questIds.length).to.equal(2);
      expect(questIds[0]).to.equal(1);
      expect(questIds[1]).to.equal(2);
    });
  });
});

