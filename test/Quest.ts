const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3 = require("web3");

describe("Quest", function () {
  let questManager;
  let concreteQuest;
  let deployer, user1, user2;
  const web3 = new Web3();

  beforeEach(async function () {
    [deployer, user1, user2] = await ethers.getSigners();

    const QuestManager = await ethers.getContractFactory("QuestManager");
    questManager = await QuestManager.deploy();
    await questManager.waitForDeployment();

    const ConcreteQuest = await ethers.getContractFactory("ConcreteQuest");
    concreteQuest = await ConcreteQuest.deploy(
      questManager.target,
      "Test Quest",
      "Test Type"
    );
    await concreteQuest.waitForDeployment();
  });

  async function getCurrentBlockTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }

  it("Should initialize a new quest", async function () {
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future
    const questTypeId = 1;
    const data = "0x"; // Correcting to a valid empty bytes value

    await concreteQuest.initializeQuest(1, questTypeId, data, expirationTime);

    const quest = await concreteQuest.quests(1);
    expect(quest.isActive).to.be.true;
    expect(quest.isCompleted).to.be.false;
    expect(quest.expirationTime).to.equal(expirationTime);

    const activeQuests = await concreteQuest.listActiveQuests();
    expect(activeQuests[0].questId).to.equal(1);
  });

  it("Should return active quests", async function () {
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future
    const data = "0x"; // Correcting to a valid empty bytes value

    await concreteQuest.initializeQuest(1, 1, data, expirationTime);
    await concreteQuest.initializeQuest(2, 1, data, expirationTime + 86400);

    const activeQuests = await concreteQuest.listActiveQuests();
    expect(activeQuests.length).to.equal(2);
    expect(activeQuests[0].questId).to.equal(1);
    expect(activeQuests[1].questId).to.equal(2);
  });

  it("Should not include completed quests", async function () {
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future
    const data = "0x"; // Correcting to a valid empty bytes value

    await concreteQuest.initializeQuest(1, 1, data, expirationTime);
    await concreteQuest.initializeQuest(2, 1, data, expirationTime + 86400);
    await concreteQuest.initializeQuest(3, 1, data, expirationTime + 172800); // Adding a third quest

    // Verify quests before completion
    let activeQuests = await concreteQuest.listActiveQuests();
    console.log("Active quests before completion: ", activeQuests);

    // Simulate completion of the first quest
    await concreteQuest.interact(1, user1.address, "completion", data);

    // Verify quests after completion
    activeQuests = await concreteQuest.listActiveQuests();
    console.log("Active quests after completion: ", activeQuests);

    // Convert Result object to regular array
    activeQuests = Array.from(activeQuests).sort((a, b) => Number(a.questId) - Number(b.questId));

    expect(activeQuests.length).to.equal(2);
    expect(activeQuests[0].questId).to.equal(2);
    expect(activeQuests[1].questId).to.equal(3);
  });
});

