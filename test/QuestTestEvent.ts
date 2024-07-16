const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("QuestTypeEvents Contract", function () {
  let QuestTypeEvents;
  let questTypeEvents;
  let owner;

  before(async function () {
    [owner] = await ethers.getSigners();
  });

  beforeEach(async function () {
    // Deploy a new contract before each test
    QuestTypeEvents = await ethers.getContractFactory("QuestTypeEvents");
    questTypeEvents = await QuestTypeEvents.deploy();
    await questTypeEvents.waitForDeployment();

    // Create initial quest type events for consistent testing
    await questTypeEvents.createQuestTypeEvent(
      1,
      1,
      1000,
      "Test Quest Event 1",
      "Description for test quest event 1",
      10,
      1622505600, // Start date in Unix timestamp (June 1, 2021)
      1625097600 // End date in Unix timestamp (July 1, 2021)
    );

    await questTypeEvents.createQuestTypeEvent(
      2,
      2,
      2000,
      "Test Quest Event 2",
      "Description for test quest event 2",
      20,
      1622505600, // Start date in Unix timestamp (June 1, 2021)
      1625097600 // End date in Unix timestamp (July 1, 2021)
    );
  });

  it("should create a new quest type event", async function () {
    const tx = await questTypeEvents.createQuestTypeEvent(
      3,
      3,
      3000,
      "Test Quest Event 3",
      "Description for test quest event 3",
      30,
      1622505600, // Start date in Unix timestamp (June 1, 2021)
      1625097600 // End date in Unix timestamp (July 1, 2021)
    );
    await tx.wait();

    const questTypeEvent = await questTypeEvents.readQuestTypeEvent(3); // Third quest type event created
    expect(questTypeEvent.eventId).to.equal(3);
    expect(questTypeEvent.questTypeId).to.equal(3);
    expect(questTypeEvent.reward).to.equal(3000);
    expect(questTypeEvent.name).to.equal("Test Quest Event 3");
    expect(questTypeEvent.description).to.equal("Description for test quest event 3");
    expect(questTypeEvent.requiredInteractions).to.equal(30);
    expect(questTypeEvent.questEventStartDate).to.equal(1622505600);
    expect(questTypeEvent.questEventEndDate).to.equal(1625097600);
  });

  it("should read a quest type event", async function () {
    const questTypeEvent = await questTypeEvents.readQuestTypeEvent(1);
    expect(questTypeEvent.eventId).to.equal(1);
    expect(questTypeEvent.questTypeId).to.equal(1);
    expect(questTypeEvent.reward).to.equal(1000);
    expect(questTypeEvent.name).to.equal("Test Quest Event 1");
    expect(questTypeEvent.description).to.equal("Description for test quest event 1");
    expect(questTypeEvent.requiredInteractions).to.equal(10);
    expect(questTypeEvent.questEventStartDate).to.equal(1622505600);
    expect(questTypeEvent.questEventEndDate).to.equal(1625097600);
  });

  it("should update a quest type event", async function () {
    const tx = await questTypeEvents.updateQuestTypeEvent(
      1,
      1,
      1,
      1500,
      "Updated Quest Event 1",
      "Updated description for test quest event 1",
      15,
      1622505600, // Start date in Unix timestamp (June 1, 2021)
      1625097600 // End date in Unix timestamp (July 1, 2021)
    );
    await tx.wait();

    const questTypeEvent = await questTypeEvents.readQuestTypeEvent(1);
    expect(questTypeEvent.eventId).to.equal(1);
    expect(questTypeEvent.questTypeId).to.equal(1);
    expect(questTypeEvent.reward).to.equal(1500);
    expect(questTypeEvent.name).to.equal("Updated Quest Event 1");
    expect(questTypeEvent.description).to.equal("Updated description for test quest event 1");
    expect(questTypeEvent.requiredInteractions).to.equal(15);
    expect(questTypeEvent.questEventStartDate).to.equal(1622505600);
    expect(questTypeEvent.questEventEndDate).to.equal(1625097600);
  });

  it("should delete a quest type event", async function () {
    const tx = await questTypeEvents.deleteQuestTypeEvent(1);
    await tx.wait();

    await expect(questTypeEvents.readQuestTypeEvent(1)).to.be.revertedWith("QuestTypeEvent does not exist");
  });

  it("should list quest type events", async function () {
    const questTypeEventList = await questTypeEvents.listQuestTypeEvents();
    expect(questTypeEventList.length).to.equal(2);
    expect(questTypeEventList[0].name).to.equal("Test Quest Event 1");
    expect(questTypeEventList[1].name).to.equal("Test Quest Event 2");
  });

  it("should get quest type event count", async function () {
    const count = await questTypeEvents.getQuestTypeEventCount();
    expect(count).to.equal(2);
  });

  it("should get a quest type event by index", async function () {
    const questTypeEvent = await questTypeEvents.getQuestTypeEventByIndex(1);
    expect(questTypeEvent.name).to.equal("Test Quest Event 1");
  });
});

