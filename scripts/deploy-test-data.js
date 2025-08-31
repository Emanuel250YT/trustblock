const { ethers } = require('ethers');
const databaseService = require('../src/services/databaseService');
const ipfsService = require('../src/services/ipfsService');
const newsService = require('../src/services/newsService');

/**
 * Script para desplegar datos de prueba REALES para testing
 * Crea al menos 3 elementos de cada categoría principal y los guarda en DB
 */

async function deployTestData() {
  console.log('🚀 Iniciando despliegue de datos de prueba REALES...\n');

  try {
    // Inicializar base de datos
    await databaseService.initialize();

    // 1. Crear noticias de prueba REALES
    console.log('📰 Creando noticias de prueba REALES...');
    await createRealTestNews();

    // 2. Crear oráculos de prueba REALES
    console.log('🤖 Creando oráculos de prueba REALES...');
    await createRealTestOracles();

    // 3. Crear validadores de prueba REALES
    console.log('👥 Creando validadores de prueba REALES...');
    await createRealTestValidators();

    // 4. Crear validaciones de prueba REALES
    console.log('✅ Creando validaciones de prueba REALES...');
    await createRealTestValidations();

    // 5. Crear artículos TruthBoard de prueba REALES
    console.log('🔒 Creando artículos TruthBoard de prueba REALES...');
    await createRealTestTruthBoardArticles();

    // 6. Mostrar estadísticas finales
    console.log('📊 Mostrando estadísticas finales...');
    await showFinalStats();

    console.log('\n✅ Datos de prueba REALES desplegados exitosamente!');
    console.log('🔗 Puedes probar la API en: http://localhost:3000/health');
    console.log('📊 Ver estadísticas: http://localhost:3000/api/info');

  } catch (error) {
    console.error('❌ Error al desplegar datos de prueba:', error);
    process.exit(1);
  }
}

async function createRealTestNews() {
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
      // Procesar contenido real
      const processedContent = await newsService.processContent({
        url: news.url,
        content: news.content,
        title: news.title
      });

      // Subir a IPFS REAL
      const contentHash = await ipfsService.uploadContent({
        title: news.title,
        content: news.content,
        url: news.url,
        source: news.source,
        category: news.category,
        timestamp: new Date().toISOString()
      });
      
      // Determinar estado de validación
      const validationStatus = news.isFake ? 'fake' : (Math.random() > 0.3 ? 'verified' : 'uncertain');
      const score = news.isFake ? Math.floor(Math.random() * 30) + 10 : Math.floor(Math.random() * 30) + 70;

      // Guardar en base de datos REAL
      const savedNews = await databaseService.addNews({
        contentHash,
        title: news.title,
        content: news.content,
        url: news.url,
        source: news.source,
        category: news.category,
        status: validationStatus,
        score: score,
        isFake: news.isFake || false
      });

      console.log(`    ✅ Hash IPFS: ${contentHash}`);
      console.log(`    ✅ Estado: ${validationStatus} (${score} puntos)`);
      console.log(`    ✅ ID en DB: ${savedNews.id}`);

    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
    }
  }
  console.log('✅ Noticias REALES creadas y guardadas\n');
}

async function createRealTestOracles() {
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
      // Guardar en base de datos REAL
      const savedOracle = await databaseService.addOracle({
        address: oracle.address,
        name: oracle.name,
        specialization: oracle.specialization,
        accuracy: oracle.accuracy,
        stake: oracle.stake,
        reputation: 500 + Math.floor(oracle.accuracy * 5) // Basado en precisión
      });

      // Simular transaction hash (en producción sería real)
      const txHash = `0x${Math.random().toString(16).padStart(64, '0')}`;

      console.log(`    ✅ ID en DB: ${savedOracle.id}`);
      console.log(`    ✅ Especialización: ${oracle.specialization}`);
      console.log(`    ✅ Precisión: ${oracle.accuracy}%`);
      console.log(`    ✅ Stake: ${oracle.stake} ETH`);
      console.log(`    ✅ Reputación inicial: ${savedOracle.reputation}`);
      console.log(`    ✅ TX simulado: ${txHash}`);

    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
    }
  }
  console.log('✅ Oráculos REALES registrados y guardados\n');
}

async function createRealTestValidators() {
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
      // Guardar en base de datos REAL
      const savedValidator = await databaseService.addValidator({
        address: validator.address,
        name: validator.name,
        category: validator.category,
        reputation: validator.reputation,
        stake: validator.stake
      });

      // Simular transaction hash
      const txHash = `0x${Math.random().toString(16).padStart(64, '0')}`;

      console.log(`    ✅ ID en DB: ${savedValidator.id}`);
      console.log(`    ✅ Categoría: ${validator.category}`);
      console.log(`    ✅ Reputación: ${validator.reputation}`);
      console.log(`    ✅ Stake: ${validator.stake} ETH`);
      console.log(`    ✅ TX simulado: ${txHash}`);

    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
    }
  }
  console.log('✅ Validadores REALES registrados y guardados\n');
}

