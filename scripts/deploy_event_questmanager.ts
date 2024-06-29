import { ethers } from 'hardhat';

async function main() {
  // Deploy QuestManager contract
  const qm = await ethers.deployContract('QuestManager');
  await qm.waitForDeployment();
  console.log('QuestManager Contract Deployed at ' + qm.target);

  // Deploy EventsManager contract with QuestManager address
  const eventManager = await ethers.deployContract('EventsManager', [qm.target]);
  await eventManager.waitForDeployment();
  console.log('EventManager Contract Deployed at ' + eventManager.target);

  // Deploy UserManager contract with QuestManager address
  const userManager = await ethers.deployContract('UserManager', [qm.target]);
  await userManager.waitForDeployment();
  console.log('UserManager Contract Deployed at ' + userManager.target);

  // Deploy RewardDistribution contract with UserManager and QuestManager addresses
  const rewardDistribution = await ethers.deployContract('RewardDistribution', [userManager.target, qm.target]);
  await rewardDistribution.waitForDeployment();
  console.log('RewardDistribution Contract Deployed at ' + rewardDistribution.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

