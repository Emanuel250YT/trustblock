require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    // Citrea Bitcoin Rollup Networks
    citrea_devnet: {
      url: "https://rpc.devnet.citrea.xyz",
      chainId: 5115,
      accounts: process.env.CITREA_PRIVATE_KEY && process.env.CITREA_PRIVATE_KEY.length === 66 ? [process.env.CITREA_PRIVATE_KEY] : [],
      gasPrice: 20000000000,
      gas: 6000000
    },
    citrea_testnet: {
      url: "https://rpc.testnet.citrea.xyz",
      chainId: 5115,
      accounts: process.env.CITREA_PRIVATE_KEY && process.env.CITREA_PRIVATE_KEY.length === 66 ? [process.env.CITREA_PRIVATE_KEY] : [],
      gasPrice: 20000000000,
      gas: 6000000
    },
    citrea_mainnet: {
      url: process.env.CITREA_MAINNET_RPC_URL || "https://rpc.citrea.xyz",
      chainId: 62298,
      accounts: process.env.CITREA_PRIVATE_KEY && process.env.CITREA_PRIVATE_KEY.length === 66 ? [process.env.CITREA_PRIVATE_KEY] : [],
      gasPrice: 20000000000,
      gas: 6000000
    },
    // Original TrueBlock Networks
    base: {
      url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 66 ? [process.env.PRIVATE_KEY] : []
    },
    "base-sepolia": {
      url: "https://sepolia.base.org",
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 66 ? [process.env.PRIVATE_KEY] : []
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};
