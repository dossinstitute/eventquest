async function main() {
  const QuestTypes = await ethers.getContractFactory("QuestTypes");
  const questTypes = await QuestTypes.deploy();
  await questTypes.waitForDeployment();
  console.log("QuestTypes deployed to:", questTypes.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

