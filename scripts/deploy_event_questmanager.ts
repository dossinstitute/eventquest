async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Events = await ethers.getContractFactory("Events");
  const events = await Events.deploy();
  await events.waitForDeployment();

  const Quests = await ethers.getContractFactory("Quests");
  const quests = await Quests.deploy();
  await quests.waitForDeployment();

  const Users = await ethers.getContractFactory("Users");
  const users = await Users.deploy();
  await users.waitForDeployment();

  const Sponsors = await ethers.getContractFactory("Sponsors");
  const sponsors = await Sponsors.deploy();
  await sponsors.waitForDeployment();

  const QuestEvents = await ethers.getContractFactory("QuestEvents");
  const questEvents = await QuestEvents.deploy();
  await questEvents.waitForDeployment();

  const RewardPools = await ethers.getContractFactory("RewardPools");
  const rewardPools = await RewardPools.deploy(await questEvents.getAddress());
  await rewardPools.waitForDeployment();

  const UserQuestEvents = await ethers.getContractFactory("UserQuestEvents");
  const userQuestEvents = await UserQuestEvents.deploy();
  await userQuestEvents.waitForDeployment();

  const Rewards = await ethers.getContractFactory("Rewards");
  const rewards = await Rewards.deploy();
  await rewards.waitForDeployment();

  const EventQuestManagement = await ethers.getContractFactory("EventQuestManagement");
  const eventQuestManagement = await EventQuestManagement.deploy(
    await events.getAddress(),
    await quests.getAddress(),
    await users.getAddress(),
    await sponsors.getAddress(),
    await questEvents.getAddress(),
    await userQuestEvents.getAddress(),
    await rewards.getAddress(),
    await rewardPools.getAddress()
  );
  await eventQuestManagement.waitForDeployment();

  console.log("Events contract deployed to:", await events.getAddress());
  console.log("Quests contract deployed to:", await quests.getAddress());
  console.log("Users contract deployed to:", await users.getAddress());
  console.log("Sponsors contract deployed to:", await sponsors.getAddress());
  console.log("QuestEvents contract deployed to:", await questEvents.getAddress());
  console.log("UserQuestEvents contract deployed to:", await userQuestEvents.getAddress());
  console.log("Rewards contract deployed to:", await rewards.getAddress());
  console.log("RewardPools contract deployed to:", await rewardPools.getAddress());
  console.log("EventQuestManagement contract deployed to:", await eventQuestManagement.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

