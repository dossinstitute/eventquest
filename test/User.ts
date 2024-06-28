const { expect } = require("chai");

describe("UserManager", function () {
    let UserManagerFactory, QuestManagerFactory;
    let userManager, questManager, admin, user1, user2;

    beforeEach(async function () {
        [admin, user1, user2] = await ethers.getSigners();

        QuestManagerFactory = await ethers.getContractFactory("QuestManager");
        UserManagerFactory = await ethers.getContractFactory("UserManager");

        console.log("Deploying QuestManager...");
        questManager = await QuestManagerFactory.deploy();
        await questManager.waitForDeployment();
        console.log("QuestManager deployed at:", questManager.target);

        console.log("Deploying UserManager...");
        userManager = await UserManagerFactory.deploy(questManager.target);
        await userManager.waitForDeployment();
        console.log("UserManager deployed at:", userManager.target);
    });

    describe("Deployment", function () {
        it("Should set the correct admin", async function () {
            expect(await userManager.admin()).to.equal(admin.address);
        });
    });

    describe("User Registration", function () {
        it("Should allow an admin to register a user", async function () {
            await userManager.connect(admin).registerUser(user1.address);

            const user = await userManager.getUser(user1.address);
            expect(user.walletAddress).to.equal(user1.address);
            expect(user.userId).to.equal(1);
        });

        it("Should not allow a user to register themselves", async function () {
            await expect(userManager.connect(user1).registerUser(user1.address))
                .to.be.revertedWith("Only admin can perform this action");
        });

        it("Should not allow an admin to register the same user twice", async function () {
            await userManager.connect(admin).registerUser(user1.address);

            await expect(userManager.connect(admin).registerUser(user1.address))
                .to.be.revertedWith("User already registered");
        });
    });

    describe("Quest Registration", function () {
        beforeEach(async function () {
            await userManager.connect(admin).registerUser(user1.address);

            const startDate = Math.floor(Date.now() / 1000);
            const endDate = startDate + 86400; // 1 day later
            const requiredInteractions = 3;
            const rewardType = "NFT";

            await questManager.connect(admin).createQuest(1, startDate, endDate, requiredInteractions, rewardType);
        });

        it("Should allow an admin to register a user for a quest", async function () {
            await userManager.connect(admin).registerForQuest(user1.address, 1);

            const registeredQuests = await userManager.getRegisteredQuests(user1.address);
            expect(registeredQuests.length).to.equal(1);
            expect(registeredQuests[0]).to.equal(1);
        });

        it("Should not allow an admin to register a user for a non-existent quest", async function () {
            await expect(userManager.connect(admin).registerForQuest(user1.address, 2))
                .to.be.revertedWith("Quest does not exist");
        });

        it("Should not allow a non-admin to register a user for a quest", async function () {
            await expect(userManager.connect(user1).registerForQuest(user1.address, 1))
                .to.be.revertedWith("Only admin can perform this action");
        });
    });

    describe("User Information", function () {
        beforeEach(async function () {
            await userManager.connect(admin).registerUser(user1.address);
            await userManager.connect(admin).registerUser(user2.address);
        });

        it("Should return the correct user count", async function () {
            const userCount = await userManager.getUserCount();
            expect(userCount).to.equal(2);
        });

        it("Should return the correct user by index", async function () {
            const user1Data = await userManager.getUserByIndex(0);
            expect(user1Data.walletAddress).to.equal(user1.address);
            const user2Data = await userManager.getUserByIndex(1);
            expect(user2Data.walletAddress).to.equal(user2.address);
        });

        it("Should return the correct registered quests for a user", async function () {
            const startDate = Math.floor(Date.now() / 1000);
            const endDate = startDate + 86400; // 1 day later
            const requiredInteractions = 3;
            const rewardType = "NFT";

            await questManager.connect(admin).createQuest(1, startDate, endDate, requiredInteractions, rewardType);
            await userManager.connect(admin).registerForQuest(user1.address, 1);

            const registeredQuests = await userManager.getRegisteredQuests(user1.address);
            expect(registeredQuests.length).to.equal(1);
            expect(registeredQuests[0]).to.equal(1);
        });
    });
});
