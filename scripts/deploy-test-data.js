const { ethers } = require('ethers');
const newsService = require('../src/services/newsService');
const validationService = require('../src/services/validationService');
const stakingService = require('../src/services/stakingService');
const oracleService = require('../src/services/oracleService');

/**
 * Script para desplegar datos de prueba para testing
 * Crea al menos 3 elementos de cada categoría principal
 */

async function deployTestData() {
  console.log('🚀 Iniciando despliegue de datos de prueba...\n');

  try {
    // 1. Crear noticias de prueba
    console.log('📰 Creando noticias de prueba...');
    await createTestNews();

    // 2. Crear oráculos de prueba
    console.log('🤖 Creando oráculos de prueba...');
    await createTestOracles();

    // 3. Crear validadores de prueba
    console.log('👥 Creando validadores de prueba...');
    await createTestValidators();

    // 4. Crear validaciones de prueba
    console.log('✅ Creando validaciones de prueba...');
    await createTestValidations();

    // 5. Crear artículos TruthBoard de prueba
    console.log('🔒 Creando artículos TruthBoard de prueba...');
    await createTestTruthBoardArticles();

    console.log('\n✅ Datos de prueba desplegados exitosamente!');
    console.log('🔗 Puedes probar la API en: http://localhost:3000/health');

  } catch (error) {
    console.error('❌ Error al desplegar datos de prueba:', error);
    process.exit(1);
  }
}

async function createTestNews() {
  const testNews = [
    {
      url: 'https://example.com/news/bitcoin-price-surge',
      title: 'Bitcoin alcanza nuevo máximo histórico de $100,000',
      content: 'El precio de Bitcoin ha alcanzado un nuevo máximo histórico de $100,000 dólares, impulsado por la adopción institucional y las regulaciones favorables. Los analistas predicen que podría llegar a $150,000 antes de fin de año.',
      category: 'cryptocurrency',
      source: 'CryptoNews'
    },
    {
      url: 'https://example.com/news/ai-breakthrough',
      title: 'Nueva IA desarrollada por OpenAI supera capacidades humanas en matemáticas',
      content: 'OpenAI ha anunciado el desarrollo de una nueva inteligencia artificial que puede resolver problemas matemáticos complejos superando las capacidades humanas promedio. Este avance marca un hito en el desarrollo de AGI.',
      category: 'technology',
      source: 'TechCrunch'
    },
    {
      url: 'https://example.com/news/climate-action',
      title: 'Acuerdo global para reducir emisiones de carbono en 50% para 2030',
      content: 'Los líderes mundiales han firmado un acuerdo histórico para reducir las emisiones de carbono en un 50% antes de 2030. El acuerdo incluye inversiones masivas en energía renovable y tecnologías de captura de carbono.',
      category: 'environment',
      source: 'Climate News'
    },
    {
      url: 'https://example.com/news/fake-meteor',
      title: 'FALSO: Meteorito gigante impactará la Tierra mañana',
      content: 'Circula información falsa sobre un supuesto meteorito que impactaría la Tierra. NASA y otras agencias espaciales han desmentido categóricamente esta información.',
      category: 'science',
      source: 'FakeNewsSource',
      isFake: true
    },
    {
      url: 'https://example.com/news/medical-breakthrough',
      title: 'Descubierta cura para el Alzheimer en pruebas clínicas fase 3',
      content: 'Un nuevo tratamiento experimental ha mostrado resultados prometedores en la reversión de síntomas de Alzheimer en pacientes en fase temprana. Los resultados de fase 3 muestran una mejora del 80% en funciones cognitivas.',
      category: 'health',
      source: 'Medical Journal'
    }
  ];

  for (let i = 0; i < testNews.length; i++) {
    const news = testNews[i];
    console.log(`  📄 Creando noticia ${i + 1}: ${news.title.substring(0, 50)}...`);
    
    try {
      // Simular procesamiento de contenido
      const processedContent = await newsService.processContent({
        url: news.url,
        content: news.content,
        title: news.title
      });

      // Simular hash IPFS
      const contentHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      // Simular estado de validación
      const validationStatus = news.isFake ? 'fake' : (Math.random() > 0.3 ? 'verified' : 'uncertain');
      const score = news.isFake ? Math.floor(Math.random() * 30) + 10 : Math.floor(Math.random() * 30) + 70;

      console.log(`    ✓ Hash: ${contentHash}`);
      console.log(`    ✓ Estado: ${validationStatus} (${score} puntos)`);

    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
    }
  }
  console.log('✅ Noticias de prueba creadas\n');
}

async function createTestOracles() {
  const testOracles = [
    {
      address: '0x1234567890123456789012345678901234567890',
      specialization: 'fake_news',
      name: 'FakeNewsDetector AI',
      accuracy: 94.5,
      stake: '15.0'
    },
    {
      address: '0x2345678901234567890123456789012345678901',
      specialization: 'deepfake',
      name: 'DeepFake Analyzer',
      accuracy: 89.2,
      stake: '12.5'
    },
    {
      address: '0x3456789012345678901234567890123456789012',
      specialization: 'image_manipulation',
      name: 'Image Forensics AI',
      accuracy: 91.8,
      stake: '10.0'
    },
    {
      address: '0x4567890123456789012345678901234567890123',
      specialization: 'text_analysis',
      name: 'Bias Detection Engine',
      accuracy: 87.3,
      stake: '8.5'
    }
  ];

  for (let i = 0; i < testOracles.length; i++) {
    const oracle = testOracles[i];
    console.log(`  🤖 Registrando oráculo ${i + 1}: ${oracle.name}`);
    
    try {
      // Simular registro de oráculo
      const oracleId = `oracle_${Date.now()}_${i}`;
      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;

      console.log(`    ✓ ID: ${oracleId}`);
      console.log(`    ✓ Especialización: ${oracle.specialization}`);
      console.log(`    ✓ Precisión: ${oracle.accuracy}%`);
      console.log(`    ✓ Stake: ${oracle.stake} ETH`);
      console.log(`    ✓ TX: ${txHash}`);

    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
    }
  }
  console.log('✅ Oráculos de prueba registrados\n');
}

