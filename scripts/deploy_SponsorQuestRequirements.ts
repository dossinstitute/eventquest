async function main() {
  const SponsorQuestRequirements = await ethers.getContractFactory("SponsorQuestRequirements");
  const sponsorQuestRequirements = await SponsorQuestRequirements.deploy();
  await sponsorQuestRequirements.waitForDeployment();
  console.log("SponsorQuestRequirements deployed to:", sponsorQuestRequirements.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

