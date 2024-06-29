const { expect } = require("chai");

describe("EventsManager", function () {
  let UserManager, userManager, QuestManager, questManager, EventsManager, eventManager, RewardDistribution, rewardDistribution, MockERC20, mockERC20;
  let owner, addr1, addr2;

	beforeEach(async function () {
		QuestManager = await ethers.getContractFactory("QuestManager");
		[owner, addr1, addr2] = await ethers.getSigners();

		console.log("EventsManager Deploying QuestManager...");
		questManager = await QuestManager.deploy();
		await questManager.waitForDeployment();
		console.log("EventsManager QuestManager deployed at:", await questManager.getAddress());

	});
describe("RewardDistribution", function () {

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy MockERC20 contract
    MockERC20 = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20.deploy();
    await mockERC20.waitForDeployment();

    // Deploy RewardDistribution contract with a placeholder address
    RewardDistribution = await ethers.getContractFactory("RewardDistribution");
    rewardDistribution = await RewardDistribution.deploy(ethers.constants.AddressZero);
    await rewardDistribution.waitForDeployment();
    console.log("RewardDistribution deployed at:", await rewardDistribution.getAddress());

    // Deploy QuestManager contract with RewardDistribution address
    QuestManager = await ethers.getContractFactory("QuestManager");
    questManager = await QuestManager.deploy(await rewardDistribution.getAddress());
    await questManager.waitForDeployment();
    console.log("QuestManager deployed at:", await questManager.getAddress());

    // // Deploy UserManager contract with QuestManager address
    // UserManager = await ethers.getContractFactory("UserManager");
    // userManager = await UserManager.deploy(await questManager.getAddress());
    // await userManager.waitForDeployment();
    // console.log("UserManager deployed at:", await userManager.getAddress());

    // // Set the QuestManager address in RewardDistribution
    // await rewardDistribution.setQuestManager(await questManager.getAddress());

		EventsManager = await ethers.getContractFactory("EventsManager");
		console.log("Deploying EventsManager with QuestManager address:", await questManager.getAddress());
		eventManager = await EventsManager.deploy(await questManager.getAddress());
		await eventManager.waitForDeployment();
		console.log("EventsManager deployed at:", await eventManager.getAddress());

    // Set RewardDistribution address in QuestManager
    await questManager.setRewardDistributionContract(await rewardDistribution.getAddress());

    // Transfer some tokens to the RewardDistribution contract for rewards
    const transferAmount = "1000000000000000000000"; // 1000 MKT in wei
    await mockERC20.transfer(await rewardDistribution.getAddress(), transferAmount);
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await eventManager.admin()).to.equal(owner.address);
    });
  });

	describe("Events Management", function () {
		it("Should create an event", async function () {
			const startTime = Math.floor(Date.now() / 1000); // Current time
			const endTime = startTime + 86400; // 1 day later
			const description = "New Events";

			await expect(eventManager.createEvents(startTime, endTime, description))
				.to.emit(eventManager, "EventsCreated")
				.withArgs(1, startTime, endTime, description); // Assuming eventCount starts at 0

			const createdEvents = await eventManager.events(1);
			expect(createdEvents.startTime).to.equal(startTime);
			expect(createdEvents.endTime).to.equal(endTime);
			expect(createdEvents.description).to.equal(description);
			// const startTime = Math.floor(Date.now() / 1000);
			// const endTime = startTime + 86400; // 1 day from now
			// const description = "Test Events";
			//
			// await eventManager.createEvents(startTime, endTime, description);
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
      const newDescription = "Updated Events";

      await eventManager.updateEvents(1, newStartTime, newEndTime, newDescription);

      const updatedEvents = await eventManager.events(1);
      expect(updatedEvents.startTime).to.equal(newStartTime);
      expect(updatedEvents.endTime).to.equal(newEndTime);
      expect(updatedEvents.description).to.equal(newDescription);
    });

    it("Should delete an event", async function () {
      await eventManager.deleteEvents(1);

      const deletedEvents = await eventManager.events(1);
      expect(deletedEvents.id).to.equal(0); // Assuming deleted events reset to initial state
    });

    it("Should assign a quest to an event", async function () {
      // Assuming a quest with ID 1 exists in QuestManager
      await eventManager.createEvents(Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000) + 86400, "Another Events");
      const questStartTime = Math.floor(Date.now() / 1000);
      const questEndTime = questStartTime + 86400; // 1 day from now

			const eventId = 1;
			const startDate = Math.floor(Date.now() / 1000); // Current timestamp
			const endDate = startDate + 86400; // 1 day from now
			const requiredInteractions = 3;
			const rewardType = "NFT";

			await questManager.createQuest(eventId, startDate, endDate, requiredInteractions, rewardType)
			const quest = await questManager.getQuest(1); // Retrieve using the generated questId
      await eventManager.assignQuestToEvents(eventId, quest.questId, questStartTime, questEndTime);

      const event = await eventManager.events(1);
			const equest = await eventManager.getQuestInfo(eventId, 1);
      expect(equest.questId).to.equal(1);
      expect(equest.startTime).to.equal(questStartTime);
      expect(equest.endTime).to.equal(questEndTime);
    });

    it("Should list events", async function () {
      await eventManager.createEvents(Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000) + 86400, "Another Events");
      await eventManager.createEvents(Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000) + 86400, "Another Events");
      const eventIds = await eventManager.listEvents();
      expect(eventIds.length).to.equal(2); // After creating another event
      expect(eventIds).to.include(1n);
      expect(eventIds).to.include(2n);
    });
  });
	describe("getEvents", function () {
		it("Should return the correct event", async function () {
			// Create an event
			const startTime = Math.floor(Date.now() / 1000);
			const endTime = startTime + 3600; // 1 hour later
			const description = "Test Events";
			await eventManager.createEvents(startTime, endTime, description);

			// Fetch the event
			const [id, startTimeReturned, endTimeReturned, descriptionReturned, statusReturned] = await eventManager.getEvents(1);

			expect(id).to.equal(1); // Assuming event ID is 1
			expect(startTimeReturned).to.equal(startTime);
			expect(endTimeReturned).to.equal(endTime);
			expect(descriptionReturned).to.equal(description);
			expect(statusReturned).to.equal(0); // Assuming 0 is the value for EventsStatus.Active
		});
	});

	describe("getEventsCount", function () {
		it("Should return the correct number of events", async function () {
			// Create two events
			await eventManager.createEvents(1625000000, 1625100000, "Events 1");
			await eventManager.createEvents(1625200000, 1625300000, "Events 2");

			const count = await eventManager.getEventsCount();
			expect(count).to.equal(2);
		});
	});

	describe("getEventsByIndex", function () {
		it("Should return the correct event by index", async function () {
			// Create an event
			const startTime = Math.floor(Date.now() / 1000);
			const endTime = startTime + 3600; // 1 hour later
			const description = "Test Events";
			await eventManager.createEvents(startTime, endTime, description);

			// Fetch the event by index
			const event = await eventManager.getEventsByIndex(0);

			expect(event.startTime).to.equal(startTime);
			expect(event.endTime).to.equal(endTime);
			expect(event.description).to.equal(description);
		});
	});
	describe("Access Control", function () {
		it("Should revert if non-admin tries to create an event", async function () {
			const startTime = Math.floor(Date.now() / 1000);
			const endTime = startTime + 86400; // 1 day from now
			const description = "Unauthorized Events";

			await expect(
				eventManager.connect(addr1).createEvents(startTime, endTime, description)
			).to.be.revertedWith("Only admin can perform this action");
		});

		it("Should revert if non-admin tries to update an event", async function () {
			const newStartTime = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
			const newEndTime = newStartTime + 86400; // 1 day later
			const newDescription = "Unauthorized Update";

			await expect(
				eventManager.connect(addr1).updateEvents(1, newStartTime, newEndTime, newDescription)
			).to.be.revertedWith("Only admin can perform this action");
		});

		it("Should revert if non-admin tries to delete an event", async function () {
			await expect(
				eventManager.connect(addr1).deleteEvents(1)
			).to.be.revertedWith("Only admin can perform this action");
		});

		it("Should revert if non-admin tries to assign a quest to an event", async function () {
			// Assuming a quest with ID 1 exists in QuestManager
			const questStartTime = Math.floor(Date.now() / 1000);
			const questEndTime = questStartTime + 86400; // 1 day from now

			await expect(
				eventManager.connect(addr1).assignQuestToEvents(1, 1, questStartTime, questEndTime)
			).to.be.revertedWith("Only admin can perform this action");
		});
	});

});
