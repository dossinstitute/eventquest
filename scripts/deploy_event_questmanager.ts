async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Deploying Events contract...");
  const Events = await ethers.getContractFactory("Events");
  const events = await Events.deploy();
  await events.waitForDeployment();
  console.log("Events contract deployed to:", await events.getAddress());

  console.log("Deploying Users contract...");
  const Users = await ethers.getContractFactory("Users");
  const users = await Users.deploy();
  await users.waitForDeployment();
  console.log("Users contract deployed to:", await users.getAddress());

  console.log("Deploying Sponsors contract...");
  const Sponsors = await ethers.getContractFactory("Sponsors");
  const sponsors = await Sponsors.deploy();
  await sponsors.waitForDeployment();
  console.log("Sponsors contract deployed to:", await sponsors.getAddress());

  console.log("Deploying QuestEvents contract...");
  const QuestEvents = await ethers.getContractFactory("QuestEvents");
  const questEvents = await QuestEvents.deploy();
  await questEvents.waitForDeployment();
  console.log("QuestEvents contract deployed to:", await questEvents.getAddress());

  console.log("Deploying RewardPools contract...");
  const RewardPools = await ethers.getContractFactory("RewardPools");
  const rewardPools = await RewardPools.deploy(await questEvents.getAddress());
  await rewardPools.waitForDeployment();
  console.log("RewardPools contract deployed to:", await rewardPools.getAddress());

  console.log("Deploying UserQuestEvents contract...");
  const UserQuestEvents = await ethers.getContractFactory("UserQuestEvents");
  const userQuestEvents = await UserQuestEvents.deploy();
  await userQuestEvents.waitForDeployment();
  console.log("UserQuestEvents contract deployed to:", await userQuestEvents.getAddress());

  console.log("Deploying Rewards contract...");
  const Rewards = await ethers.getContractFactory("Rewards");
  const rewards = await Rewards.deploy();
  await rewards.waitForDeployment();
  console.log("Rewards contract deployed to:", await rewards.getAddress());

  console.log("Deploying QuestManager contract...");
  const QuestManager = await ethers.getContractFactory("QuestManager");
  const questManager = await QuestManager.deploy();
  await questManager.waitForDeployment();
  console.log("QuestManager contract deployed to:", await questManager.getAddress());

  console.log("Deploying LocationQuest contract...");
  const LocationQuest = await ethers.getContractFactory("LocationQuest");
  const locationQuest = await LocationQuest.deploy(
    await questManager.getAddress(),
    "Location Quest",
    "Location Type"
  );
  await locationQuest.waitForDeployment();
  console.log("LocationQuest contract deployed to:", await locationQuest.getAddress());

  console.log("Deploying ContentCreatorQuest contract...");
  const ContentCreatorQuest = await ethers.getContractFactory("ContentCreatorQuest");
  const contentCreatorQuest = await ContentCreatorQuest.deploy(
    await questManager.getAddress(),
    "Content Creator Quest",
    "Content Type"
  );
  await contentCreatorQuest.waitForDeployment();
  console.log("ContentCreatorQuest contract deployed to:", await contentCreatorQuest.getAddress());

  console.log("Deploying ProofOfKnowledgeQuest contract...");
  const ProofOfKnowledgeQuest = await ethers.getContractFactory("ProofOfKnowledgeQuest");
  const proofOfKnowledgeQuest = await ProofOfKnowledgeQuest.deploy(
    await questManager.getAddress(),
    "Proof of Knowledge Quest",
    "Knowledge Type"
  );
  await proofOfKnowledgeQuest.waitForDeployment();
  console.log("ProofOfKnowledgeQuest contract deployed to:", await proofOfKnowledgeQuest.getAddress());

  console.log("Deploying EventQuestManagement contract...");
  const EventQuestManagement = await ethers.getContractFactory("EventQuestManagement");
  const eventQuestManagement = await EventQuestManagement.deploy(
    await events.getAddress(),
    await locationQuest.getAddress(),
    await users.getAddress(),
    await sponsors.getAddress(),
    await questEvents.getAddress(),
    await userQuestEvents.getAddress(),
    await rewards.getAddress(),
    await rewardPools.getAddress()
  );
  await eventQuestManagement.waitForDeployment();
  console.log("EventQuestManagement contract deployed to:", await eventQuestManagement.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

