require("@nomicfoundation/hardhat-toolbox");

const ROOTSTOCK_TESTNET_RPC_URL = "https://public-node.testnet.rsk.co";
const ROOTSTOCK_MAINNET_RPC_URL = "https://public-node.rsk.co";

// // // Replace with your own private key for deployments
const PRIVATE_KEY = "f19fb7ab9ff1613b3bc7e85be2efb5df44c3f0bfe4b20056c9d7d08e13f22005";

module.exports = {
  solidity: "0.8.24",
  networks: {
    rootstock_testnet: {
      url: ROOTSTOCK_TESTNET_RPC_URL, 
      accounts: [PRIVATE_KEY],
      chainId: 31,
    },
    rootstock_mainnet: {
      url: ROOTSTOCK_MAINNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 30,
    },
  },
};

// require("@nomiclabs/hardhat-ethers");
// require("@nomiclabs/hardhat-etherscan");

// module.exports = {
//   solidity: "0.8.24",
//   networks: {
//     rootstock_testnet: {
//       url: "https://testnet.rootstock.io/rpc",
//       accounts: [PRIVATE_KEY],
//     }
//   }
// };
