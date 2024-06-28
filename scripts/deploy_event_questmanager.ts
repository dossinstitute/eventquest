import { ethers } from 'hardhat';

async function main() {
  const qm = await ethers.deployContract('QuestManager');

  await qm.waitForDeployment();

  console.log('QuestManager Contract Deployed at ' + qm.target);

  const eventManager = await ethers.deployContract('EventsManager', [qm.target]);

  await eventManager.waitForDeployment();

  console.log('EventManager Contract Deployed at ' + eventManager.target);

  const userManager = await ethers.deployContract('UserManager', [qm.target]);

  await userManager.waitForDeployment();

  console.log('UserManager Contract Deployed at ' + userManager.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
