async function main() {
  const QuestTypeEvents = await ethers.getContractFactory("QuestTypeEvent");
  const questTypeEvents = await QuestTypeEvents.deploy();
  await questTypeEvents.waitForDeployment();
  console.log("QuestTypeEvent deployed to:", questTypeEvents.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

