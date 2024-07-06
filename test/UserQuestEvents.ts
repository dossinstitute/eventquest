const { expect } = require("chai");

describe("UserQuestEvents", function () {
  let Users, UserQuestEvents, QuestEvents;
  let users, userQuestEvents, questEvents;
  let admin, user1, user2;
  let questEventId = 1;

  beforeEach(async function () {
    [admin, user1, user2] = await ethers.getSigners();

    // Deploy Users contract and create users
    Users = await ethers.getContractFactory("Users");
    users = await Users.deploy();
    await users.waitForDeployment();
    await users.createUser(user1.address, "user");
    await users.createUser(user2.address, "user");

    // Deploy QuestEvents contract and create a quest event
    QuestEvents = await ethers.getContractFactory("QuestEvents");
    questEvents = await QuestEvents.deploy();
    await questEvents.waitForDeployment();
    await questEvents.createQuestEvent(1, 1, 10, 1640995200, 1641081600, 100, "#tag");

    // Deploy UserQuestEvents contract
    UserQuestEvents = await ethers.getContractFactory("UserQuestEvents");
    userQuestEvents = await UserQuestEvents.deploy();
    await userQuestEvents.waitForDeployment();
  });

  describe("UserQuestEvent Management", function () {
    it("Should create a user quest event", async function () {
      const userId = await users.getUserIdByWallet(user1.address);
      const txResponse = await userQuestEvents.createUserQuestEvent(questEventId, userId, 5, true, "http://example.com", false);
      const receipt = await txResponse.wait();

      // Log the receipt to inspect its contents
      console.log("Transaction receipt:", receipt);

      // Check if the events array is defined
      if (receipt.events && receipt.events.length > 0) {
        // Extract event arguments from the transaction receipt
        const event = receipt.events.find(event => event.event === 'UserQuestEventCreated');
        
        if (event) {
          const userQuestEventId = event.args.userQuestEventId.toNumber();
          const userQuestEvent = await userQuestEvents.readUserQuestEvent(userQuestEventId);

          expect(userQuestEvent.userQuestEventId).to.equal(userQuestEventId);
          expect(userQuestEvent.questEventId).to.equal(questEventId);
          expect(userQuestEvent.userId).to.equal(userId);
          expect(userQuestEvent.interactions).to.equal(5);
          expect(userQuestEvent.validated).to.equal(true);
          expect(userQuestEvent.url).to.equal("http://example.com");
          expect(userQuestEvent.completed).to.equal(false);
        } else {
          console.error("UserQuestEventCreated event not found in receipt.events:", receipt.events);
        }
      } else {
        console.error("No events found in receipt:", receipt);
      }
    });

    it("Should update a user quest event", async function () {
      const userId = await users.getUserIdByWallet(user1.address);
      const txResponse = await userQuestEvents.createUserQuestEvent(questEventId, userId, 5, true, "http://example.com", false);
      const receipt = await txResponse.wait();

      if (receipt.events && receipt.events.length > 0) {
        const event = receipt.events.find(event => event.event === 'UserQuestEventCreated');
        if (event) {
          const userQuestEventId = event.args.userQuestEventId.toNumber();
          await userQuestEvents.updateUserQuestEvent(userQuestEventId, questEventId, userId, 10, false, "http://updated.com", true);

          const userQuestEvent = await userQuestEvents.readUserQuestEvent(userQuestEventId);
          expect(userQuestEvent.interactions).to.equal(10);
          expect(userQuestEvent.validated).to.equal(false);
          expect(userQuestEvent.url).to.equal("http://updated.com");
          expect(userQuestEvent.completed).to.equal(true);
        } else {
          console.error("UserQuestEventCreated event not found in receipt.events:", receipt.events);
        }
      } else {
        console.error("No events found in receipt:", receipt);
      }
    });

    it("Should delete a user quest event", async function () {
      const userId = await users.getUserIdByWallet(user1.address);
      const txResponse = await userQuestEvents.createUserQuestEvent(questEventId, userId, 5, true, "http://example.com", false);
      const receipt = await txResponse.wait();

      if (receipt.events && receipt.events.length > 0) {
        const event = receipt.events.find(event => event.event === 'UserQuestEventCreated');
        if (event) {
          const userQuestEventId = event.args.userQuestEventId.toNumber();
          await userQuestEvents.deleteUserQuestEvent(userQuestEventId);

          await expect(userQuestEvents.readUserQuestEvent(userQuestEventId)).to.be.revertedWith("UserQuestEvent does not exist");
        } else {
          console.error("UserQuestEventCreated event not found in receipt.events:", receipt.events);
        }
      } else {
        console.error("No events found in receipt:", receipt);
      }
    });

    it("Should list user quest events", async function () {
      const userId = await users.getUserIdByWallet(user1.address);
      await userQuestEvents.createUserQuestEvent(questEventId, userId, 5, true, "http://example.com", false);
      await userQuestEvents.createUserQuestEvent(questEventId, userId, 7, false, "http://example2.com", true);

      const userQuestEventList = await userQuestEvents.listUserQuestEvents();

      expect(userQuestEventList.length).to.equal(2);
      expect(userQuestEventList[0].url).to.equal("http://example.com");
      expect(userQuestEventList[1].url).to.equal("http://example2.com");
    });

    it("Should get quests for a user", async function () {
      const userId1 = await users.getUserIdByWallet(user1.address);
      const userId2 = await users.getUserIdByWallet(user2.address);
      await userQuestEvents.createUserQuestEvent(questEventId, userId1, 5, true, "http://example.com", false);
      await userQuestEvents.createUserQuestEvent(questEventId, userId2, 7, false, "http://example2.com", true);

      const userQuests = await userQuestEvents.getQuestsForUser(userId1);

      expect(userQuests.length).to.equal(1);
      expect(userQuests[0].url).to.equal("http://example.com");
    });

    it("Should return the correct user quest event count", async function () {
      const userId = await users.getUserIdByWallet(user1.address);
      await userQuestEvents.createUserQuestEvent(questEventId, userId, 5, true, "http://example.com", false);
      await userQuestEvents.createUserQuestEvent(questEventId, userId, 7, false, "http://example2.com", true);

      const userQuestEventCount = await userQuestEvents.getUserQuestEventCount();
      expect(userQuestEventCount).to.equal(2);
    });

    // it("Should revert if creating a user quest event with non-existent questEventId", async function () {
    //   const userId = await users.getUserIdByWallet(user1.address);
    //   await expect(userQuestEvents.createUserQuestEvent(999, userId, 5, true, "http://example.com", false)).to.be.revertedWith("QuestEvent does not exist");
    // });

    it("Should revert if reading a non-existent user quest event", async function () {
      await expect(userQuestEvents.readUserQuestEvent(999)).to.be.revertedWith("UserQuestEvent does not exist");
    });

    it("Should revert if updating a non-existent user quest event", async function () {
      const userId = await users.getUserIdByWallet(user1.address);
      await expect(userQuestEvents.updateUserQuestEvent(999, questEventId, userId, 10, false, "http://updated.com", true)).to.be.revertedWith("UserQuestEvent does not exist");
    });

    it("Should revert if deleting a non-existent user quest event", async function () {
      await expect(userQuestEvents.deleteUserQuestEvent(999)).to.be.revertedWith("UserQuestEvent does not exist");
    });
  });
});

