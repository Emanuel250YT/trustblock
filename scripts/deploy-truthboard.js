const { ethers } = require('hardhat');

async function main() {
  console.log('🚀 Deploying TruthBoard to Citrea...');

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with account:', deployer.address);

  // Get account balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log('Account balance:', ethers.formatEther(balance), 'ETH');

  // Deploy TruthBoard contract
  console.log('\n📄 Deploying TruthBoard contract...');
  const TruthBoard = await ethers.getContractFactory('TruthBoard');

  // TruthBoard constructor doesn't require parameters
  const truthBoard = await TruthBoard.deploy();

  await truthBoard.waitForDeployment();
  const truthBoardAddress = await truthBoard.getAddress();

  console.log('✅ TruthBoard deployed to:', truthBoardAddress);

  // Verify deployment
  console.log('\n🔍 Verifying deployment...');
  const owner = await truthBoard.owner();
  const isPaused = await truthBoard.paused();

  console.log('Contract Owner:', owner);
  console.log('Contract Paused:', isPaused);

  // Save deployment info
  const deploymentInfo = {
    network: 'citrea',
    contractAddress: truthBoardAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await deployer.provider.getBlockNumber(),
    owner: owner,
    paused: isPaused
  };

  console.log('\n📋 Deployment Summary:');
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log('\n🎉 Deployment completed successfully!');
  console.log('📝 Add this to your .env file:');
  console.log(`TRUTHBOARD_CONTRACT_ADDRESS=${truthBoardAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
