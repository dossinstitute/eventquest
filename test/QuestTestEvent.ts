import { expect } from "chai";
import { ethers } from "hardhat";
import { QuestTypeEvent } from "../typechain-types";

describe("QuestTypeEvent Contract", function () {
  let questTypeEvent: QuestTypeEvent;

  beforeEach(async function () {
    const QuestTypeEvent = await ethers.getContractFactory("QuestTypeEvent");
    questTypeEvent = (await QuestTypeEvent.deploy()) as QuestTypeEvent;
    await questTypeEvent.waitForDeployment();
  });

  it("should create a new quest type event", async function () {
    const tx = await questTypeEvent.createQuestTypeEvent(
      1,
      1,
      1000,
      "Test Event",
      "Description",
      5,
      Math.floor(Date.now() / 1000),
      Math.floor(Date.now() / 1000) + 3600
    );
    await tx.wait();
    const event = await questTypeEvent.readQuestTypeEvent(1);
    expect(event.name).to.equal("Test Event");
  });

  it("should read a quest type event", async function () {
    const tx = await questTypeEvent.createQuestTypeEvent(
      1,
      1,
      1000,
      "Test Event",
      "Description",
      5,
      Math.floor(Date.now() / 1000),
      Math.floor(Date.now() / 1000) + 3600
    );
    await tx.wait();
    const event = await questTypeEvent.readQuestTypeEvent(1);
    expect(event.name).to.equal("Test Event");
  });

  it("should update a quest type event", async function () {
    let tx = await questTypeEvent.createQuestTypeEvent(
      1,
      1,
      1000,
      "Test Event",
      "Description",
      5,
      Math.floor(Date.now() / 1000),
      Math.floor(Date.now() / 1000) + 3600
    );
    await tx.wait();

    tx = await questTypeEvent.updateQuestTypeEvent(
      1,
      2,
      2,
      2000,
      "Updated Event",
      "Updated Description",
      10,
      Math.floor(Date.now() / 1000),
      Math.floor(Date.now() / 1000) + 7200
    );
    await tx.wait();

    const event = await questTypeEvent.readQuestTypeEvent(1);
    expect(event.name).to.equal("Updated Event");
  });

  it("should delete a quest type event", async function () {
    const tx = await questTypeEvent.createQuestTypeEvent(
      1,
      1,
      1000,
      "Test Event",
      "Description",
      5,
      Math.floor(Date.now() / 1000),
      Math.floor(Date.now() / 1000) + 3600
    );
    await tx.wait();

    await questTypeEvent.deleteQuestTypeEvent(1);

    await expect(questTypeEvent.readQuestTypeEvent(1)).to.be.revertedWith("QuestTypeEvent does not exist");
  });

  it("should list quest type events", async function () {
    await questTypeEvent.createQuestTypeEvent(
      1,
      1,
      1000,
      "Test Event 1",
      "Description 1",
      5,
      Math.floor(Date.now() / 1000),
      Math.floor(Date.now() / 1000) + 3600
    );
    await questTypeEvent.createQuestTypeEvent(
      2,
      2,
      2000,
      "Test Event 2",
      "Description 2",
      10,
      Math.floor(Date.now() / 1000),
      Math.floor(Date.now() / 1000) + 7200
    );

    const events = await questTypeEvent.listQuestTypeEvents();
    expect(events.length).to.equal(2);
    expect(events[0].name).to.equal("Test Event 1");
    expect(events[1].name).to.equal("Test Event 2");
  });

  it("should get quest type event count", async function () {
    await questTypeEvent.createQuestTypeEvent(
      1,
      1,
      1000,
      "Test Event 1",
      "Description 1",
      5,
      Math.floor(Date.now() / 1000),
      Math.floor(Date.now() / 1000) + 3600
    );
    await questTypeEvent.createQuestTypeEvent(
      2,
      2,
      2000,
      "Test Event 2",
      "Description 2",
      10,
      Math.floor(Date.now() / 1000),
      Math.floor(Date.now() / 1000) + 7200
    );

    const count = await questTypeEvent.getQuestTypeEventCount();
    expect(count).to.equal(2);
  });

  it("should get quest type event by index", async function () {
    await questTypeEvent.createQuestTypeEvent(
      1,
      1,
      1000,
      "Test Event 1",
      "Description 1",
      5,
      Math.floor(Date.now() / 1000),
      Math.floor(Date.now() / 1000) + 3600
    );
    await questTypeEvent.createQuestTypeEvent(
      2,
      2,
      2000,
      "Test Event 2",
      "Description 2",
      10,
      Math.floor(Date.now() / 1000),
      Math.floor(Date.now() / 1000) + 7200
    );

    const event = await questTypeEvent.getQuestTypeEventByIndex(0);
    expect(event.name).to.equal("Test Event 1");
  });
});

