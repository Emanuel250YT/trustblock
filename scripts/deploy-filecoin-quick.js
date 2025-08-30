require('dotenv').config();
const LighthouseService = require('../src/services/lighthouseService');

/**
 * Script de deploy rápido para Filecoin
 * Uso: node scripts/deploy-filecoin-quick.js "Tu contenido aquí"
 */

async function quickDeploy() {
  const lighthouse = new LighthouseService();

  // Obtener contenido desde argumentos de línea de comandos
  const content = process.argv[2] || 'Contenido de prueba TrueBlock - ' + new Date().toISOString();

  console.log('🚀 Deploy rápido a Filecoin...');
  console.log(`📝 Contenido: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`);

  try {
    const result = await lighthouse.uploadText(content, `quick_deploy_${Date.now()}.txt`);

    console.log('\n✅ Deploy exitoso!');
    console.log('📊 Detalles:');
    console.log(`   Hash: ${result.hash}`);
    console.log(`   Tamaño: ${lighthouse.formatBytes(result.size)}`);
    console.log(`   Gateway: ${result.gateway_url}`);
    console.log(`   Lighthouse: ${result.lighthouse_url}`);

    console.log('\n🔗 URLs para compartir:');
    console.log(`   📱 Móvil/Desktop: ${result.lighthouse_url}`);
    console.log(`   🌐 IPFS Gateway: ${result.gateway_url}`);

    return result;

  } catch (error) {
    console.error('❌ Error en deploy:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  quickDeploy();
}

module.exports = quickDeploy;
