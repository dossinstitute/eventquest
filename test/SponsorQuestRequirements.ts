import { expect } from "chai";
import { ethers } from "hardhat";
import { SponsorQuestRequirements } from "../typechain-types";

describe("SponsorQuestRequirements Contract", function () {
  let sponsorQuestRequirements: SponsorQuestRequirements;

  beforeEach(async function () {
    const SponsorQuestRequirements = await ethers.getContractFactory("SponsorQuestRequirements");
    sponsorQuestRequirements = (await SponsorQuestRequirements.deploy()) as SponsorQuestRequirements;
    await sponsorQuestRequirements.waitForDeployment();
  });

  it("should create a new sponsor quest requirement", async function () {
    const tx = await sponsorQuestRequirements.createSponsorQuestRequirement(
      1,
      "Test Hashtags",
      true
    );
    await tx.wait();
    const sqr = await sponsorQuestRequirements.readSponsorQuestRequirement(1);
    expect(sqr.sponsorHashtags).to.equal("Test Hashtags");
  });

  it("should read a sponsor quest requirement", async function () {
    const tx = await sponsorQuestRequirements.createSponsorQuestRequirement(
      1,
      "Test Hashtags",
      true
    );
    await tx.wait();
    const sqr = await sponsorQuestRequirements.readSponsorQuestRequirement(1);
    expect(sqr.sponsorHashtags).to.equal("Test Hashtags");
  });

  it("should update a sponsor quest requirement", async function () {
    let tx = await sponsorQuestRequirements.createSponsorQuestRequirement(
      1,
      "Test Hashtags",
      true
    );
    await tx.wait();

    tx = await sponsorQuestRequirements.updateSponsorQuestRequirement(
      1,
      2,
      "Updated Hashtags",
      false
    );
    await tx.wait();

    const sqr = await sponsorQuestRequirements.readSponsorQuestRequirement(1);
    expect(sqr.sponsorHashtags).to.equal("Updated Hashtags");
  });

  it("should delete a sponsor quest requirement", async function () {
    const tx = await sponsorQuestRequirements.createSponsorQuestRequirement(
      1,
      "Test Hashtags",
      true
    );
    await tx.wait();

    await sponsorQuestRequirements.deleteSponsorQuestRequirement(1);

    await expect(sponsorQuestRequirements.readSponsorQuestRequirement(1)).to.be.revertedWith("SponsorQuestRequirement does not exist");
  });

  it("should list sponsor quest requirements", async function () {
    await sponsorQuestRequirements.createSponsorQuestRequirement(
      1,
      "Test Hashtags 1",
      true
    );
    await sponsorQuestRequirements.createSponsorQuestRequirement(
      2,
      "Test Hashtags 2",
      false
    );

    const sqrs = await sponsorQuestRequirements.listSponsorQuestRequirements();
    expect(sqrs.length).to.equal(2);
    expect(sqrs[0].sponsorHashtags).to.equal("Test Hashtags 1");
    expect(sqrs[1].sponsorHashtags).to.equal("Test Hashtags 2");
  });

  it("should get sponsor quest requirement count", async function () {
    await sponsorQuestRequirements.createSponsorQuestRequirement(
      1,
      "Test Hashtags 1",
      true
    );
    await sponsorQuestRequirements.createSponsorQuestRequirement(
      2,
      "Test Hashtags 2",
      false
    );

    const count = await sponsorQuestRequirements.getSponsorQuestRequirementCount();
    expect(count).to.equal(2);
  });

  it("should get sponsor quest requirement by index", async function () {
    await sponsorQuestRequirements.createSponsorQuestRequirement(
      1,
      "Test Hashtags 1",
      true
    );
    await sponsorQuestRequirements.createSponsorQuestRequirement(
      2,
      "Test Hashtags 2",
      false
    );

    const sqr = await sponsorQuestRequirements.getSponsorQuestRequirementByIndex(0);
    expect(sqr.sponsorHashtags).to.equal("Test Hashtags 1");
  });
});

