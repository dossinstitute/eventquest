const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3 = require("web3");

describe("ContentCreatorQuest", function () {
  let contentCreatorQuest;
  let questManager;
  let deployer, user1, user2;
  const web3 = new Web3();

  beforeEach(async function () {
    [deployer, user1, user2] = await ethers.getSigners();

    const QuestManager = await ethers.getContractFactory("QuestManager");
    questManager = await QuestManager.deploy();
    await questManager.waitForDeployment();

    const ContentCreatorQuest = await ethers.getContractFactory("ContentCreatorQuest");
    contentCreatorQuest = await ContentCreatorQuest.deploy(
      questManager.target,
      "Content Creator Quest",
      "Content Type",
      3, // minimum submissions
      ["#example", "#test"], // required hashtags
      true // require hashtags
    );
    await contentCreatorQuest.waitForDeployment();
  });

  async function getCurrentBlockTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }

  it("Should initialize a new ContentCreator quest", async function () {
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future

    await contentCreatorQuest.initializeContentCreatorQuest(1, expirationTime);

    const quest = await contentCreatorQuest.quests(1);
    expect(quest.isActive).to.be.true;
    expect(quest.isCompleted).to.be.false;
    expect(quest.expirationTime).to.equal(expirationTime);
  });

  it("Should allow submitting content", async function () {
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future

    await contentCreatorQuest.initializeContentCreatorQuest(1, expirationTime);

    const contentData = web3.eth.abi.encodeParameters(
      ["string", "string[]"],
      ["http://example.com", ["#example", "#test"]]
    );
    await expect(contentCreatorQuest.interact(1, user1.address, "submit", contentData))
      .to.emit(contentCreatorQuest, "ContentSubmitted")
      .withArgs(1, user1.address, "http://example.com", ["#example", "#test"]);

    const submissions = await contentCreatorQuest.getContentSubmissions(1);
    expect(submissions.length).to.equal(1);
    expect(submissions[0].contentUrl).to.equal("http://example.com");
    expect(submissions[0].hashtags).to.deep.equal(["#example", "#test"]);
  });

  it("Should not allow submitting content without required hashtags", async function () {
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future

    await contentCreatorQuest.initializeContentCreatorQuest(1, expirationTime);

    const contentData = web3.eth.abi.encodeParameters(
      ["string", "string[]"],
      ["http://example.com", ["#wrong"]]
    );

    await expect(contentCreatorQuest.interact(1, user1.address, "submit", contentData))
      .to.be.revertedWith("Required hashtags are missing.");
  });

  it("Should mark a quest as completed when minimum submissions are met", async function () {
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future

    await contentCreatorQuest.initializeContentCreatorQuest(1, expirationTime);

    const contentData1 = web3.eth.abi.encodeParameters(
      ["string", "string[]"],
      ["http://example1.com", ["#example", "#test"]]
    );
    const contentData2 = web3.eth.abi.encodeParameters(
      ["string", "string[]"],
      ["http://example2.com", ["#example", "#test"]]
    );
    const contentData3 = web3.eth.abi.encodeParameters(
      ["string", "string[]"],
      ["http://example3.com", ["#example", "#test"]]
    );

    await contentCreatorQuest.interact(1, user1.address, "submit", contentData1);
    await contentCreatorQuest.interact(1, user1.address, "submit", contentData2);
    await expect(contentCreatorQuest.interact(1, user1.address, "submit", contentData3))
      .to.emit(contentCreatorQuest, "ContentSubmitted")
      .withArgs(1, user1.address, "http://example3.com", ["#example", "#test"]);

    const quest = await contentCreatorQuest.quests(1);
    expect(quest.isCompleted).to.be.true;
    expect(quest.isActive).to.be.false;
  });
});

