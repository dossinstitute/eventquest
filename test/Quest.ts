const { expect } = require("chai");

describe("QuestManager", function () {
	let QuestManager, questManager, owner, addr1, addr2;

	beforeEach(async function () {
		QuestManager = await ethers.getContractFactory("QuestManager");
		[owner, addr1, addr2] = await ethers.getSigners();

		questManager = await QuestManager.deploy();
	});

	describe("Deployment", function () {
		it("Should set the right admin", async function () {
			expect(await questManager.admin()).to.equal(owner.address);
		});
	});

	describe("Quest Creation", function () {

		it("Should create a quest", async function () {
			const eventId = 1;
			const startDate = Math.floor(Date.now() / 1000); // Current timestamp
			const endDate = startDate + 86400; // 1 day from now
			const requiredInteractions = 3;
			const rewardType = "NFT";

			await expect(
				questManager.createQuest(eventId, startDate, endDate, requiredInteractions, rewardType)
			).to.emit(questManager, "QuestCreated")
				.withArgs(1, eventId, startDate, endDate, requiredInteractions, rewardType);

				const quest = await questManager.getQuest(1); // Retrieve using the generated questId
				// expect(quest.questId).to.equal(1);
				expect(quest.eventId).to.equal(eventId);
				expect(quest.startDate).to.equal(startDate);
				expect(quest.endDate).to.equal(endDate);
				expect(quest.requiredInteractions).to.equal(requiredInteractions);
				expect(quest.rewardType).to.equal(rewardType);
			});


		it("Should revert if required interactions are less than three", async function () {
			const eventId = 3;
			const startDate = Math.floor(Date.now() / 1000);
			const endDate = startDate + 86400; // 1 day from now
			const requiredInteractions = 2;
			const rewardType = "NFT";

			await expect(
				questManager.createQuest(eventId, startDate, endDate, requiredInteractions, rewardType)
			).to.be.revertedWith("Required interactions must be at least three");
		});

		it("Should revert if reward type is not specified", async function () {
			const eventId = 4;
			const startDate = Math.floor(Date.now() / 1000);
			const endDate = startDate + 86400; // 1 day from now
			const requiredInteractions = 3;
			const rewardType = "";

			await expect(
				questManager.createQuest(eventId, startDate, endDate, requiredInteractions, rewardType)
			).to.be.revertedWith("Reward type must be specified");
		});

		it("Should revert if called by non-admin", async function () {
			const eventId = 5;
			const startDate = Math.floor(Date.now() / 1000);
			const endDate = startDate + 86400; // 1 day from now
			const requiredInteractions = 3;
			const rewardType = "NFT";

			await expect(
				questManager.connect(addr1).createQuest(eventId, startDate, endDate, requiredInteractions, rewardType)
			).to.be.revertedWith("Only admin can perform this action");
		});
		describe("Quest Retrieval", function () {
			it("Should retrieve a quest", async function () {
				const eventId = 6;
				const startDate = Math.floor(Date.now() / 1000);
				const endDate = startDate + 86400; // 1 day from now
				const requiredInteractions = 3;
				const rewardType = "NFT";

				await questManager.createQuest(eventId, startDate, endDate, requiredInteractions, rewardType);

				const quest = await questManager.getQuest(eventId);
				expect(quest.eventId).to.equal(eventId);
				expect(quest.startDate).to.equal(startDate);
				expect(quest.endDate).to.equal(endDate);
				expect(quest.requiredInteractions).to.equal(requiredInteractions);
				expect(quest.rewardType).to.equal(rewardType);
			});
		});
	});
});
