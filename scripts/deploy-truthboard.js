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

  // Constructor parameters
  const minStake = ethers.parseEther('0.01'); // 0.01 ETH minimum stake
  const validationThreshold = 70; // 70% consensus required
  const rewardPercentage = 10; // 10% reward for validators

  const truthBoard = await TruthBoard.deploy(
    minStake,
    validationThreshold,
    rewardPercentage
  );

  await truthBoard.waitForDeployment();
  const truthBoardAddress = await truthBoard.getAddress();

  console.log('✅ TruthBoard deployed to:', truthBoardAddress);

  // Verify deployment
  console.log('\n🔍 Verifying deployment...');
  const minStakeFromContract = await truthBoard.minStake();
  const thresholdFromContract = await truthBoard.validationThreshold();
  const rewardFromContract = await truthBoard.rewardPercentage();

  console.log('Min Stake:', ethers.formatEther(minStakeFromContract), 'ETH');
  console.log('Validation Threshold:', thresholdFromContract.toString(), '%');
  console.log('Reward Percentage:', rewardFromContract.toString(), '%');

  // Save deployment info
  const deploymentInfo = {
    network: 'citrea',
    contractAddress: truthBoardAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await deployer.provider.getBlockNumber(),
    minStake: ethers.formatEther(minStakeFromContract),
    validationThreshold: thresholdFromContract.toString(),
    rewardPercentage: rewardFromContract.toString()
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
