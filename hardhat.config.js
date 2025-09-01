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
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
};
