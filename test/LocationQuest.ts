const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3 = require("web3");

describe("LocationQuest", function () {
  let locationQuest;
  let questManager;
  let deployer, user1, user2;
  const web3 = new Web3();

  beforeEach(async function () {
    [deployer, user1, user2] = await ethers.getSigners();

    const QuestManager = await ethers.getContractFactory("QuestManager");
    questManager = await QuestManager.deploy();
    await questManager.waitForDeployment();

    const LocationQuest = await ethers.getContractFactory("LocationQuest");
    locationQuest = await LocationQuest.deploy(
      questManager.target,
      "Location Quest",
      "Location Type"
    );
    await locationQuest.waitForDeployment();
  });

  it("Should initialize a new Location quest", async function () {
    const locations = ["Location1", "Location2"];
    await locationQuest.initializeLocationQuest(1, locations, Math.floor(Date.now() / 1000) + 86400); // 1 day in the future

    const quest = await locationQuest.quests(1);
    expect(quest.isActive).to.be.true;
    expect(quest.isCompleted).to.be.false;
    expect(quest.expirationTime).to.be.above(Math.floor(Date.now() / 1000));

    const requiredLocs = await locationQuest.getRequiredLocations(1);
    expect(requiredLocs).to.deep.equal(locations);
  });

  it("Should allow interaction with a location", async function () {
    const locations = ["Location1", "Location2"];
    await locationQuest.initializeLocationQuest(1, locations, Math.floor(Date.now() / 1000) + 86400); // 1 day in the future

    const locationData = web3.eth.abi.encodeParameter("string", "Location1");
    await expect(locationQuest.interact(1, user1.address, "visit", locationData))
      .to.emit(locationQuest, "LocationInteracted")
      .withArgs(1, user1.address, "Location1");

    const interactionState = await locationQuest.interactedLocations(1, "Location1");
    expect(interactionState).to.be.true;
  });

  it("Should not allow interaction with the same location twice", async function () {
    const locations = ["Location1", "Location2"];
    await locationQuest.initializeLocationQuest(1, locations, Math.floor(Date.now() / 1000) + 86400); // 1 day in the future

    const locationData = web3.eth.abi.encodeParameter("string", "Location1");
    await locationQuest.interact(1, user1.address, "visit", locationData);

    await expect(locationQuest.interact(1, user1.address, "visit", locationData))
      .to.be.revertedWith("Location already interacted with.");
  });

  it("Should mark a quest as completed when all locations are interacted with", async function () {
    const locations = ["Location1", "Location2"];
    await locationQuest.initializeLocationQuest(1, locations, Math.floor(Date.now() / 1000) + 86400); // 1 day in the future

    const location1Data = web3.eth.abi.encodeParameter("string", "Location1");
    const location2Data = web3.eth.abi.encodeParameter("string", "Location2");

    await locationQuest.interact(1, user1.address, "visit", location1Data);
    await expect(locationQuest.interact(1, user1.address, "visit", location2Data))
      .to.emit(locationQuest, "LocationInteracted")
      .withArgs(1, user1.address, "Location2");

    const quest = await locationQuest.quests(1);
    expect(quest.isCompleted).to.be.true;
    expect(quest.isActive).to.be.false;
  });
});

