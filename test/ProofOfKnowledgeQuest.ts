const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3 = require("web3");

describe("ProofOfKnowledgeQuest", function () {
  let proofOfKnowledgeQuest;
  let questManager;
  let deployer, user1, user2;
  const web3 = new Web3();

  beforeEach(async function () {
    [deployer, user1, user2] = await ethers.getSigners();

    const QuestManager = await ethers.getContractFactory("QuestManager");
    questManager = await QuestManager.deploy();
    await questManager.waitForDeployment();

    const ProofOfKnowledgeQuest = await ethers.getContractFactory("ProofOfKnowledgeQuest");
    proofOfKnowledgeQuest = await ProofOfKnowledgeQuest.deploy(
      questManager.target,
      "Knowledge Quest",
      "Knowledge Type"
    );
    await proofOfKnowledgeQuest.waitForDeployment();
  });

  async function getCurrentBlockTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }

  it("Should initialize a new ProofOfKnowledge quest", async function () {
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future

    const questions = ["Question1", "Question2"];
    const answers = ["Answer1", "Answer2"];
    await proofOfKnowledgeQuest.initializeProofOfKnowledgeQuest(1, questions, answers, expirationTime);

    const quest = await proofOfKnowledgeQuest.quests(1);
    expect(quest.isActive).to.be.true;
    expect(quest.isCompleted).to.be.false;
    expect(quest.expirationTime).to.equal(expirationTime);

    const questionList = await proofOfKnowledgeQuest.getQuestions(1);
    expect(questionList).to.deep.equal(questions);
  });

  it("Should allow answering a question", async function () {
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future

    const questions = ["Question1", "Question2"];
    const answers = ["Answer1", "Answer2"];
    await proofOfKnowledgeQuest.initializeProofOfKnowledgeQuest(1, questions, answers, expirationTime);

    const answerData = web3.eth.abi.encodeParameters(["uint256", "string"], [0, "Answer1"]);
    await expect(proofOfKnowledgeQuest.interact(1, user1.address, "answer", answerData))
      .to.emit(proofOfKnowledgeQuest, "QuestionAnswered")
      .withArgs(1, user1.address, 0, true);

    const interactionState = await proofOfKnowledgeQuest.answeredQuestions(1, user1.address, 0);
    expect(interactionState).to.be.true;
  });

  it("Should not allow answering the same question twice", async function () {
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future

    const questions = ["Question1", "Question2"];
    const answers = ["Answer1", "Answer2"];
    await proofOfKnowledgeQuest.initializeProofOfKnowledgeQuest(1, questions, answers, expirationTime);

    const answerData = web3.eth.abi.encodeParameters(["uint256", "string"], [0, "Answer1"]);
    await proofOfKnowledgeQuest.interact(1, user1.address, "answer", answerData);

    await expect(proofOfKnowledgeQuest.interact(1, user1.address, "answer", answerData))
      .to.be.revertedWith("Question already answered.");
  });

  it("Should mark a quest as completed when all questions are answered correctly", async function () {
    const currentTimestamp = await getCurrentBlockTimestamp();
    const expirationTime = currentTimestamp + 86400; // 1 day in the future

    const questions = ["Question1", "Question2"];
    const answers = ["Answer1", "Answer2"];
    await proofOfKnowledgeQuest.initializeProofOfKnowledgeQuest(1, questions, answers, expirationTime);

    const answer1Data = web3.eth.abi.encodeParameters(["uint256", "string"], [0, "Answer1"]);
    const answer2Data = web3.eth.abi.encodeParameters(["uint256", "string"], [1, "Answer2"]);

    await proofOfKnowledgeQuest.interact(1, user1.address, "answer", answer1Data);
    await expect(proofOfKnowledgeQuest.interact(1, user1.address, "answer", answer2Data))
      .to.emit(proofOfKnowledgeQuest, "QuestionAnswered")
      .withArgs(1, user1.address, 1, true);

    const quest = await proofOfKnowledgeQuest.quests(1);
    expect(quest.isCompleted).to.be.true;
    expect(quest.isActive).to.be.false;
  });
});

