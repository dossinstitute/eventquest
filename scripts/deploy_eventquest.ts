import { ethers } from 'hardhat';

async function main() {
  // Deploy QuestManager contract
  const qm = await ethers.deployContract('EventQuestManagement');
  await qm.waitForDeployment();
  console.log('EventQuestManagement Contract Deployed at ' + qm.target);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

