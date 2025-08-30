const { ethers } = require('hardhat');

async function main() {
  console.log('🔍 Checking Filecoin Calibration testnet balance...');

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log('Account:', deployer.address);

  // Get account balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log('Balance:', ethers.formatEther(balance), 'tFIL');

  // Get network info
  const network = await deployer.provider.getNetwork();
  console.log('Network:', network.name);
  console.log('Chain ID:', network.chainId.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
