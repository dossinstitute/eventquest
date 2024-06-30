const { expect } = require("chai");

describe("EventQuestManagement", function () {
  let eventQuestManagement;
  let events;
  let quests;
  let users;
  let sponsors;
  let questEvents;
  let userQuestEvents;
  let rewards;
  let rewardPools;
  let deployer;

  beforeEach(async function () {
    [deployer] = await ethers.getSigners();

    const Events = await ethers.getContractFactory("Events");
    events = await Events.deploy();
    await events.waitForDeployment();

    const Quests = await ethers.getContractFactory("Quests");
    quests = await Quests.deploy();
    await quests.waitForDeployment();

    const Users = await ethers.getContractFactory("Users");
    users = await Users.deploy();
    await users.waitForDeployment();

    const Sponsors = await ethers.getContractFactory("Sponsors");
    sponsors = await Sponsors.deploy();
    await sponsors.waitForDeployment();

    const QuestEvents = await ethers.getContractFactory("QuestEvents");
    questEvents = await QuestEvents.deploy();
    await questEvents.waitForDeployment();

    const RewardPools = await ethers.getContractFactory("RewardPools");
    rewardPools = await RewardPools.deploy(questEvents.target);
    await rewardPools.waitForDeployment();

    const UserQuestEvents = await ethers.getContractFactory("UserQuestEvents");
    userQuestEvents = await UserQuestEvents.deploy();
    await userQuestEvents.waitForDeployment();

    const Rewards = await ethers.getContractFactory("Rewards");
    rewards = await Rewards.deploy();
    await rewards.waitForDeployment();

    const EventQuestManagement = await ethers.getContractFactory("EventQuestManagement");
    eventQuestManagement = await EventQuestManagement.deploy(
      events.target,
      quests.target,
      users.target,
      sponsors.target,
      questEvents.target,
      userQuestEvents.target,
      rewards.target,
      rewardPools.target
    );
    await eventQuestManagement.waitForDeployment();
  });

  it("Should create, update, read, list, and delete an event", async function () {
    await events.createEvent("Test Event", "desc", 1640995200, 1641081600);
    await events.updateEvent(1, "Updated Event", "desc", 1640995201, 1641081601, 0);
    const event = await events.readEvent(1);
    expect(event.name).to.equal("Updated Event");
    expect(event.startDate).to.equal(1640995201);
    expect(event.endDate).to.equal(1641081601);

    const eventList = await events.listEvents();
    expect(eventList.length).to.equal(1);

    await events.deleteEvent(1);
    await expect(events.readEvent(1)).to.be.revertedWith("Event does not exist");
  });

  it("Should create, update, read, list, and delete a quest", async function () {
    await quests.createQuest("Test Quest", 10, 1640995200, 1641081600, 1000);
    await quests.updateQuest(1, "Updated Quest", 20, 1640995201, 1641081601, 2000);
    const quest = await quests.readQuest(1);
    expect(quest.name).to.equal("Updated Quest");
    expect(quest.defaultInteractions).to.equal(20);
    expect(quest.defaultStartDate).to.equal(1640995201);
    expect(quest.defaultEndDate).to.equal(1641081601);
    expect(quest.defaultRewardAmount).to.equal(2000);

    const questList = await quests.listQuests();
    expect(questList.length).to.equal(1);

    await quests.deleteQuest(1);
    await expect(quests.readQuest(1)).to.be.revertedWith("Quest does not exist");
  });

  it("Should create, update, read, list, and delete a user", async function () {
    await users.createUser(deployer.address, "admin");
    await users.updateUser(1, deployer.address, "user");
    const user = await users.readUser(1);
    expect(user.wallet).to.equal(deployer.address);
    expect(user.role).to.equal("user");

    const userList = await users.listUsers();
    expect(userList.length).to.equal(1);

    await users.deleteUser(1);
    await expect(users.readUser(1)).to.be.revertedWith("User does not exist");
  });

  it("Should create, update, read, list, and delete a sponsor", async function () {
    await sponsors.createSponsor("Test Company", deployer.address, 1);
    await sponsors.updateSponsor(1, "Updated Company", deployer.address, 2);
    const sponsor = await sponsors.readSponsor(1);
    expect(sponsor.companyName).to.equal("Updated Company");
    expect(sponsor.wallet).to.equal(deployer.address);
    expect(sponsor.rewardPoolId).to.equal(2);

    const sponsorList = await sponsors.listSponsors();
    expect(sponsorList.length).to.equal(1);

    await sponsors.deleteSponsor(1);
    await expect(sponsors.readSponsor(1)).to.be.revertedWith("Sponsor does not exist");
  });

  it("Should create, update, read, list, and delete a quest event", async function () {
    await questEvents.createQuestEvent(1, 1, 5, 1640995200, 1641081600, 500, "#test");
    await questEvents.updateQuestEvent(1, 2, 2, 10, 1640995201, 1641081601, 1000, "#updated");
    const questEvent = await questEvents.readQuestEvent(1);
    expect(questEvent.eventId).to.equal(2);
    expect(questEvent.questId).to.equal(2);
    expect(questEvent.minimumInteractions).to.equal(10);
    expect(questEvent.startDate).to.equal(1640995201);
    expect(questEvent.endDate).to.equal(1641081601);
    expect(questEvent.rewardAmount).to.equal(1000);
    expect(questEvent.urlHashTags).to.equal("#updated");

    const questEventList = await questEvents.listQuestEvents();
    expect(questEventList.length).to.equal(1);

    await questEvents.deleteQuestEvent(1);
    await expect(questEvents.readQuestEvent(1)).to.be.revertedWith("QuestEvent does not exist");
  });

  it("Should create, update, read, list, and delete a user quest event", async function () {
    await userQuestEvents.createUserQuestEvent(1, 1, 10, true, "http://test.com", true);
    await userQuestEvents.updateUserQuestEvent(1, 2, 2, 20, false, "http://updated.com", false);
    const userQuestEvent = await userQuestEvents.readUserQuestEvent(1);
    expect(userQuestEvent.questEventId).to.equal(2);
    expect(userQuestEvent.userId).to.equal(2);
    expect(userQuestEvent.interactions).to.equal(20);
    expect(userQuestEvent.validated).to.equal(false);
    expect(userQuestEvent.url).to.equal("http://updated.com");
    expect(userQuestEvent.completed).to.equal(false);

    const userQuestEventList = await userQuestEvents.listUserQuestEvents();
    expect(userQuestEventList.length).to.equal(1);

    await userQuestEvents.deleteUserQuestEvent(1);
    await expect(userQuestEvents.readUserQuestEvent(1)).to.be.revertedWith("UserQuestEvent does not exist");
  });

  it("Should create, update, read, list, and delete a reward", async function () {
    await rewards.createReward(1, 1, 1000, "token", deployer.address);
    await rewards.updateReward(1, 2, 2, 2000, "updatedToken", deployer.address);
    const reward = await rewards.readReward(1);
    expect(reward.attendeeId).to.equal(2);
    expect(reward.rewardPoolId).to.equal(2);
    expect(reward.amount).to.equal(2000);
    expect(reward.rewardType).to.equal("updatedToken");
    expect(reward.poolWalletAddress).to.equal(deployer.address);

    const rewardList = await rewards.listRewards();
    expect(rewardList.length).to.equal(1);

    await rewards.deleteReward(1);
    await expect(rewards.readReward(1)).to.be.revertedWith("Reward does not exist");
  });

  it("Should create, update, read, list, and delete a reward pool", async function () {
    await questEvents.createQuestEvent(1, 1, 5, 1640995200, 1641081600, 500, "#test");
    await rewardPools.createRewardPool(1000, 1, 1);
    await rewardPools.updateRewardPool(1, 2000, 1, 2);  // Ensure the correct questEventId
    const rewardPool = await rewardPools.readRewardPool(1);
    expect(rewardPool.transferAmount).to.equal(2000);
    expect(rewardPool.questEventId).to.equal(1);
    expect(rewardPool.sponsorId).to.equal(2);

    const rewardPoolList = await rewardPools.listRewardPools();
    expect(rewardPoolList.length).to.equal(1);

    await rewardPools.deleteRewardPool(1);
    await expect(rewardPools.readRewardPool(1)).to.be.revertedWith("RewardPool does not exist");
  });

  it("Should get quests for user", async function () {
    await userQuestEvents.createUserQuestEvent(1, 1, 10, true, "http://test.com", true);
    const userQuests = await eventQuestManagement.getQuestsForUser(1);
    expect(userQuests.length).to.equal(1);
    expect(userQuests[0].userId).to.equal(1);
    expect(userQuests[0].questEventId).to.equal(1);
  });

  it("Should get quest events for sponsor", async function () {
    await questEvents.createQuestEvent(1, 1, 5, 1640995200, 1641081600, 500, "#test");
    await rewardPools.createRewardPool(1000, 1, 1);
    const sponsorQuestEvents = await eventQuestManagement.getQuestEventsForSponsor(1);
    expect(sponsorQuestEvents.length).to.equal(1);
    expect(sponsorQuestEvents[0].questEventId).to.equal(1);
  });
});

