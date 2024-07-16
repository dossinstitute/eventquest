async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Deploying QuestManager contract...");
  const QuestManager = await ethers.getContractFactory("QuestManager");
  const questManager = await QuestManager.deploy();
  await questManager.waitForDeployment();
  console.log("QuestManager contract deployed to:", await questManager.getAddress());

  console.log("Deploying ContentCreatorQuest contract...");
  const ContentCreatorQuest = await ethers.getContractFactory("ContentCreatorQuest");
  const contentCreatorQuest = await ContentCreatorQuest.deploy(
    await questManager.getAddress(),
    "Content Creator Quest",
    "Content Type"
  );
  await contentCreatorQuest.waitForDeployment();
  console.log("ContentCreatorQuest contract deployed to:", await contentCreatorQuest.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

