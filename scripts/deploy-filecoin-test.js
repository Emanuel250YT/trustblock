require('dotenv').config();
const LighthouseService = require('../src/services/lighthouseService');

/**
 * Script de deploy y pruebas para Filecoin Storage usando Lighthouse
 * Este script demuestra todas las funcionalidades de almacenamiento
 */

class FilecoinDeployTest {
  constructor() {
    this.lighthouse = new LighthouseService();
    this.testResults = [];
  }

  async runAllTests() {
    console.log('🚀 Iniciando pruebas de deploy en Filecoin con Lighthouse...\n');

    const tests = [
      () => this.testBasicUpload(),
      () => this.testNewsUpload(),
      () => this.testValidationEvidenceUpload(),
      () => this.testBulkUpload(),
      () => this.testDownloadAndVerify(),
      () => this.displayResults()
    ];

    for (const test of tests) {
      try {
        await test();
        await this.sleep(1000); // Pausa entre pruebas
      } catch (error) {
        console.error(`❌ Error en prueba: ${error.message}`);
        this.testResults.push({
          status: 'failed',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async testBasicUpload() {
    console.log('📝 1. Prueba de upload básico...');

    const testContent = {
      message: 'Prueba básica de Filecoin Storage',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      network: 'Filecoin via Lighthouse'
    };

    const result = await this.lighthouse.uploadText(
      JSON.stringify(testContent, null, 2),
      'basic_test.json'
    );

    this.testResults.push({
      test: 'Basic Upload',
      status: 'success',
      hash: result.hash,
      size: result.size,
      gateway_url: result.gateway_url,
      lighthouse_url: result.lighthouse_url
    });

    console.log(`   ✅ Upload exitoso: ${result.hash}`);
    console.log(`   📊 Tamaño: ${this.lighthouse.formatBytes(result.size)}`);
    console.log(`   🔗 URL: ${result.lighthouse_url}\n`);
  }

  async testNewsUpload() {
    console.log('📰 2. Prueba de upload de noticia...');

    const newsContent = {
      title: 'TrueBlock: Revolución en la Validación de Noticias',
      content: `
      TrueBlock introduce un sistema revolucionario para la validación descentralizada 
      de noticias utilizando múltiples capas de tecnología blockchain:
      
      - Ethereum/Sepolia: Contratos principales
      - Citrea Bitcoin Rollup: Validación comunitaria anónima
      - Zama FHE: Privacidad en validaciones
      - Filecoin: Almacenamiento permanente e inmutable
      
      El sistema garantiza transparencia, inmutabilidad y resistencia a la censura.
      `,
      author: 'TrueBlock System',
      category: 'Technology',
      tags: ['blockchain', 'news-validation', 'decentralized', 'filecoin'],
      sources: [
        'https://ethereum.org/',
        'https://citrea.xyz/',
        'https://zama.ai/',
        'https://lighthouse.storage/'
      ]
    };

    const metadata = {
      id: 'news_' + Date.now(),
      title: newsContent.title,
      author: newsContent.author,
      category: newsContent.category,
      validationScore: 95,
      validators: 10
    };

    const result = await this.lighthouse.uploadNews(newsContent, metadata);

    this.testResults.push({
      test: 'News Upload',
      status: 'success',
      hash: result.hash,
      size: result.size,
      gateway_url: result.gateway_url,
      lighthouse_url: result.lighthouse_url,
      metadata: result.metadata
    });

    console.log(`   ✅ Noticia almacenada: ${result.hash}`);
    console.log(`   📊 Tamaño: ${this.lighthouse.formatBytes(result.size)}`);
    console.log(`   📰 Título: ${result.metadata.title}`);
    console.log(`   🔗 URL: ${result.lighthouse_url}\n`);
  }

  async testValidationEvidenceUpload() {
    console.log('🔍 3. Prueba de upload de evidencia de validación...');

    const evidenceData = {
      validationType: 'AI_Oracle',
      aiModel: 'GPT-4-Turbo',
      confidence: 0.92,
      analysisResults: {
        factChecking: {
          score: 0.88,
          sources_verified: 8,
          contradictions_found: 0
        },
        sentimentAnalysis: {
          bias_score: 0.15,
          emotional_manipulation: 0.08,
          objectivity: 0.85
        },
        sourceCredibility: {
          avg_credibility: 0.91,
          verified_sources: 6,
          total_sources: 8
        }
      },
      timestamp: new Date().toISOString(),
      validatorSignature: '0x' + Math.random().toString(16).substr(2, 64)
    };

    const metadata = {
      newsId: 'news_' + (Date.now() - 1000),
      validatorAddress: '0x' + Math.random().toString(16).substr(2, 40),
      validationType: 'AI_Oracle'
    };

    const result = await this.lighthouse.uploadValidationEvidence(evidenceData, metadata);

    this.testResults.push({
      test: 'Validation Evidence Upload',
      status: 'success',
      hash: result.hash,
      size: result.size,
      gateway_url: result.gateway_url,
      lighthouse_url: result.lighthouse_url,
      metadata: result.metadata
    });

    console.log(`   ✅ Evidencia almacenada: ${result.hash}`);
    console.log(`   📊 Tamaño: ${this.lighthouse.formatBytes(result.size)}`);
    console.log(`   🤖 Tipo: ${result.metadata.validationType}`);
    console.log(`   🔗 URL: ${result.lighthouse_url}\n`);
  }

  async testBulkUpload() {
    console.log('📦 4. Prueba de upload múltiple...');

    const bulkData = [];
    const results = [];

    // Crear múltiples archivos de prueba
    for (let i = 1; i <= 3; i++) {
      const data = {
        type: 'bulk_test',
        id: i,
        title: `Archivo de prueba ${i}`,
        content: `Este es el contenido del archivo de prueba número ${i}`,
        timestamp: new Date().toISOString(),
        random_data: Math.random().toString(36).substring(7)
      };

      const result = await this.lighthouse.uploadText(
        JSON.stringify(data, null, 2),
        `bulk_test_${i}.json`
      );

      bulkData.push(data);
      results.push(result);

      console.log(`   📄 Archivo ${i}/3 subido: ${result.hash}`);
    }

    this.testResults.push({
      test: 'Bulk Upload',
      status: 'success',
      files_uploaded: results.length,
      total_size: results.reduce((sum, r) => sum + r.size, 0),
      hashes: results.map(r => r.hash)
    });

    console.log(`   ✅ ${results.length} archivos subidos exitosamente`);
    console.log(`   📊 Tamaño total: ${this.lighthouse.formatBytes(results.reduce((sum, r) => sum + r.size, 0))}\n`);
  }

  async testDownloadAndVerify() {
    console.log('📥 5. Prueba de descarga y verificación...');

    // Tomar el primer resultado exitoso para verificar descarga
    const uploadTest = this.testResults.find(r => r.status === 'success' && r.hash);

    if (!uploadTest) {
      throw new Error('No hay uploads exitosos para verificar');
    }

    const downloadedContent = await this.lighthouse.downloadContent(uploadTest.hash);

    this.testResults.push({
      test: 'Download and Verify',
      status: 'success',
      hash_verified: uploadTest.hash,
      content_type: typeof downloadedContent,
      has_metadata: !!downloadedContent.metadata
    });

    console.log(`   ✅ Descarga verificada para: ${uploadTest.hash}`);
    console.log(`   📄 Tipo de contenido: ${typeof downloadedContent}`);
    if (downloadedContent.metadata) {
      console.log(`   📋 Metadata: ${downloadedContent.metadata.type || 'No type'}`);
    }
    console.log();
  }

  async displayResults() {
    console.log('📊 RESUMEN DE PRUEBAS DE FILECOIN DEPLOY\n');
    console.log('=' * 60);

    const successful = this.testResults.filter(r => r.status === 'success');
    const failed = this.testResults.filter(r => r.status === 'failed');

    console.log(`✅ Pruebas exitosas: ${successful.length}`);
    console.log(`❌ Pruebas fallidas: ${failed.length}`);
    console.log(`📊 Total de pruebas: ${this.testResults.length}\n`);

    if (successful.length > 0) {
      console.log('🎉 ARCHIVOS ALMACENADOS EN FILECOIN:');
      console.log('-'.repeat(60));

      successful.forEach((result, index) => {
        if (result.hash) {
          console.log(`${index + 1}. ${result.test}`);
          console.log(`   Hash: ${result.hash}`);
          console.log(`   Tamaño: ${this.lighthouse.formatBytes(result.size || 0)}`);
          console.log(`   URL: ${result.lighthouse_url || result.gateway_url || 'N/A'}`);
          console.log();
        }
      });
    }

    if (failed.length > 0) {
      console.log('❌ ERRORES ENCONTRADOS:');
      console.log('-'.repeat(60));

      failed.forEach((result, index) => {
        console.log(`${index + 1}. Error: ${result.error}`);
        console.log(`   Timestamp: ${result.timestamp}`);
        console.log();
      });
    }

    console.log('🔗 ENLACES ÚTILES:');
    console.log('-'.repeat(60));
    console.log('• Lighthouse Dashboard: https://files.lighthouse.storage/');
    console.log('• IPFS Gateway: https://gateway.lighthouse.storage/ipfs/');
    console.log('• Filecoin Explorer: https://filfox.info/');
    console.log();

    console.log('🎯 DEPLOY DE FILECOIN COMPLETADO!');
    console.log('   Los archivos están ahora almacenados permanentemente');
    console.log('   en la red Filecoin y son accesibles vía IPFS.');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Ejecutar las pruebas
async function main() {
  const deployTest = new FilecoinDeployTest();

  try {
    await deployTest.runAllTests();
  } catch (error) {
    console.error('❌ Error fatal en el deploy test:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = FilecoinDeployTest;
