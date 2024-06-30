async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Events = await ethers.getContractFactory("Events");
  const events = await Events.deploy();
  await events.deployed();

  const Quests = await ethers.getContractFactory("Quests");
  const quests = await Quests.deploy();
  await quests.deployed();

  const Users = await ethers.getContractFactory("Users");
  const users = await Users.deploy();
  await users.deployed();

  const Sponsors = await ethers.getContractFactory("Sponsors");
  const sponsors = await Sponsors.deploy();
  await sponsors.deployed();

  const QuestEvents = await ethers.getContractFactory("QuestEvents");
  const questEvents = await QuestEvents.deploy();
  await questEvents.deployed();

  const RewardPools = await ethers.getContractFactory("RewardPools");
  const rewardPools = await RewardPools.deploy(questEvents.address);
  await rewardPools.deployed();

  const UserQuestEvents = await ethers.getContractFactory("UserQuestEvents");
  const userQuestEvents = await UserQuestEvents.deploy();
  await userQuestEvents.deployed();

  const Rewards = await ethers.getContractFactory("Rewards");
  const rewards = await Rewards.deploy();
  await rewards.deployed();

  const EventQuestManagement = await ethers.getContractFactory("EventQuestManagement");
  const eventQuestManagement = await EventQuestManagement.deploy(
    events.address,
    quests.address,
    users.address,
    sponsors.address,
    questEvents.address,
    userQuestEvents.address,
    rewards.address,
    rewardPools.address
  );
  await eventQuestManagement.deployed();

  console.log("Events contract deployed to:", events.address);
  console.log("Quests contract deployed to:", quests.address);
  console.log("Users contract deployed to:", users.address);
  console.log("Sponsors contract deployed to:", sponsors.address);
  console.log("QuestEvents contract deployed to:", questEvents.address);
  console.log("UserQuestEvents contract deployed to:", userQuestEvents.address);
  console.log("Rewards contract deployed to:", rewards.address);
  console.log("RewardPools contract deployed to:", rewardPools.address);
  console.log("EventQuestManagement contract deployed to:", eventQuestManagement.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

