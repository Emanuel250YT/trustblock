const { ethers } = require('hardhat');
const fs = require('fs');

async function main() {
  console.log('🚀 Desplegando contratos TrueBlock en Filecoin Mainnet...\n');

  // Configurar el proveedor para Filecoin
  const provider = new ethers.JsonRpcProvider(process.env.FILECOIN_RPC_URL);
  const wallet = new ethers.Wallet(process.env.FILECOIN_PRIVATE_KEY, provider);

  console.log('🔗 Conectando a Filecoin...');
  console.log(`📡 RPC URL: ${process.env.FILECOIN_RPC_URL}`);
  console.log(`💰 Deployer: ${wallet.address}`);

  // Verificar balance
  const balance = await provider.getBalance(wallet.address);
  console.log(`💳 Balance: ${ethers.formatEther(balance)} FIL\n`);

  if (balance === 0n) {
    console.log('❌ No hay fondos suficientes para el despliegue');
    console.log('💡 Necesitas FIL para desplegar en Filecoin mainnet');
    return;
  }

  // 1. Desplegar TrueBlockValidator
  console.log('📋 1. Desplegando TrueBlockValidator...');
  try {
    const TrueBlockValidator = await ethers.getContractFactory('TrueBlockValidator', wallet);
    const validator = await TrueBlockValidator.deploy();
    await validator.waitForDeployment();
    const validatorAddress = await validator.getAddress();
    console.log(`✅ TrueBlockValidator desplegado en: ${validatorAddress}\n`);

    // 2. Desplegar TruthBoard
    console.log('📋 2. Desplegando TruthBoard...');
    const TruthBoard = await ethers.getContractFactory('TruthBoard', wallet);
    const truthBoard = await TruthBoard.deploy();
    await truthBoard.waitForDeployment();
    const truthBoardAddress = await truthBoard.getAddress();
    console.log(`✅ TruthBoard desplegado en: ${truthBoardAddress}\n`);

    // 3. Desplegar TruthBoardFilecoin
    console.log('📋 3. Desplegando TruthBoardFilecoin...');
    const TruthBoardFilecoin = await ethers.getContractFactory('TruthBoardFilecoin', wallet);
    const truthBoardFilecoin = await TruthBoardFilecoin.deploy();
    await truthBoardFilecoin.waitForDeployment();
    const truthBoardFilecoinAddress = await truthBoardFilecoin.getAddress();
    console.log(`✅ TruthBoardFilecoin desplegado en: ${truthBoardFilecoinAddress}\n`);

    // Actualizar .env con las nuevas direcciones
    console.log('📄 Actualizando archivo .env...');

    let envContent = fs.readFileSync('.env', 'utf8');

    // Actualizar direcciones
    envContent = envContent.replace(
      /TRUTHBOARD_CONTRACT_ADDRESS=.*/,
      `TRUTHBOARD_CONTRACT_ADDRESS=${truthBoardAddress}`
    );
    envContent = envContent.replace(
      /TRUTHBOARD_FILECOIN_CONTRACT_ADDRESS=.*/,
      `TRUTHBOARD_FILECOIN_CONTRACT_ADDRESS=${truthBoardFilecoinAddress}`
    );

    // Agregar dirección del validator si no existe
    if (!envContent.includes('VALIDATOR_CONTRACT_ADDRESS')) {
      envContent += `\nVALIDATOR_CONTRACT_ADDRESS=${validatorAddress}`;
    } else {
      envContent = envContent.replace(
        /VALIDATOR_CONTRACT_ADDRESS=.*/,
        `VALIDATOR_CONTRACT_ADDRESS=${validatorAddress}`
      );
    }

    fs.writeFileSync('.env', envContent);

    // Mostrar resumen
    console.log('🎉 ¡Despliegue completado exitosamente!\n');
    console.log('📊 Resumen de contratos desplegados:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔍 TrueBlockValidator:     ${validatorAddress}`);
    console.log(`📰 TruthBoard:             ${truthBoardAddress}`);
    console.log(`💾 TruthBoardFilecoin:     ${truthBoardFilecoinAddress}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🌐 Red: Filecoin Mainnet (Chain ID: 314)`);
    console.log(`💰 Deployer: ${wallet.address}`);
    console.log(`🔗 RPC: ${process.env.FILECOIN_RPC_URL}`);
    console.log('\n✅ Archivo .env actualizado con las nuevas direcciones');
    console.log('🚀 ¡Listo para iniciar el backend!');

  } catch (error) {
    console.error('❌ Error durante el despliegue:', error);

    if (error.message.includes('insufficient funds')) {
      console.log('\n💡 Soluciones posibles:');
      console.log('• Obtener FIL de un faucet (para testnet)');
      console.log('• Transferir FIL a la dirección del deployer');
      console.log('• Verificar que tienes suficiente balance para gas');
    }

    if (error.message.includes('network')) {
      console.log('\n💡 Problemas de red:');
      console.log('• Verificar conectividad a internet');
      console.log('• Comprobar que el RPC de Filecoin esté funcionando');
      console.log('• Intentar con un RPC alternativo');
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
