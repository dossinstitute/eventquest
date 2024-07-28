import { ethers } from "hardhat";
import { expect } from "chai";
import { zkFetch } from "@reclaimprotocol/zk-fetch";
import Web3 from "web3";
import * as dotenv from "dotenv";

dotenv.config();

describe("ContentCreatorQuest with zk-fetch", function () {
  let contentCreatorQuest: any;
  let questManager: any;
  let mockVerifier: any;
  let deployer: any, user1: any;
  const web3 = new Web3();

  beforeEach(async function () {
    [deployer, user1] = await ethers.getSigners();

    const MockVerifier = await ethers.getContractFactory("MockVerifier");
    mockVerifier = await MockVerifier.deploy();
    await mockVerifier.waitForDeployment();

    const QuestManager = await ethers.getContractFactory("QuestManager");
    questManager = await QuestManager.deploy();
    await questManager.waitForDeployment();

    const ContentCreatorQuest = await ethers.getContractFactory("ContentCreatorQuest");
    contentCreatorQuest = await ContentCreatorQuest.deploy(
      await questManager.getAddress(),
      "Content Creator Quest",
      "Content Type",
      await mockVerifier.getAddress()
    );
    await contentCreatorQuest.waitForDeployment();
  });

  async function getCurrentBlockTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }

  it("Should allow submitting content with zk-fetch proof", async function () {
    const questId = 1;
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future

    const minSubmissions = 2;
    const requiredHashtags = ["#test"];
    const requireHashtags = true;

    await contentCreatorQuest.initializeContentCreatorQuest(
      questId,
      1, // questTypeId
      expirationTime,
      minSubmissions,
      requiredHashtags,
      requireHashtags
    );

    const contentUrl = "http://example.com";
    const hashtags = ["#test"];

    // Simulate zkFetch with API key from environment variable
    const proof = await zkFetch(
      contentUrl,
      { method: 'GET' },
      { apiKey: process.env.RECLAIM_API_KEY }
    );

    const contentData = web3.eth.abi.encodeParameters(
      ["string", "string[]", "bytes", "uint256[2]", "uint256[2][2]", "uint256[2]", "uint256[1]"],
      [contentUrl, hashtags, proof, [1, 2], [[3, 4], [5, 6]], [7, 8], [9]]
    );
    await contentCreatorQuest.connect(user1).interact(questId, user1.address, "submit", contentData);

    const submissions = await contentCreatorQuest.getContentSubmissions(questId);
    expect(submissions.length).to.equal(1);
    expect(submissions[0].contentUrl).to.equal(contentUrl);
  });
});

