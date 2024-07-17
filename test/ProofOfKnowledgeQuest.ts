import { ethers } from "hardhat";
import { expect } from "chai";
import Web3 from "web3";

describe("ProofOfKnowledgeQuest", function () {
  let proofOfKnowledgeQuest: any;
  let questManager: any;
  let deployer: any, user1: any;
  const web3 = new Web3();

  beforeEach(async function () {
    [deployer, user1] = await ethers.getSigners();

    const QuestManager = await ethers.getContractFactory("QuestManager");
    questManager = await QuestManager.deploy();
    await questManager.waitForDeployment();

    const ProofOfKnowledgeQuest = await ethers.getContractFactory("ProofOfKnowledgeQuest");
    proofOfKnowledgeQuest = await ProofOfKnowledgeQuest.deploy(await questManager.getAddress(), "Proof of Knowledge Quest", "Knowledge Type");
    await proofOfKnowledgeQuest.waitForDeployment();
  });

  async function getCurrentBlockTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }

  it("Should initialize a new ProofOfKnowledge quest", async function () {
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future
    const questions = ["Question1?", "Question2?"];
    const answers = ["Answer1", "Answer2"];

    await proofOfKnowledgeQuest.initializeProofOfKnowledgeQuest(
      1,
      1, // questTypeId
      questions,
      answers,
      expirationTime
    );

    const quest = await proofOfKnowledgeQuest.quests(1);
    console.log("Quest initialized:", quest);
    expect(quest.isActive).to.be.true;
    expect(quest.isCompleted).to.be.false;
    expect(quest.expirationTime).to.equal(expirationTime);
  });

  it("Should allow answering questions", async function () {
    const questId = 1;
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future
    const questions = ["Question1?", "Question2?"];
    const answers = ["Answer1", "Answer2"];

    await proofOfKnowledgeQuest.initializeProofOfKnowledgeQuest(
      questId,
      1, // questTypeId
      questions,
      answers,
      expirationTime
    );

    const questionId = 0;
    const answer = "Answer1";
    const answerData = web3.eth.abi.encodeParameters(["uint256", "string"], [questionId, answer]);
    await proofOfKnowledgeQuest.connect(user1).interact(questId, user1.address, "answer", answerData);

    const answeredQuestions = await proofOfKnowledgeQuest.getQuestions(questId);
    console.log("Answered Questions:", answeredQuestions);
    expect(answeredQuestions[0]).to.equal(questions[0]);
  });

  it("Should mark a quest as completed when all questions are answered correctly", async function () {
    const questId = 1;
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future
    const questions = ["Question1?", "Question2?"];
    const answers = ["Answer1", "Answer2"];

    await proofOfKnowledgeQuest.initializeProofOfKnowledgeQuest(
      questId,
      1, // questTypeId
      questions,
      answers,
      expirationTime
    );

    const answerData1 = web3.eth.abi.encodeParameters(["uint256", "string"], [0, "Answer1"]);
    const answerData2 = web3.eth.abi.encodeParameters(["uint256", "string"], [1, "Answer2"]);

    await proofOfKnowledgeQuest.connect(user1).interact(questId, user1.address, "answer", answerData1);
    await proofOfKnowledgeQuest.connect(user1).interact(questId, user1.address, "answer", answerData2);

    const quest = await proofOfKnowledgeQuest.quests(questId);
    expect(quest.isCompleted).to.be.true;
    expect(quest.isActive).to.be.false;
  });
});

