import { expect } from "chai";
import { ethers } from "hardhat";

describe("UserQuestTypeEvents", function () {
  let userQuestTypeEvents;
  let userContract;
  let owner, addr1;
  let questTypeEventId = 1;
  let userId = 1;
  let interactions = 5;
  let validated = true;
  let url = "http://example.com";
  let completed = false;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const UserQuestTypeEvents = await ethers.getContractFactory("UserQuestTypeEvents");
    userQuestTypeEvents = await UserQuestTypeEvents.deploy();
    await userQuestTypeEvents.waitForDeployment();

    await userQuestTypeEvents.createUserQuestTypeEvent(questTypeEventId, userId, interactions, validated, url, completed);

    // Deploy a mock IUser contract
    const MockUser = await ethers.getContractFactory("MockUser");
    userContract = await MockUser.deploy();
    await userContract.waitForDeployment();

    // Mock user ID for addr1
    await userContract.setUserId(addr1.address, userId);
  });

  it("Should create a new UserQuestTypeEvent", async function () {
    const event = await userQuestTypeEvents.userQuestTypeEvents(1);
    expect(event.questTypeEventId).to.equal(questTypeEventId);
    expect(event.userId).to.equal(userId);
    expect(event.interactions).to.equal(interactions);
    expect(event.validated).to.equal(validated);
    expect(event.url).to.equal(url);
    expect(event.completed).to.equal(completed);
  });

  it("Should update a UserQuestTypeEvent", async function () {
    const newInteractions = 10;
    const newUrl = "http://newexample.com";
    await userQuestTypeEvents.updateUserQuestTypeEvent(1, questTypeEventId, userId, newInteractions, validated, newUrl, completed);
    const event = await userQuestTypeEvents.userQuestTypeEvents(1);
    expect(event.interactions).to.equal(newInteractions);
    expect(event.url).to.equal(newUrl);
  });

  it("Should delete a UserQuestTypeEvent", async function () {
    await userQuestTypeEvents.deleteUserQuestTypeEvent(1);
    await expect(userQuestTypeEvents.readUserQuestTypeEvent(1)).to.be.revertedWith("UserQuestTypeEvent does not exist");
  });

  it("Should list all UserQuestTypeEvents", async function () {
    const events = await userQuestTypeEvents.listUserQuestTypeEvents();
    expect(events.length).to.equal(1);
  });

  it("Should get UserQuestTypeEvents for a specific user", async function () {
    const events = await userQuestTypeEvents.getUserQuestsForUser(userId);
    expect(events.length).to.equal(1);
  });

  it("Should get the count of UserQuestTypeEvents", async function () {
    const count = await userQuestTypeEvents.getUserQuestTypeEventCount();
    expect(count).to.equal(1);
  });

  it("Should get a UserQuestTypeEvent by index", async function () {
    const event = await userQuestTypeEvents.getUserQuestTypeEventByIndex(0);
    expect(event.userQuestTypeEventId).to.equal(1);
  });

  it("Should get UserQuestTypeEvents by wallet address", async function () {
    const IUser = await ethers.getContractAt("contracts/MockUser.sol:IUser", userContract.target);
    
    const userId = await IUser.getUserIdByWallet(addr1.address);
    const events = await userQuestTypeEvents.getUserQuestsByWallet(addr1.address, userContract.target);
    expect(events.length).to.equal(1);
  });
});

