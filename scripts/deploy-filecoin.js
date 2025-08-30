const { ethers } = require('hardhat');

async function main() {
  console.log('🚀 Deploying TruthBoardFilecoin to Filecoin Virtual Machine...');

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with account:', deployer.address);

  // Get account balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log('Account balance:', ethers.formatEther(balance), 'FIL');

  // Deploy TruthBoardFilecoin contract
  console.log('\n📄 Deploying TruthBoardFilecoin contract...');
  const TruthBoardFilecoin = await ethers.getContractFactory('TruthBoardFilecoin');

  // Constructor parameters
  const filecoinAPI = '0x0000000000000000000000000000000000000000'; // Placeholder for Filecoin API contract

  const truthBoardFilecoin = await TruthBoardFilecoin.deploy(filecoinAPI);

  await truthBoardFilecoin.waitForDeployment();
  const truthBoardFilecoinAddress = await truthBoardFilecoin.getAddress();

  console.log('✅ TruthBoardFilecoin deployed to:', truthBoardFilecoinAddress);

  // Verify deployment and configure initial policies
  console.log('\n🔍 Verifying deployment and setting up policies...');

  // Get initial configuration
  const newsPolicy = await truthBoardFilecoin.archivePolicies(0); // NEWS_CONTENT
  const evidencePolicy = await truthBoardFilecoin.archivePolicies(1); // VALIDATION_EVIDENCE

  console.log('News Archive Policy:');
  console.log('  Min Reputation Score:', newsPolicy.minReputationScore.toString());
  console.log('  Min Validation Score:', newsPolicy.minValidationScore.toString());
  console.log('  Storage Duration:', (Number(newsPolicy.storageDuration) / (365 * 24 * 60 * 60)).toFixed(1), 'years');
  console.log('  Auto Archive:', newsPolicy.autoArchive);
  console.log('  Community Funded:', newsPolicy.communityFunded);

  console.log('\nEvidence Archive Policy:');
  console.log('  Min Reputation Score:', evidencePolicy.minReputationScore.toString());
  console.log('  Min Validation Score:', evidencePolicy.minValidationScore.toString());
  console.log('  Storage Duration:', (Number(evidencePolicy.storageDuration) / (365 * 24 * 60 * 60)).toFixed(1), 'years');
  console.log('  Auto Archive:', evidencePolicy.autoArchive);
  console.log('  Community Funded:', evidencePolicy.communityFunded);

  // Fund the community pool with some initial FIL
  console.log('\n💰 Funding community pool...');
  const fundingAmount = ethers.parseEther('10'); // 10 FIL
  const fundTx = await truthBoardFilecoin.fundCommunityPool({ value: fundingAmount });
  await fundTx.wait();

  const communityPool = await truthBoardFilecoin.communityPool();
  console.log('Community Pool Funded:', ethers.formatEther(communityPool), 'FIL');

  // Test creating a mock storage deal
  console.log('\n🧪 Testing storage deal creation...');
  try {
    const testContentHash = '0x' + '1'.repeat(64);
    const testCid = 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi';
    const testSize = 1024 * 1024; // 1MB
    const testDuration = 365 * 24 * 60 * 60; // 1 year

    const testDealTx = await truthBoardFilecoin.createStorageDeal(
      testContentHash,
      testCid,
      testSize,
      testDuration,
      0, // NEWS_CONTENT
      deployer.address
    );

    const receipt = await testDealTx.wait();
    console.log('✅ Test storage deal created successfully');
    console.log('Gas used:', receipt.gasUsed.toString());

    // Verify the deal was created
    const deal = await truthBoardFilecoin.getStorageDeal(testContentHash);
    console.log('Deal ID:', deal.dealId.toString());
    console.log('Deal CID:', deal.cid);
    console.log('Deal Size:', deal.size.toString(), 'bytes');
    console.log('Deal Price:', ethers.formatEther(deal.price), 'FIL');

  } catch (error) {
    console.log('⚠️  Test deal creation failed (expected in some networks):', error.message);
  }

  // Save deployment info
  const deploymentInfo = {
    network: 'filecoin',
    contractAddress: truthBoardFilecoinAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await deployer.provider.getBlockNumber(),
    communityPoolFunded: ethers.formatEther(communityPool),
    filecoinAPI: filecoinAPI,
    policies: {
      newsContent: {
        minReputationScore: newsPolicy.minReputationScore.toString(),
        minValidationScore: newsPolicy.minValidationScore.toString(),
        storageDurationYears: (Number(newsPolicy.storageDuration) / (365 * 24 * 60 * 60)).toFixed(1),
        autoArchive: newsPolicy.autoArchive,
        communityFunded: newsPolicy.communityFunded
      },
      validationEvidence: {
        minReputationScore: evidencePolicy.minReputationScore.toString(),
        minValidationScore: evidencePolicy.minValidationScore.toString(),
        storageDurationYears: (Number(evidencePolicy.storageDuration) / (365 * 24 * 60 * 60)).toFixed(1),
        autoArchive: evidencePolicy.autoArchive,
        communityFunded: evidencePolicy.communityFunded
      }
    }
  };

  console.log('\n📋 Deployment Summary:');
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log('\n🎉 Deployment completed successfully!');
  console.log('📝 Add this to your .env file:');
  console.log(`TRUTHBOARD_FILECOIN_CONTRACT_ADDRESS=${truthBoardFilecoinAddress}`);

  console.log('\n🔗 Integration Steps:');
  console.log('1. Configure Web3.Storage token for IPFS');
  console.log('2. Set up Estuary API for backup storage');
  console.log('3. Connect with TruthBoard on Citrea');
  console.log('4. Fund community pool for auto-archiving');
  console.log('5. Set up monitoring for storage deals');

  console.log('\n📚 Usage Examples:');
  console.log('Archive news: POST /api/filecoin/archive/news');
  console.log('Store evidence: POST /api/filecoin/evidence/store');
  console.log('Check status: GET /api/filecoin/status/:contentHash');
  console.log('Network info: GET /api/filecoin/network/status');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
