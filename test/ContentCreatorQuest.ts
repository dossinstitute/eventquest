import { ethers } from "hardhat";
import { expect } from "chai";
import Web3 from "web3";

describe("ContentCreatorQuest", function () {
  let contentCreatorQuest: any;
  let questManager: any;
  let deployer: any, user1: any;
  const web3 = new Web3();

  beforeEach(async function () {
    [deployer, user1] = await ethers.getSigners();

    const QuestManager = await ethers.getContractFactory("QuestManager");
    questManager = await QuestManager.deploy();
    await questManager.waitForDeployment();

    const ContentCreatorQuest = await ethers.getContractFactory("ContentCreatorQuest");
    contentCreatorQuest = await ContentCreatorQuest.deploy(await questManager.getAddress(), "Content Creator Quest", "Content Type");
    await contentCreatorQuest.waitForDeployment();
  });

  async function getCurrentBlockTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }

  it("Should initialize a new ContentCreator quest", async function () {
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future

    const minSubmissions = 2;
    const requiredHashtags = ["#test"];
    const requireHashtags = true;

    await contentCreatorQuest.initializeContentCreatorQuest(1, expirationTime, minSubmissions, requiredHashtags, requireHashtags);

    const quest = await contentCreatorQuest.quests(1);
    console.log("Quest initialized:", quest);
    expect(quest.isActive).to.be.true;
    expect(quest.isCompleted).to.be.false;
    expect(quest.expirationTime).to.equal(expirationTime);
  });

  it("Should allow submitting content", async function () {
    const questId = 1;
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future

    const minSubmissions = 2;
    const requiredHashtags = ["#test"];
    const requireHashtags = true;

    await contentCreatorQuest.initializeContentCreatorQuest(questId, expirationTime, minSubmissions, requiredHashtags, requireHashtags);

    const contentUrl = "http://example.com";
    const hashtags = ["#test"];

    const contentData = web3.eth.abi.encodeParameters(["string", "string[]"], [contentUrl, hashtags]);
    await contentCreatorQuest.connect(user1).interact(questId, user1.address, "submit", contentData);

    const submissions = await contentCreatorQuest.getContentSubmissions(questId);
    console.log("Submissions after first content submission:", submissions);
    expect(submissions.length).to.equal(1);
    expect(submissions[0].contentUrl).to.equal(contentUrl);
  });

  it("Should not allow submitting content without required hashtags", async function () {
    const questId = 1;
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future

    const minSubmissions = 2;
    const requiredHashtags = ["#test"];
    const requireHashtags = true;

    await contentCreatorQuest.initializeContentCreatorQuest(questId, expirationTime, minSubmissions, requiredHashtags, requireHashtags);

    const contentUrl = "http://example.com";
    const hashtags = ["#wrong"];

    const contentData = web3.eth.abi.encodeParameters(["string", "string[]"], [contentUrl, hashtags]);
    await expect(contentCreatorQuest.connect(user1).interact(questId, user1.address, "submit", contentData))
      .to.be.revertedWith("Required hashtags are missing.");
  });

  it("Should mark a quest as completed when minimum submissions are met", async function () {
    const questId = 1;
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future

    const minSubmissions = 2;
    const requiredHashtags = ["#test"];
    const requireHashtags = true;

    await contentCreatorQuest.initializeContentCreatorQuest(questId, expirationTime, minSubmissions, requiredHashtags, requireHashtags);

    const contentUrl1 = "http://example.com/1";
    const contentUrl2 = "http://example.com/2";
    const hashtags = ["#test"];

    const contentData1 = web3.eth.abi.encodeParameters(["string", "string[]"], [contentUrl1, hashtags]);
    const contentData2 = web3.eth.abi.encodeParameters(["string", "string[]"], [contentUrl2, hashtags]);

    await contentCreatorQuest.connect(user1).interact(questId, user1.address, "submit", contentData1);
    await contentCreatorQuest.connect(user1).interact(questId, user1.address, "submit", contentData2);

    const quest = await contentCreatorQuest.quests(questId);
    expect(quest.isCompleted).to.be.true;
    expect(quest.isActive).to.be.false;
  });
});

