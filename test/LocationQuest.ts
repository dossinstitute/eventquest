import { ethers } from "hardhat";
import { expect } from "chai";
import Web3 from "web3";

describe("LocationQuest", function () {
  let locationQuest: any;
  let questManager: any;
  let deployer: any, user1: any;
  const web3 = new Web3();

  beforeEach(async function () {
    [deployer, user1] = await ethers.getSigners();

    const QuestManager = await ethers.getContractFactory("QuestManager");
    questManager = await QuestManager.deploy();
    await questManager.waitForDeployment();

    const LocationQuest = await ethers.getContractFactory("LocationQuest");
    locationQuest = await LocationQuest.deploy(await questManager.getAddress(), "Location Quest", "Location Type");
    await locationQuest.waitForDeployment();
  });

  async function getCurrentBlockTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }

  it("Should initialize a new Location quest", async function () {
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future
    const locations = ["Location1", "Location2"];

    await locationQuest.initializeLocationQuest(
      1,
      1, // questTypeId
      locations,
      expirationTime
    );

    const quest = await locationQuest.quests(1);
    console.log("Quest initialized:", quest);
    expect(quest.isActive).to.be.true;
    expect(quest.isCompleted).to.be.false;
    expect(quest.expirationTime).to.equal(expirationTime);
  });

  it("Should interact with a location", async function () {
    const questId = 1;
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future
    const locations = ["Location1", "Location2"];

    await locationQuest.initializeLocationQuest(
      questId,
      1, // questTypeId
      locations,
      expirationTime
    );

    const location = "Location1";
    const locationData = web3.eth.abi.encodeParameter("string", location);
    await locationQuest.connect(user1).interact(questId, user1.address, "visit", locationData);

    const interactedLocations = await locationQuest.getRequiredLocations(questId);
    console.log("Interacted Locations:", interactedLocations);
    expect(interactedLocations).to.include(location);
  });

  it("Should mark a quest as completed when all locations are visited", async function () {
    const questId = 1;
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future
    const locations = ["Location1", "Location2"];

    await locationQuest.initializeLocationQuest(
      questId,
      1, // questTypeId
      locations,
      expirationTime
    );

    const locationData1 = web3.eth.abi.encodeParameter("string", "Location1");
    const locationData2 = web3.eth.abi.encodeParameter("string", "Location2");

    await locationQuest.connect(user1).interact(questId, user1.address, "visit", locationData1);
    await locationQuest.connect(user1).interact(questId, user1.address, "visit", locationData2);

    const quest = await locationQuest.quests(questId);
    expect(quest.isCompleted).to.be.true;
    expect(quest.isActive).to.be.false;
  });
});

