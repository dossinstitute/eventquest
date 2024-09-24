// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
//
// const config: HardhatUserConfig = {
//   solidity: "0.8.24",
// };
//
// export default config;

import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.23',
  },
  networks: {
    // // for mainnet
    // 'base-mainnet': {
    //   url: 'https://mainnet.base.org',
    //   accounts: [process.env.WALLET_KEY as string],
    //   gasPrice: 1000000000,
    // },
    // // for testnet
    // 'base-sepolia': {
    //   url: 'https://sepolia.base.org',
    //   accounts: [process.env.WALLET_KEY as string],
    //   gasPrice: 1000000000,
    // },
    // // for local dev environment
    // 'base-local': {
    //   url: 'http://localhost:8545',
    //   accounts: [process.env.WALLET_KEY as string],
    //   gasPrice: 1000000000,
    // },
      // rskMainnet: {
      //   url: "https://public-node.rsk.co",
      //   chainId: 30,
      //   gasPrice: 60000000,
      //   accounts: [process.env.ROOTSTOCK_MAINNET_PRIVATE_KEY]
      // },
      rskTestnet: {
        url: "https://public-node.testnet.rsk.co",
        chainId: 31, 
        gasPrice: 60000000,
        accounts: [process.env.ROOTSTOCK_TESTNET_PRIVATE_KEY]
      },
  },
  defaultNetwork: 'hardhat',
	etherscan: {
		apiKey: {
			"base-sepolia": "PLACEHOLDER_STRING"
		},
		customChains: [
			{
				network: "base-sepolia",
				chainId: 84532,
				urls: {
					apiURL: "https://api-sepolia.basescan.org/api",
					browserURL: "https://sepolia.basescan.org"
				}
			}
		]
	},
};

export default config;
