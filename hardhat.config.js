require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
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
      accounts: process.env.CITREA_PRIVATE_KEY && process.env.CITREA_PRIVATE_KEY.length >= 64 ? [process.env.CITREA_PRIVATE_KEY.startsWith('0x') ? process.env.CITREA_PRIVATE_KEY : '0x' + process.env.CITREA_PRIVATE_KEY] : [],
      gasPrice: 20000000000,
      gas: 6000000
    },
    citrea_testnet: {
      url: "https://rpc.testnet.citrea.xyz",
      chainId: 5115,
      accounts: process.env.CITREA_PRIVATE_KEY && process.env.CITREA_PRIVATE_KEY.length >= 64 ? [process.env.CITREA_PRIVATE_KEY.startsWith('0x') ? process.env.CITREA_PRIVATE_KEY : '0x' + process.env.CITREA_PRIVATE_KEY] : [],
      gasPrice: 1000000000, // Reduced gas price (1 gwei)
      gas: 3000000 // Reduced gas limit
    },
    citrea_mainnet: {
      url: process.env.CITREA_MAINNET_RPC_URL || "https://rpc.citrea.xyz",
      chainId: 62298,
      accounts: process.env.CITREA_PRIVATE_KEY && process.env.CITREA_PRIVATE_KEY.length === 66 ? [process.env.CITREA_PRIVATE_KEY] : [],
      gasPrice: 20000000000,
      gas: 6000000
    },
    // Filecoin Virtual Machine Networks
    filecoin_mainnet: {
      url: process.env.FILECOIN_RPC_URL || "https://api.node.glif.io/rpc/v1",
      chainId: 314,
      accounts: process.env.FILECOIN_PRIVATE_KEY && process.env.FILECOIN_PRIVATE_KEY.length === 66 ? [process.env.FILECOIN_PRIVATE_KEY] : [],
      gasPrice: 200000000000, // 200 Gwei
      gas: 10000000
    },
    filecoin_testnet: {
      url: "https://api.calibration.node.glif.io/rpc/v1",
      chainId: 314159,
      accounts: process.env.FILECOIN_PRIVATE_KEY && process.env.FILECOIN_PRIVATE_KEY.length === 66 ? [process.env.FILECOIN_PRIVATE_KEY] : [],
      gasPrice: 200000000000,
      gas: 10000000
    },
    // Original TrueBlock Networks
    base: {
      url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length >= 64 ? [process.env.PRIVATE_KEY.startsWith('0x') ? process.env.PRIVATE_KEY : '0x' + process.env.PRIVATE_KEY] : []
    },
    "base-sepolia": {
      url: "https://sepolia.base.org",
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length >= 64 ? [process.env.PRIVATE_KEY.startsWith('0x') ? process.env.PRIVATE_KEY : '0x' + process.env.PRIVATE_KEY] : []
    },
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length >= 64 ? [process.env.PRIVATE_KEY.startsWith('0x') ? process.env.PRIVATE_KEY : '0x' + process.env.PRIVATE_KEY] : []
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length >= 64 ? [process.env.PRIVATE_KEY.startsWith('0x') ? process.env.PRIVATE_KEY : '0x' + process.env.PRIVATE_KEY] : [],
      gasPrice: 20000000000
    },
    // Zama FHE Networks (using Sepolia for FHE testing)
    zama_sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length >= 64 ? [process.env.PRIVATE_KEY.startsWith('0x') ? process.env.PRIVATE_KEY : '0x' + process.env.PRIVATE_KEY] : [],
      gasPrice: 2000000000, // 2 gwei
      gas: 8000000
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
