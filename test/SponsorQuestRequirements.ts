const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SponsorQuestRequirements Contract", function () {
  let SponsorQuestRequirements;
  let sponsorQuestRequirements;
  let owner;

  before(async function () {
    [owner] = await ethers.getSigners();
  });

  beforeEach(async function () {
    // Deploy a new contract before each test
    SponsorQuestRequirements = await ethers.getContractFactory("SponsorQuestRequirements");
    sponsorQuestRequirements = await SponsorQuestRequirements.deploy();
    await sponsorQuestRequirements.waitForDeployment();

    // Create initial sponsor quest requirements for consistent testing
    await sponsorQuestRequirements.createSponsorQuestRequirement(
      1,
      1,
      "hashtag1,hashtag2",
      true
    );

    await sponsorQuestRequirements.createSponsorQuestRequirement(
      2,
      2,
      "hashtag3,hashtag4",
      false
    );
  });

  it("should create a new sponsor quest requirement", async function () {
    const tx = await sponsorQuestRequirements.createSponsorQuestRequirement(
      3,
      3,
      "hashtag5,hashtag6",
      true
    );
    await tx.wait();

    const sqr = await sponsorQuestRequirements.readSponsorQuestRequirement(3); // Third sponsor quest requirement created
    expect(sqr.questEventId).to.equal(3);
    expect(sqr.questTypeId).to.equal(3);
    expect(sqr.sponsorHashtags).to.equal("hashtag5,hashtag6");
    expect(sqr.sponsorHashtagsRequired).to.be.true;
  });

  it("should read a sponsor quest requirement", async function () {
    const sqr = await sponsorQuestRequirements.readSponsorQuestRequirement(1);
    expect(sqr.questEventId).to.equal(1);
    expect(sqr.questTypeId).to.equal(1);
    expect(sqr.sponsorHashtags).to.equal("hashtag1,hashtag2");
    expect(sqr.sponsorHashtagsRequired).to.be.true;
  });

  it("should update a sponsor quest requirement", async function () {
    const tx = await sponsorQuestRequirements.updateSponsorQuestRequirement(
      1,
      1,
      1,
      "updatedHashtag1,updatedHashtag2",
      false
    );
    await tx.wait();

    const sqr = await sponsorQuestRequirements.readSponsorQuestRequirement(1);
    expect(sqr.questEventId).to.equal(1);
    expect(sqr.questTypeId).to.equal(1);
    expect(sqr.sponsorHashtags).to.equal("updatedHashtag1,updatedHashtag2");
    expect(sqr.sponsorHashtagsRequired).to.be.false;
  });

  it("should delete a sponsor quest requirement", async function () {
    const tx = await sponsorQuestRequirements.deleteSponsorQuestRequirement(1);
    await tx.wait();

    await expect(sponsorQuestRequirements.readSponsorQuestRequirement(1)).to.be.revertedWith("SponsorQuestRequirement does not exist");
  });

  it("should list sponsor quest requirements", async function () {
    const sqrList = await sponsorQuestRequirements.listSponsorQuestRequirements();
    expect(sqrList.length).to.equal(2);
    expect(sqrList[0].sponsorHashtags).to.equal("hashtag1,hashtag2");
    expect(sqrList[1].sponsorHashtags).to.equal("hashtag3,hashtag4");
  });

  it("should get sponsor quest requirement count", async function () {
    const count = await sponsorQuestRequirements.getSponsorQuestRequirementCount();
    expect(count).to.equal(2);
  });

  it("should get a sponsor quest requirement by index", async function () {
    const sqr = await sponsorQuestRequirements.getSponsorQuestRequirementByIndex(1);
    expect(sqr.sponsorHashtags).to.equal("hashtag1,hashtag2");
  });
});

