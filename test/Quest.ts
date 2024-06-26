const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("QuestManager", function () {
	let QuestManager, questManager, owner, addr1, addr2;

	beforeEach(async function () {                                                                      
		const QuestManagerFactory = await ethers.getContractFactory("QuestManager");                                   
		[owner, addr1, addr2] = await ethers.getSigners();                                                

		console.log("QuestManager Deploying QuestManager...");

		// Deploy the contract
		questManager = await QuestManagerFactory.deploy();

		// Check if questManager is correctly defined
		// console.log("Contract instance:", questManager);
			await questManager.waitForDeployment();
			console.log("QuestManager deployed at:", await questManager.getAddress());

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

			it("should return the correct quest count", async function () {
				await questManager.createQuest(1, 1622540800, 1623124800, 5, "NFT");
				expect(await questManager.getQuestCount()).to.equal(1);

				await questManager.createQuest(2, 1622540800, 1623124800, 5, "Token");
				expect(await questManager.getQuestCount()).to.equal(2);
			});

			it("should return the correct quest by index", async function () {
				await questManager.createQuest(1, 1622540800, 1623124800, 5, "NFT");
				await questManager.createQuest(2, 1622540800, 1623124800, 5, "Token");
				const quest = await questManager.getQuestByIndex(0);
				expect(quest.questId).to.equal(1);
				expect(quest.eventId).to.equal(1);
				expect(quest.startDate).to.equal(1622540800);
				expect(quest.endDate).to.equal(1623124800);
				expect(quest.requiredInteractions).to.equal(5);
				expect(quest.rewardType).to.equal("NFT");

				const secondQuest = await questManager.getQuestByIndex(1);
				expect(secondQuest.questId).to.equal(2);
				expect(secondQuest.eventId).to.equal(2);
				expect(secondQuest.startDate).to.equal(1622540800);
				expect(secondQuest.endDate).to.equal(1623124800);
				expect(secondQuest.requiredInteractions).to.equal(5);
				expect(secondQuest.rewardType).to.equal("Token");
			});

			it("should revert when index is out of bounds", async function () {
				await expect(questManager.getQuestByIndex(999)).to.be.revertedWith("Index out of bounds");
			});

		});
	});
	describe("Quest Deletion", function () {
		it("should successfully delete an existing quest", async function () {
			const eventId = 1;
			const startDate = Math.floor(Date.now() / 1000);
			const endDate = startDate + 86400; // 1 day from now
			const requiredInteractions = 3;
			const rewardType = "NFT";

			await questManager.createQuest(eventId, startDate, endDate, requiredInteractions, rewardType);

			await expect(questManager.deleteQuest(eventId)).to.emit(questManager, "QuestDeleted")
				.withArgs(eventId);

			const deletedQuest = await questManager.getQuest(eventId);
			expect(deletedQuest.rewardType).to.equal("");
		});

		it("should revert if trying to delete a nonexistent quest", async function () {
			const eventId = 9999; // Assuming this ID does not exist

			await expect(questManager.deleteQuest(eventId)).to.be.revertedWith("Quest does not exist");
		});

		it("should revert if called by non-admin", async function () {
			const eventId = 11;
			const startDate = Math.floor(Date.now() / 1000);
			const endDate = startDate + 86400; // 1 day from now
			const requiredInteractions = 3;
			const rewardType = "NFT";

			await questManager.createQuest(eventId, startDate, endDate, requiredInteractions, rewardType);

			await expect(
				questManager.connect(addr1).deleteQuest(eventId)
			).to.be.revertedWith("Only admin can perform this action");
		});
	});
	describe("Quest Update", function () {
		it("should successfully update an existing quest", async function () {
			const eventId = 12;
			const startDate = Math.floor(Date.now() / 1000);
			const endDate = startDate + 86400; // 1 day from now
			const requiredInteractions = 3;
			const rewardType = "NFT";

			await questManager.createQuest(eventId, startDate, endDate, requiredInteractions, rewardType);

			const newStartDate = startDate + 3600; // 1 hour later
			const newEndDate = endDate + 3600; // 1 hour later
			const newRequiredInteractions = 4;
			const newRewardType = "Token";

			await expect(questManager.updateQuest(eventId, newStartDate, newEndDate, newRequiredInteractions, newRewardType))
				.to.emit(questManager, "QuestUpdated")
				.withArgs(eventId, newStartDate, newEndDate, newRequiredInteractions, newRewardType);

			const updatedQuest = await questManager.getQuest(eventId);
			expect(updatedQuest.startDate).to.equal(newStartDate);
			expect(updatedQuest.endDate).to.equal(newEndDate);
			expect(updatedQuest.requiredInteractions).to.equal(newRequiredInteractions);
			expect(updatedQuest.rewardType).to.equal(newRewardType);
		});

		it("should revert if trying to update a nonexistent quest", async function () {
			const eventId = 9999; // Assuming this ID does not exist
			const startDate = Math.floor(Date.now() / 1000);
			const endDate = startDate + 86400; // 1 day from now
			const requiredInteractions = 3;
			const rewardType = "NFT";

			await expect(questManager.updateQuest(eventId, startDate, endDate, requiredInteractions, rewardType))
				.to.be.revertedWith("Quest does not exist");
		});

		it("should revert if required interactions are below minimum", async function () {
			const eventId = 13;
			const startDate = Math.floor(Date.now() / 1000);
			const endDate = startDate + 86400; // 1 day from now
			const requiredInteractions = 3;
			const rewardType = "NFT";

			await questManager.createQuest(eventId, startDate, endDate, requiredInteractions, rewardType);

			const newRequiredInteractions = 2; // Below minimum threshold

			await expect(questManager.updateQuest(eventId, startDate, endDate, newRequiredInteractions, rewardType))
				.to.be.revertedWith("Required interactions must be at least three");
		});

		it("should revert if called by non-admin", async function () {
			const eventId = 14;
			const startDate = Math.floor(Date.now() / 1000);
			const endDate = startDate + 86400; // 1 day from now
			const requiredInteractions = 3;
			const rewardType = "NFT";

			await questManager.createQuest(eventId, startDate, endDate, requiredInteractions, rewardType);

			await expect(
				questManager.connect(addr1).updateQuest(eventId, startDate, endDate, requiredInteractions, rewardType)
			).to.be.revertedWith("Only admin can perform this action");
		});
	});
});
