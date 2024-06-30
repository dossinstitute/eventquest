const { expect } = require("chai");

describe("Quests", function () {
  let questsContract;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    const Quests = await ethers.getContractFactory("Quests");
    questsContract = await Quests.deploy();
    await questsContract.waitForDeployment();
  });

  it("Should create, update, read, list, and delete a quest", async function () {
    // Create a quest
    const createTx = await questsContract.createQuest(
      "Quest 1",
      "Description 1",
      10,
      1640995200,
      1641081600,
      1000
    );
    await createTx.wait();
    
    let questCount = await questsContract.getQuestCount();
    console.log(`Quest Count after creation: ${questCount}`);
    expect(questCount).to.equal(1);

    // Read the quest
    let quest = await questsContract.readQuest(1);
    expect(quest.name).to.equal("Quest 1");
    expect(quest.description).to.equal("Description 1");
    expect(quest.defaultInteractions).to.equal(10);
    expect(quest.defaultStartDate).to.equal(1640995200);
    expect(quest.defaultEndDate).to.equal(1641081600);
    expect(quest.defaultRewardAmount).to.equal(1000);
    expect(quest.status).to.equal(0); // Status.Active

    // Update the quest
    const updateTx = await questsContract.updateQuest(
      1,
      "Updated Quest 1",
      "Updated Description 1",
      20,
      1641081601,
      1641168001,
      2000,
      1 // Status.Completed
    );
    await updateTx.wait();

    // Read the updated quest
    quest = await questsContract.readQuest(1);
    expect(quest.name).to.equal("Updated Quest 1");
    expect(quest.description).to.equal("Updated Description 1");
    expect(quest.defaultInteractions).to.equal(20);
    expect(quest.defaultStartDate).to.equal(1641081601);
    expect(quest.defaultEndDate).to.equal(1641168001);
    expect(quest.defaultRewardAmount).to.equal(2000);
    expect(quest.status).to.equal(1); // Status.Completed

    // List the quests
    const quests = await questsContract.listQuests();
    expect(quests.length).to.equal(1);
    expect(quests[0].name).to.equal("Updated Quest 1");

    // Delete the quest
    const deleteTx = await questsContract.deleteQuest(1);
    await deleteTx.wait();

    // Verify the quest is deleted
    await expect(questsContract.readQuest(1)).to.be.revertedWith("Quest does not exist");

    // Verify the list function reflects the deletion
    const questsAfterDeletion = await questsContract.listQuests();
    console.log(`Quests after deletion: ${questsAfterDeletion.length}`);
    expect(questsAfterDeletion.length).to.equal(0);

    questCount = await questsContract.getQuestCount();
    console.log(`Quest Count after deletion: ${questCount}`);
    expect(questCount).to.equal(0);
  });

  it("Should get quest by index", async function () {
    // Create multiple quests
    await questsContract.createQuest("Quest 1", "Description 1", 10, 1640995200, 1641081600, 1000);
    await questsContract.createQuest("Quest 2", "Description 2", 20, 1641081600, 1641168000, 2000);
    await questsContract.createQuest("Quest 3", "Description 3", 30, 1641168000, 1641254400, 3000);

    const questCount = await questsContract.getQuestCount();
    expect(questCount).to.equal(3);

    // Get quests by index
    const quest1 = await questsContract.getQuestByIndex(0);
    expect(quest1.name).to.equal("Quest 1");
    const quest2 = await questsContract.getQuestByIndex(1);
    expect(quest2.name).to.equal("Quest 2");
    const quest3 = await questsContract.getQuestByIndex(2);
    expect(quest3.name).to.equal("Quest 3");

    // Ensure index out of bounds is handled
    await expect(questsContract.getQuestByIndex(3)).to.be.revertedWith("Index out of bounds");
  });
});