async function createTestValidators() {
  const testValidators = [
    {
      address: '0x5678901234567890123456789012345678901234',
      category: 'journalist',
      name: 'Professional Journalist',
      reputation: 850,
      stake: '5.0'
    },
    {
      address: '0x6789012345678901234567890123456789012345',
      category: 'fact_checker',
      name: 'Fact Checker Expert',
      reputation: 920,
      stake: '7.5'
    },
    {
      address: '0x7890123456789012345678901234567890123456',
      category: 'expert',
      name: 'Domain Expert',
      reputation: 780,
      stake: '10.0'
    },
    {
      address: '0x8901234567890123456789012345678901234567',
      category: 'community',
      name: 'Community Validator',
      reputation: 650,
      stake: '2.5'
    }
  ];

  for (let i = 0; i < testValidators.length; i++) {
    const validator = testValidators[i];
    console.log(`  👤 Registrando validador ${i + 1}: ${validator.name}`);
    
    try {
      // Simular registro de validador
      const validatorId = `validator_${Date.now()}_${i}`;
      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;

      console.log(`    ✓ ID: ${validatorId}`);
      console.log(`    ✓ Categoría: ${validator.category}`);
      console.log(`    ✓ Reputación: ${validator.reputation}`);
      console.log(`    ✓ Stake: ${validator.stake} ETH`);
      console.log(`    ✓ TX: ${txHash}`);

    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
    }
  }
  console.log('✅ Validadores de prueba registrados\n');
}

async function createTestValidations() {
  console.log('  🔍 Creando validaciones simuladas...');
  
  // Simular varias validaciones para las noticias creadas
  const validationResults = [
    { contentHash: 'QmFakeNews123', votes: 15, trueVotes: 2, fakeVotes: 13, score: 15 },
    { contentHash: 'QmRealNews456', votes: 12, trueVotes: 11, fakeVotes: 1, score: 92 },
    { contentHash: 'QmMedicalNews789', votes: 8, trueVotes: 7, fakeVotes: 1, score: 88 },
    { contentHash: 'QmCryptoNews012', votes: 20, trueVotes: 18, fakeVotes: 2, score: 90 },
    { contentHash: 'QmClimateNews345', votes: 14, trueVotes: 13, fakeVotes: 1, score: 93 }
  ];

  for (let i = 0; i < validationResults.length; i++) {
    const validation = validationResults[i];
    console.log(`    ✓ Validación ${i + 1}: ${validation.contentHash} - Score: ${validation.score}`);
    console.log(`      Votos: ${validation.trueVotes} real, ${validation.fakeVotes} fake`);
  }

  console.log('✅ Validaciones de prueba creadas\n');
}

async function createTestTruthBoardArticles() {
  const testArticles = [
    {
      title: 'Investigación: Corrupción en contratos públicos de infraestructura',
      content: 'Una investigación revela irregularidades en la adjudicación de contratos públicos por valor de $50 millones. Los documentos filtrados muestran vínculos entre funcionarios y empresas beneficiadas.',
      region: 'latam',
      category: 'corruption'
    },
    {
      title: 'Exposé: Empresa tecnológica vende datos de usuarios sin consentimiento',
      content: 'Documentos internos revelan que una importante empresa tecnológica ha estado vendiendo datos personales de millones de usuarios a terceros sin su consentimiento explícito.',
      region: 'usa',
      category: 'privacy'
    },
    {
      title: 'Investigación: Red de tráfico de influencias en sector energético',
      content: 'Fuentes internas revelan una compleja red de tráfico de influencias que ha permitido la aprobación irregular de proyectos energéticos controvertidos.',
      region: 'europe',
      category: 'energy'
    }
  ];

  for (let i = 0; i < testArticles.length; i++) {
    const article = testArticles[i];
    console.log(`  📝 Publicando artículo TruthBoard ${i + 1}: ${article.title.substring(0, 50)}...`);
    
    try {
      // Simular publicación anónima
      const articleId = `zk_article_${Date.now()}_${i}`;
      const citreaTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      const ipfsHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const donationAddress = `0x${Math.random().toString(16).substring(2, 42)}`;

      console.log(`    ✓ ID: ${articleId}`);
      console.log(`    ✓ Región: ${article.region}`);
      console.log(`    ✓ Citrea TX: ${citreaTxHash}`);
      console.log(`    ✓ IPFS: ${ipfsHash}`);
      console.log(`    ✓ Donaciones: ${donationAddress}`);

    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
    }
  }
  console.log('✅ Artículos TruthBoard de prueba creados\n');
}

// Ejecutar script si es llamado directamente
if (require.main === module) {
  deployTestData()
    .then(() => {
      console.log('🎉 Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en el script:', error);
      process.exit(1);
    });
}

module.exports = {
  deployTestData,
  createTestNews,
  createTestOracles,
  createTestValidators,
  createTestValidations,
  createTestTruthBoardArticles
};
