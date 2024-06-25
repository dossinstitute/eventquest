const { expect } = require("chai");

describe("EventManager", function () {
  let EventManager, eventManager, owner, addr1, addr2, QuestManager, questManager;

	beforeEach(async function () {
		QuestManager = await ethers.getContractFactory("QuestManager");
		[owner, addr1, addr2] = await ethers.getSigners();

		console.log("EventManager Deploying QuestManager...");
		questManager = await QuestManager.deploy();
		await questManager.waitForDeployment();
		console.log("EventManager QuestManager deployed at:", await questManager.getAddress());

		EventManager = await ethers.getContractFactory("EventManager");
		console.log("Deploying EventManager with QuestManager address:", await questManager.getAddress());
		eventManager = await EventManager.deploy(await questManager.getAddress());
		await eventManager.waitForDeployment();
		console.log("EventManager deployed at:", await eventManager.getAddress());
	});

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await eventManager.admin()).to.equal(owner.address);
    });
  });

  describe("Event Management", function () {
    it("Should create an event", async function () {
  const startTime = Math.floor(Date.now() / 1000); // Current time
  const endTime = startTime + 86400; // 1 day later
  const description = "New Event";

  await expect(eventManager.createEvent(startTime, endTime, description))
   .to.emit(eventManager, "EventCreated")
   .withArgs(1, startTime, endTime, description); // Assuming eventCount starts at 0

  const createdEvent = await eventManager.events(1);
  expect(createdEvent.startTime).to.equal(startTime);
  expect(createdEvent.endTime).to.equal(endTime);
  expect(createdEvent.description).to.equal(description);
      // const startTime = Math.floor(Date.now() / 1000);
      // const endTime = startTime + 86400; // 1 day from now
      // const description = "Test Event";
      //
      // await eventManager.createEvent(startTime, endTime, description);
      //
      // const event = await eventManager.events(1);
      // expect(event.startTime).to.equal(startTime);
      // expect(event.endTime).to.equal(endTime);
      // expect(event.description).to.equal(description);
      // expect(event.status).to.equal(0); // Active status is 0
    });

    it("Should update an event", async function () {
      const newStartTime = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
      const newEndTime = newStartTime + 86400; // 1 day later
      const newDescription = "Updated Event";

      await eventManager.updateEvent(1, newStartTime, newEndTime, newDescription);

      const updatedEvent = await eventManager.events(1);
      expect(updatedEvent.startTime).to.equal(newStartTime);
      expect(updatedEvent.endTime).to.equal(newEndTime);
      expect(updatedEvent.description).to.equal(newDescription);
    });

    it("Should delete an event", async function () {
      await eventManager.deleteEvent(1);

      const deletedEvent = await eventManager.events(1);
      expect(deletedEvent.id).to.equal(0); // Assuming deleted events reset to initial state
    });

    it("Should assign a quest to an event", async function () {
      // Assuming a quest with ID 1 exists in QuestManager
      await eventManager.createEvent(Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000) + 86400, "Another Event");
      const questStartTime = Math.floor(Date.now() / 1000);
      const questEndTime = questStartTime + 86400; // 1 day from now

			const eventId = 1;
			const startDate = Math.floor(Date.now() / 1000); // Current timestamp
			const endDate = startDate + 86400; // 1 day from now
			const requiredInteractions = 3;
			const rewardType = "NFT";

			await questManager.createQuest(eventId, startDate, endDate, requiredInteractions, rewardType)
			const quest = await questManager.getQuest(1); // Retrieve using the generated questId
      await eventManager.assignQuestToEvent(eventId, quest.questId, questStartTime, questEndTime);

      const event = await eventManager.events(1);
			const equest = await eventManager.getQuestInfo(eventId, 1);
      expect(equest.questId).to.equal(1);
      expect(equest.startTime).to.equal(questStartTime);
      expect(equest.endTime).to.equal(questEndTime);
    });

    it("Should list events", async function () {
      await eventManager.createEvent(Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000) + 86400, "Another Event");
      await eventManager.createEvent(Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000) + 86400, "Another Event");
      const eventIds = await eventManager.listEvents();
      expect(eventIds.length).to.equal(2); // After creating another event
      expect(eventIds).to.include(1n);
      expect(eventIds).to.include(2n);
    });
  });
	describe("Access Control", function () {
		it("Should revert if non-admin tries to create an event", async function () {
			const startTime = Math.floor(Date.now() / 1000);
			const endTime = startTime + 86400; // 1 day from now
			const description = "Unauthorized Event";

			await expect(
				eventManager.connect(addr1).createEvent(startTime, endTime, description)
			).to.be.revertedWith("Only admin can perform this action");
		});

		it("Should revert if non-admin tries to update an event", async function () {
			const newStartTime = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
			const newEndTime = newStartTime + 86400; // 1 day later
			const newDescription = "Unauthorized Update";

			await expect(
				eventManager.connect(addr1).updateEvent(1, newStartTime, newEndTime, newDescription)
			).to.be.revertedWith("Only admin can perform this action");
		});

		it("Should revert if non-admin tries to delete an event", async function () {
			await expect(
				eventManager.connect(addr1).deleteEvent(1)
			).to.be.revertedWith("Only admin can perform this action");
		});

		it("Should revert if non-admin tries to assign a quest to an event", async function () {
			// Assuming a quest with ID 1 exists in QuestManager
			const questStartTime = Math.floor(Date.now() / 1000);
			const questEndTime = questStartTime + 86400; // 1 day from now

			await expect(
				eventManager.connect(addr1).assignQuestToEvent(1, 1, questStartTime, questEndTime)
			).to.be.revertedWith("Only admin can perform this action");
		});
	});

});