async function createRealTestValidations() {
  console.log('  🔍 Creando validaciones REALES...');
  
  // Obtener noticias creadas para validar
  const allNews = await databaseService.getNews();
  
  const validationResults = [
    { contentHash: allNews[0]?.contentHash, votes: 15, trueVotes: 2, fakeVotes: 13, score: 15, status: 'fake' },
    { contentHash: allNews[1]?.contentHash, votes: 12, trueVotes: 11, fakeVotes: 1, score: 92, status: 'verified' },
    { contentHash: allNews[2]?.contentHash, votes: 8, trueVotes: 7, fakeVotes: 1, score: 88, status: 'verified' },
    { contentHash: allNews[3]?.contentHash, votes: 20, trueVotes: 18, fakeVotes: 2, score: 90, status: 'verified' },
    { contentHash: allNews[4]?.contentHash, votes: 14, trueVotes: 13, fakeVotes: 1, score: 93, status: 'verified' }
  ];

  for (let i = 0; i < validationResults.length; i++) {
    const validation = validationResults[i];
    
    if (!validation.contentHash) {
      console.log(`    ⚠️ Saltando validación ${i + 1}: no hay noticia disponible`);
      continue;
    }
    
    try {
      // Guardar validación en base de datos REAL
      const savedValidation = await databaseService.addValidation({
        contentHash: validation.contentHash,
        totalVotes: validation.votes,
        trueVotes: validation.trueVotes,
        fakeVotes: validation.fakeVotes,
        score: validation.score,
        status: validation.status,
        finalized: true
      });

      console.log(`    ✅ Validación ${i + 1}: ${validation.contentHash.substring(0, 12)}... - Score: ${validation.score}`);
      console.log(`      Votos: ${validation.trueVotes} real, ${validation.fakeVotes} fake`);
      console.log(`      ID en DB: ${savedValidation.id}`);

    } catch (error) {
      console.log(`    ❌ Error en validación ${i + 1}: ${error.message}`);
    }
  }

  console.log('✅ Validaciones REALES creadas y guardadas\n');
}

async function createRealTestTruthBoardArticles() {
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
      // Subir contenido a IPFS REAL
      const ipfsHash = await ipfsService.uploadContent({
        title: article.title,
        content: article.content,
        region: article.region,
        category: article.category,
        timestamp: new Date().toISOString(),
        anonymous: true
      });

      // Simular transaction hash de Citrea
      const citreaTxHash = `0x${Math.random().toString(16).padStart(64, '0')}`;
      
      // Generar dirección de donación
      const donationAddress = `0x${Math.random().toString(16).padStart(40, '0')}`;

      // Guardar en base de datos REAL
      const savedArticle = await databaseService.addTruthBoardArticle({
        title: article.title,
        content: article.content,
        region: article.region,
        category: article.category,
        ipfsHash: ipfsHash,
        citreaTxHash: citreaTxHash,
        donationAddress: donationAddress
      });

      console.log(`    ✅ ID en DB: ${savedArticle.id}`);
      console.log(`    ✅ Región: ${article.region}`);
      console.log(`    ✅ IPFS Hash: ${ipfsHash}`);
      console.log(`    ✅ Citrea TX: ${citreaTxHash}`);
      console.log(`    ✅ Donaciones: ${donationAddress}`);
      console.log(`    ✅ Puntuación anonimato: ${savedArticle.anonymityScore}`);

    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
    }
  }
  console.log('✅ Artículos TruthBoard REALES creados y guardados\n');
}

async function showFinalStats() {
  try {
    const stats = await databaseService.getStats();
    const ipfsStats = await ipfsService.getStats();

    console.log('📊 ESTADÍSTICAS FINALES:');
    console.log(`  📰 Total noticias: ${stats.totalNews}`);
    console.log(`  ✅ Noticias verificadas: ${stats.verifiedNews}`);
    console.log(`  ❌ Noticias falsas: ${stats.fakeNews}`);
    console.log(`  🤖 Total oráculos: ${stats.totalOracles}`);
    console.log(`  👥 Total validadores: ${stats.totalValidators}`);
    console.log(`  🔍 Total validaciones: ${stats.totalValidations}`);
    console.log(`  🗳️ Total votos: ${stats.totalVotes}`);
    console.log(`  🔒 Artículos TruthBoard: ${stats.truthboardArticles}`);
    console.log(`  📁 IPFS - Total pins: ${ipfsStats.totalPins}`);
    console.log(`  📁 IPFS - Servicio: ${ipfsStats.service}`);

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
  }
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
  createRealTestNews,
  createRealTestOracles,
  createRealTestValidators,
  createRealTestValidations,
  createRealTestTruthBoardArticles,
  showFinalStats
};
