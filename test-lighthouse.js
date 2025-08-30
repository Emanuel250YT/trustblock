require('dotenv').config();
const LighthouseService = require('./src/services/lighthouseService');

async function testLighthouse() {
  console.log('🧪 Probando integración con Lighthouse...');

  try {
    // Inicializar servicio
    const lighthouse = new LighthouseService();

    if (!lighthouse.isConfigured()) {
      console.error('❌ Lighthouse no está configurado. Verifica LIGHTHOUSE_API_KEY.');
      return;
    }

    console.log('✅ Lighthouse configurado correctamente');

    // Probar upload de texto
    console.log('\n📝 Probando upload de texto...');

    const testNews = {
      title: 'Noticia de prueba TrueBlock',
      content: 'Esta es una noticia de prueba para verificar la integración con Lighthouse.',
      author: 'Sistema TrueBlock',
      timestamp: new Date().toISOString(),
      category: 'test'
    };

    const uploadResult = await lighthouse.uploadNews(testNews, {
      id: 'test_' + Date.now(),
      title: testNews.title
    });

    console.log('📊 Resultado del upload:');
    console.log(`  Hash: ${uploadResult.hash}`);
    console.log(`  Tamaño: ${lighthouse.formatBytes(uploadResult.size)}`);
    console.log(`  URL Gateway: ${uploadResult.gateway_url}`);
    console.log(`  URL Lighthouse: ${uploadResult.lighthouse_url}`);

    // Probar descarga
    console.log('\n📥 Probando descarga del contenido...');

    const downloadResult = await lighthouse.downloadContent(uploadResult.hash);

    console.log('✅ Contenido descargado exitosamente:');
    console.log(`  Título: ${downloadResult.metadata.title}`);
    console.log(`  Tipo: ${downloadResult.metadata.type}`);
    console.log(`  Timestamp: ${downloadResult.metadata.timestamp}`);

    console.log('\n🎉 ¡Prueba de Lighthouse completada exitosamente!');
    console.log(`\n🔗 Puedes ver el archivo en: ${uploadResult.lighthouse_url}`);

  } catch (error) {
    console.error('❌ Error en la prueba de Lighthouse:', error.message);
  }
}

// Ejecutar prueba
testLighthouse();
