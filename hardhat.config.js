require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.30",
  networks: {
    hardhat: {},

    // Local "source" chain
    source: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },

    // Local "destination" chain
    destination: {
      url: "http://127.0.0.1:8546",
      chainId: 31338,
    },

    // Sepolia Testnet
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/-PcQLnYMYTX3Pbn_c_HdY",
      chainId: 11155111,
      accounts: [process.env.PRIVATE_KEY], // Replace with your wallet private key
    },

    // Arbitrum Testnet
    arbitrumTestnet: {
      url: "https://sepolia-rollup.arbitrum.io/rpc", // Replace with your Alchemy API key
      chainId: 421614,
      accounts: [process.env.PRIVATE_KEY], // Replace with your wallet private key
    },
  },
};