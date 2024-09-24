const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3 = require("web3");

describe("QuestType", function () {
  let questType;
  let deployer, user1;
  const web3 = new Web3();

  beforeEach(async function () {
    [deployer, user1] = await ethers.getSigners();

    const QuestType = await ethers.getContractFactory("QuestTypes"); // Correct contract name
    questType = await QuestType.deploy();
    await questType.waitForDeployment();
  });

  it("Should create a new QuestType", async function () {
    const name = "Test Quest";
    const description = "Test Description";
    const screenName = "Test Screen Name";
    const questContractName = "TestQuestContract";
    const questContractAddress = web3.utils.padLeft(0, 40);
    const sponsorRequirementsContractName = "TestSponsorRequirementsContract";
    const sponsorRequirementsAddress = web3.utils.padLeft(0, 40);

    await questType.createQuestType(
      name,
      description,
      screenName,
      questContractName,
      questContractAddress,
      sponsorRequirementsContractName,
      sponsorRequirementsAddress
    );

    const questTypeCount = await questType.getQuestTypeCount();
    expect(questTypeCount).to.equal(1);

    const questTypeData = await questType.readQuestType(1);
    expect(questTypeData.name).to.equal(name);
  });

  it("Should update a QuestType", async function () {
    const name = "Test Quest";
    const description = "Test Description";
    const screenName = "Test Screen Name";
    const questContractName = "TestQuestContract";
    const questContractAddress = web3.utils.padLeft(0, 40);
    const sponsorRequirementsContractName = "TestSponsorRequirementsContract";
    const sponsorRequirementsAddress = web3.utils.padLeft(0, 40);

    await questType.createQuestType(
      name,
      description,
      screenName,
      questContractName,
      questContractAddress,
      sponsorRequirementsContractName,
      sponsorRequirementsAddress
    );

    const newName = "Updated Quest";
    const newDescription = "Updated Description";
    const newScreenName = "Updated Screen Name";
    const newQuestContractName = "UpdatedQuestContract";
    const newQuestContractAddress = web3.utils.padLeft(1, 40); // New address
    const newSponsorRequirementsContractName = "UpdatedSponsorRequirementsContract";
    const newSponsorRequirementsAddress = web3.utils.padLeft(1, 40); // New address

    await questType.updateQuestType(
      1,
      newName,
      newDescription,
      newScreenName,
      newQuestContractName,
      newQuestContractAddress,
      newSponsorRequirementsContractName,
      newSponsorRequirementsAddress
    );

    const updatedQuestTypeData = await questType.readQuestType(1);
    expect(updatedQuestTypeData.name).to.equal(newName);
  });

  it("Should delete a QuestType", async function () {
    const name = "Test Quest";
    const description = "Test Description";
    const screenName = "Test Screen Name";
    const questContractName = "TestQuestContract";
    const questContractAddress = web3.utils.padLeft(0, 40);
    const sponsorRequirementsContractName = "TestSponsorRequirementsContract";
    const sponsorRequirementsAddress = web3.utils.padLeft(0, 40);

    await questType.createQuestType(
      name,
      description,
      screenName,
      questContractName,
      questContractAddress,
      sponsorRequirementsContractName,
      sponsorRequirementsAddress
    );

    await questType.deleteQuestType(1);

    await expect(questType.readQuestType(1)).to.be.revertedWith("QuestType does not exist");
  });

  it("Should list all QuestTypes", async function () {
    const name = "Test Quest";
    const description = "Test Description";
    const screenName = "Test Screen Name";
    const questContractName = "TestQuestContract";
    const questContractAddress = web3.utils.padLeft(0, 40);
    const sponsorRequirementsContractName = "TestSponsorRequirementsContract";
    const sponsorRequirementsAddress = web3.utils.padLeft(0, 40);

    await questType.createQuestType(
      name,
      description,
      screenName,
      questContractName,
      questContractAddress,
      sponsorRequirementsContractName,
      sponsorRequirementsAddress
    );

    const questTypes = await questType.listQuestTypes();
    expect(questTypes.length).to.equal(1);
    expect(questTypes[0].name).to.equal(name);
  });

  it("Should get the count of QuestTypes", async function () {
    const name = "Test Quest";
    const description = "Test Description";
    const screenName = "Test Screen Name";
    const questContractName = "TestQuestContract";
    const questContractAddress = web3.utils.padLeft(0, 40);
    const sponsorRequirementsContractName = "TestSponsorRequirementsContract";
    const sponsorRequirementsAddress = web3.utils.padLeft(0, 40);

    await questType.createQuestType(
      name,
      description,
      screenName,
      questContractName,
      questContractAddress,
      sponsorRequirementsContractName,
      sponsorRequirementsAddress
    );

    const questTypeCount = await questType.getQuestTypeCount();
    expect(questTypeCount).to.equal(1);
  });

  it("Should get a QuestType by index", async function () {
    const name = "Test Quest";
    const description = "Test Description";
    const screenName = "Test Screen Name";
    const questContractName = "TestQuestContract";
    const questContractAddress = web3.utils.padLeft(0, 40);
    const sponsorRequirementsContractName = "TestSponsorRequirementsContract";
    const sponsorRequirementsAddress = web3.utils.padLeft(0, 40);

    await questType.createQuestType(
      name,
      description,
      screenName,
      questContractName,
      questContractAddress,
      sponsorRequirementsContractName,
      sponsorRequirementsAddress
    );

    const questTypeCount = await questType.getQuestTypeCount();
    expect(questTypeCount).to.equal(1);

    const questTypeByIndex = await questType.getQuestTypeByIndex(0); // Using 0-based index
    expect(questTypeByIndex.name).to.equal(name);
  });
});

