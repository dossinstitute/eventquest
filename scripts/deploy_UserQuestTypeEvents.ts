async function main() {
  const UserQuestTypeEvents = await ethers.getContractFactory("UserQuestTypeEvents");
  const questTypeEvents = await UserQuestTypeEvents.deploy();
  await questTypeEvents.waitForDeployment();
  console.log("UserQuestTypeEvents deployed to:", questTypeEvents.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

