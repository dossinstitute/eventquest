const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("QuestTypes Contract", function () {
  let QuestTypes;
  let questTypes;
  let owner;

  before(async function () {
    [owner] = await ethers.getSigners();
  });

  beforeEach(async function () {
    // Deploy a new contract before each test
    QuestTypes = await ethers.getContractFactory("QuestTypes");
    questTypes = await QuestTypes.deploy();
    await questTypes.waitForDeployment();

    // Create initial quest types for consistent testing
    await questTypes.createQuestType(
      "Test Quest 1",
      "This is a test quest 1",
      "TestScreen1",
      "TestContract1",
      owner.address,
      "SponsorReqContract1",
      owner.address
    );

    await questTypes.createQuestType(
      "Test Quest 2",
      "This is a test quest 2",
      "TestScreen2",
      "TestContract2",
      owner.address,
      "SponsorReqContract2",
      owner.address
    );
  });

  it("should create a new quest type", async function () {
    const tx = await questTypes.createQuestType(
      "Test Quest",
      "This is a test quest",
      "TestScreen",
      "TestContract",
      owner.address,
      "SponsorReqContract",
      owner.address
    );
    await tx.wait();

    const questType = await questTypes.readQuestType(3); // Third quest type created
    expect(questType.name).to.equal("Test Quest");
    expect(questType.description).to.equal("This is a test quest");
    expect(questType.screenName).to.equal("TestScreen");
    expect(questType.questContractName).to.equal("TestContract");
    expect(questType.questContractAddress).to.equal(owner.address);
    expect(questType.sponsorRequirementsContractName).to.equal("SponsorReqContract");
    expect(questType.sponsorRequirementsAddress).to.equal(owner.address);
  });

  it("should read a quest type", async function () {
    const questType = await questTypes.readQuestType(1);
    expect(questType.name).to.equal("Test Quest 1");
    expect(questType.description).to.equal("This is a test quest 1");
    expect(questType.screenName).to.equal("TestScreen1");
    expect(questType.questContractName).to.equal("TestContract1");
    expect(questType.questContractAddress).to.equal(owner.address);
    expect(questType.sponsorRequirementsContractName).to.equal("SponsorReqContract1");
    expect(questType.sponsorRequirementsAddress).to.equal(owner.address);
  });

  it("should update a quest type", async function () {
    const tx = await questTypes.updateQuestType(
      1,
      "Updated Quest",
      "Updated description",
      "UpdatedScreen",
      "UpdatedContract",
      owner.address,
      "UpdatedSponsorReqContract",
      owner.address
    );
    await tx.wait();

    const questType = await questTypes.readQuestType(1);
    expect(questType.name).to.equal("Updated Quest");
    expect(questType.description).to.equal("Updated description");
    expect(questType.screenName).to.equal("UpdatedScreen");
    expect(questType.questContractName).to.equal("UpdatedContract");
    expect(questType.questContractAddress).to.equal(owner.address);
    expect(questType.sponsorRequirementsContractName).to.equal("UpdatedSponsorReqContract");
    expect(questType.sponsorRequirementsAddress).to.equal(owner.address);
  });

  it("should delete a quest type", async function () {
    const tx = await questTypes.deleteQuestType(1);
    await tx.wait();

    await expect(questTypes.readQuestType(1)).to.be.revertedWith("QuestType does not exist");
  });

  it("should list quest types", async function () {
    const questTypesList = await questTypes.listQuestTypes();
    expect(questTypesList.length).to.equal(2);
    expect(questTypesList[0].name).to.equal("Test Quest 1");
    expect(questTypesList[1].name).to.equal("Test Quest 2");
  });

  it("should get quest type count", async function () {
    const count = await questTypes.getQuestTypeCount();
    expect(count).to.equal(2);
  });

  it("should get a quest type by index", async function () {
    const questType = await questTypes.getQuestTypeByIndex(1);
    expect(questType.name).to.equal("Test Quest 1");
  });
});

