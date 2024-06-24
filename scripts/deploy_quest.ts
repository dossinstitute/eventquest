import { ethers } from 'hardhat';

async function main() {
  const qm = await ethers.deployContract('QuestManager');

  await qm.waitForDeployment();

  console.log('QuestManager Contract Deployed at ' + qm.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
